import { useClassifier } from './birdClassifier';
import { ref } from 'vue';
const { classifySignal } = useClassifier();

const audioContext = ref<AudioContext | null>(null);
const isRecording = ref(false);
const analyserNode = ref<AnalyserNode | null>(null);
const workletNode = ref<AudioWorkletNode | null>(null);
let streamRef: MediaStream | null = null;

// Buffer for collecting audio samples
const audioSampleRate = ref<number>(48000); 
const bufferSize = ref<number>(0); // 5 seconds worth of samples
const audioBuffer = ref<Float32Array | null>(null);
const sampleCount = ref<number>(0);
let processingInterval: number | null = null;
const isProcessing = ref(false); // Flag to prevent overlapping processing

export function useAudio() {
  const processAudioChunk = () => {
    // Skip if already processing or no data
    if (isProcessing.value || !audioBuffer.value || sampleCount.value === 0) return;
    
    try {
      isProcessing.value = true;
      
      // Only process if we have enough samples (at least 1 second of audio)
      const minSamples = audioSampleRate.value * 1;
      
      if (sampleCount.value >= minSamples) {
        // Create a copy of the collected samples
        const samplesForProcessing = audioBuffer.value.slice(0, sampleCount.value);
        
        // Process the samples
        classifySignal(samplesForProcessing, audioSampleRate.value);
      }
      
      // Reset the buffer for next chunk
      sampleCount.value = 0;
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    } finally {
      isProcessing.value = false;
    }
  };

  const toggleRecording = async () => {
    if (isRecording.value) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (isRecording.value) return;
    
    try {
      streamRef = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.value = new AudioContext({ latencyHint: 'interactive' });
      
      // Update sample rate from actual context
      audioSampleRate.value = audioContext.value.sampleRate;
      // Calculate buffer size for 5 seconds of audio
      bufferSize.value = audioSampleRate.value * 5;
      // Create buffer to hold 5 seconds of audio
      audioBuffer.value = new Float32Array(bufferSize.value);
      sampleCount.value = 0;
      isProcessing.value = false;

      // Set up audio source and analyzer
      const source = audioContext.value.createMediaStreamSource(streamRef);
      analyserNode.value = audioContext.value.createAnalyser();
      analyserNode.value.fftSize = 1024;
      source.connect(analyserNode.value);

      // Create inline AudioWorklet
      const processorCode = `
        class AudioCollector extends AudioWorkletProcessor {
          constructor() {
            super();
          }
          
          process(inputs) {
            const input = inputs[0];
            if (input && input.length > 0 && input[0].length > 0) {
              // Send raw audio samples to main thread
              this.port.postMessage({
                samples: input[0]
              });
            }
            return true; // Keep the processor alive
          }
        }
        registerProcessor('audio-collector', AudioCollector);
      `;
      
      const blob = new Blob([processorCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      await audioContext.value.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      // Create worklet node
      workletNode.value = new AudioWorkletNode(audioContext.value, 'audio-collector');
      
      // Handle incoming audio data
      workletNode.value.port.onmessage = (event) => {
        if (!audioBuffer.value || !isRecording.value) return;
        
        const { samples } = event.data;
        
        // If adding these samples would overflow the buffer, process what we have
        if (sampleCount.value + samples.length >= bufferSize.value) {
          processAudioChunk();
          // After processing, the buffer should be empty (sampleCount = 0)
        }
        
        // Add samples to buffer
        for (let i = 0; i < samples.length; i++) {
          if (sampleCount.value < bufferSize.value) {
            audioBuffer.value[sampleCount.value++] = samples[i];
          }
        }
      };

      // Connect source to worklet node
      source.connect(workletNode.value);
      
      // Set up timer to process chunks every 5 seconds
      // This ensures processing happens even if buffer doesn't fill up
      processingInterval = window.setInterval(processAudioChunk, 5000);
      
      isRecording.value = true;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      await stopRecording();
    }
  };

  const stopRecording = async () => {
    // Clear processing interval
    if (processingInterval !== null) {
      clearInterval(processingInterval);
      processingInterval = null;
    }
    
    // Process any remaining audio before stopping
    if (sampleCount.value > 0 && !isProcessing.value) {
      processAudioChunk();
    }
    
    // Clean up worklet
    if (workletNode.value) {
      try {
        workletNode.value.port.onmessage = null;
        workletNode.value.disconnect();
      } catch (e) { console.error('Error disconnecting worklet node:', e); }
      workletNode.value = null;
    }

    // Stop audio tracks
    if (streamRef) {
      streamRef.getTracks().forEach(track => track.stop());
      streamRef = null;
    }

    // Close audio context
    if (audioContext.value) {
      try { await audioContext.value.close(); } catch (e) { console.error('Error closing audio context:', e); }
      audioContext.value = null;
    }

    // Reset state
    analyserNode.value = null;
    audioBuffer.value = null;
    sampleCount.value = 0;
    isProcessing.value = false;
    isRecording.value = false;
  };

  return {
    isRecording,
    audioSampleRate,
    analyserNode,
    startRecording,
    stopRecording,
    toggleRecording
  };
}