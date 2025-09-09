import { usePython } from './python';
const { runPython, installPackage, initialize, isReady} = usePython();
const { latitude, longitude, elevation, requestAccess } = useLocation();
const bufferSize = ref(3); // length of the classifier buffer
const classifierBuffer = ref<string[]>([]); // buffer to hold recent classifications

export const useClassifier = () => {
  const initPackages = async () => {
    if (!isReady.value) {
      await initialize();
    }

    requestAccess(); // Request location access

    // Install necessary Python packages
    await installPackage('pandas');
    await installPackage('numpy');
    await installPackage('scipy');
    await installPackage('scikit-learn');

    const pythonCode = await fetch('/scripts/birdClassifier.py').then(res => res.text());
    await runPython(pythonCode);
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
    updateBufferSize
  };
};