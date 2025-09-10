import { usePython } from './python';
const { runPython, installPackage, initialize, isReady} = usePython();
const { latitude, longitude, elevation, requestAccess } = useLocation();
const bufferSize = ref(3); // length of the classifier buffer
const classifierBuffer = ref<string[]>([]); // buffer to hold recent classifications
const loadingProgress = ref(0);
const loadingStep = ref<string>('Initializing Python environment');

export const useClassifier = () => {
  const initPackages = async () => {
    const steps = 15; // Total number of steps
    const updateProgress = (step: string) => { loadingProgress.value += 1 / steps; loadingStep.value = step; };
    if (!isReady.value) {
      await initialize();
    }
    updateProgress('Loading location data');

    requestAccess(); // Request location access
    updateProgress('Installing Pandas from CDN');

    // Install necessary Python packages
    await installPackage('pandas');
    updateProgress('Installing Numpy from CDN');
    await installPackage('numpy');
    updateProgress('Installing Scipy from CDN');
    await installPackage('scipy');
    updateProgress('Installing Scikit-learn from CDN');
    await installPackage('scikit-learn');
    updateProgress('Downloading Audio Preprocessing Code');

    const pythonCode = await fetch('/scripts/birdClassifier.py').then(res => res.text());
    updateProgress('Formatting Audio Preprocessing Code');
    const lines = pythonCode.split('\n');
    const initPythonLines = lines.slice(0, lines.findIndex(line => line.startsWith('import pandas'))).join('\n');
    const initPandas = lines.slice(lines.findIndex(line => line.startsWith('import pandas')), lines.findIndex(line => line.startsWith('import numpy'))).join('\n');
    const initNumpy = lines.slice(lines.findIndex(line => line.startsWith('import numpy')), lines.findIndex(line => line.startsWith('from sklearn'))).join('\n');
    const initSKLearn = lines.slice(lines.findIndex(line => line.startsWith('from sklearn')), lines.findIndex(line => line.startsWith('from scipy'))).join('\n');
    const initScipy = lines.slice(lines.findIndex(line => line.startsWith('from scipy')), lines.findIndex(line => line.startsWith('def '))).join('\n');
    const mainCode = lines.slice(lines.findIndex(line => line.startsWith('def '))).join('\n');
    updateProgress('Initializing Python Packages');
    await runPython(initPythonLines);
    updateProgress('Initializing Pandas Packages');
    await runPython(initPandas);
    updateProgress('Initializing Numpy Packages');
    await runPython(initNumpy);
    updateProgress('Initializing Scikit-learn Packages');
    await runPython(initSKLearn);
    updateProgress('Initializing Scipy Packages');
    await runPython(initScipy);
    updateProgress('Loading Audio Preprocessing Code');
    await runPython(mainCode);
    updateProgress('Loading Model');
    await runPython('await load_model()');
    updateProgress('Initialization Complete');
  };

  const updateBufferSize = (newSize: number) => {
    bufferSize.value = newSize;
  };

  const addToBuffer = (classification: string) => {
    classifierBuffer.value.push(classification);
    if (classifierBuffer.value.length > bufferSize.value) {
      classifierBuffer.value.shift();
    }
  };

  const classifySignal = async (signal: Float32Array, sample_rate: number) => {
    // Call the Python function to classify the signal
    let pythonCode = '';
    pythonCode += 'metadata = {}\n';
    pythonCode += `metadata['date'] = '${new Date().toISOString().slice(0,10)}'\n`;
    pythonCode += `metadata['time'] = '${new Date().toLocaleTimeString([], { timeStyle: 'short'}).split(' ').join('').toLowerCase()}'\n`;
    pythonCode += `metadata['latitude'] = float(${latitude.value ?? '0'})\n`;
    pythonCode += `metadata['longitude'] = float(${longitude.value ?? '0'})\n`;
    pythonCode += `metadata['elevation'] = float(${elevation.value ?? '0'})\n`;
    pythonCode += 'signal = np.array(SOURCE_SIGNAL, dtype=np.float32)\n';
    pythonCode += 'sample_rate = SOURCE_SAMPLE_RATE\n';
    pythonCode += 'classify_bird(signal, sample_rate, metadata)\n';
    const locals = { SOURCE_SIGNAL: signal, SOURCE_SAMPLE_RATE: sample_rate };
    const classification = await runPython(pythonCode, locals);
    addToBuffer(classification);
  };

  return {
    initPackages,
    classifySignal,
    classifierBuffer,
    updateBufferSize,
    loadingProgress,
    loadingStep
  };
};