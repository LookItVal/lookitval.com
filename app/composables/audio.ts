const audioContext = ref<AudioContext | null>(null);
const isRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const audioBlob = ref<Blob | null>(null);
const analyserNode = ref<AnalyserNode | null>(null);

export const useAudio = () => {
  const toggleRecording = async () => {
    if (isRecording.value) {
      stopRecording();
    } else {
      await startRecording();
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder.value = new MediaRecorder(stream);

      audioContext.value = new AudioContext();
      const source = audioContext.value.createMediaStreamSource(stream);
      analyserNode.value = audioContext.value.createAnalyser();
      analyserNode.value.fftSize = 1024; //  roughly 21ms at 48kHz
      source.connect(analyserNode.value);
      
      isRecording.value = true;
      audioChunks.value = [];

      mediaRecorder.value.start();
      mediaRecorder.value.ondataavailable = (event) => {
        audioChunks.value.push(event.data);
      };
      
      mediaRecorder.value.onstop = () => {
        isRecording.value = false;
        audioBlob.value = new Blob(audioChunks.value, { type: 'audio/wav' });
        audioChunks.value = [];
      };
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
      mediaRecorder.value.stop();
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    }

    if (audioContext.value) {
      audioContext.value.close();
    }

    isRecording.value = false;
  }

  return {
    audioBlob,
    isRecording,
    analyserNode,
    startRecording,
    stopRecording,
    toggleRecording
  };
};