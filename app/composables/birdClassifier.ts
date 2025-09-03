import { usePython } from './python';
const { runPython, installPackage } = usePython();
const bufferSize = ref(3); // length of the classifier buffer
const classifierBuffer = ref<string[]>([]); // buffer to hold recent classifications

export const useClassifier = () => {
  const updateBufferSize = (newSize: number) => {
    bufferSize.value = newSize;
  };

  const addToBuffer = (classification: string) => {
    classifierBuffer.value.push(classification);
    if (classifierBuffer.value.length > bufferSize.value) {
      classifierBuffer.value.shift();
    }
  };

  const classifySignal = async (signal: Float32Array) => {
    // Call the Python function to classify the signal
    console.log('Classifying signal:', signal);
    console.log('length of signal:', signal.length);
    const result = (classifierBuffer.value[classifierBuffer.value.length - 1] ? Number(classifierBuffer.value[classifierBuffer.value.length - 1]) + 1 : 1).toString();
    addToBuffer(result);
  };

  return {
    classifySignal,
    classifierBuffer,
    updateBufferSize
  };
};