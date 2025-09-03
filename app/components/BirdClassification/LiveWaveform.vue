<template>
  <div class="flex flex-col items-center justify-center w-full max-w-5xl">
    <UICard
      class="relative w-full h-[5em]"
      depth="overlay"
      :opacity="0.5"
    >
      <canvas
        ref="waveformCanvas"
        class="w-full h-full"
        :width="canvasWidth"
        :height="canvasHeight"
      />
    </UICard>
  </div>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';
import { useAudio } from '@/composables/audio';
const { COLORS } = useConstants();
const { isRecording, analyserNode } = useAudio();

const props = withDefaults(defineProps<{
  activeColor?: keyof typeof COLORS;
  inactiveColor?: keyof typeof COLORS;
  lineWidth?: number;
  lineSpacing?: number;
  updateInterval?: number; // in milliseconds
  smoothingFactor?: number;
}>(), {
  activeColor: 'text-100',
  inactiveColor: 'overlay-100',
  lineWidth: 5,
  lineSpacing: 5,
  updateInterval: 50, // in milliseconds
  smoothingFactor: 0.3
});

const waveformCanvas = ref<HTMLCanvasElement | null>(null);
const canvasContext = ref<CanvasRenderingContext2D | null>(null);
const canvasWidth = ref(0);
const canvasHeight = ref(0);
const animationId = ref<number | null>(null);
const lastUpdateTime = ref(0);
const audioBuffer = ref<Float32Array>(new Float32Array(0));

const lineHeights = ref<Uint8Array | null>(null);
const targetLineHeights = ref<Uint8Array | null>(null);
const lineActiveStates = ref<boolean[] | null>(null);

const lineCount = computed(() => {
  if (canvasWidth.value === 0) return 0;
  return Math.floor(canvasWidth.value / (props.lineWidth! + props.lineSpacing!));
});
const lineColorActive = computed(() => COLORS[props.activeColor || 'subtext-100']);
const lineColorInactive = computed(() => COLORS[props.inactiveColor || 'overlay-100']);

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', initCanvas);
  startAnimation();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', initCanvas);
  stopAnimation();
});

function initCanvas() {
  if (!waveformCanvas.value) return;
  const rect = waveformCanvas.value.getBoundingClientRect();
  canvasWidth.value = rect.width;
  canvasHeight.value = rect.height;
  if (canvasContext.value) {
    canvasContext.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  }
  canvasContext.value = waveformCanvas.value.getContext('2d');
  lineHeights.value = new Uint8Array(lineCount.value);
  targetLineHeights.value = new Uint8Array(lineCount.value);
  lineActiveStates.value = new Array(lineCount.value).fill(false);
}

function startAnimation() {
  const animate = (currentTime: number) => {
    updateAudioBuffer();

    if (currentTime - lastUpdateTime.value >= props.updateInterval!) {
      updateWaveformData();
      lastUpdateTime.value = currentTime;
    }

    interpolateLineHeights();
    drawWaveform();
    animationId.value = requestAnimationFrame(animate);
  };
  animate(0);
}

function stopAnimation() {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
    animationId.value = null;
  }
}

function updateAudioBuffer() {
  if (!analyserNode.value) return;

  const timeData = new Float32Array(analyserNode.value.fftSize);
  analyserNode.value.getFloatTimeDomainData(timeData);
  const combinedLength = audioBuffer.value.length + timeData.length;
  const newBuffer = new Float32Array(combinedLength);
  newBuffer.set(audioBuffer.value);
  newBuffer.set(timeData, audioBuffer.value.length);
  audioBuffer.value = newBuffer;
}

function clearAudioBuffer() {
  audioBuffer.value = new Float32Array(0);
}

function getCurrentAmplitude() {
  if (audioBuffer.value.length === 0) return 0;
  const buffer = audioBuffer.value;
  buffer.map(v => Math.abs(v));
  let sum = 0;
  let max = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i]! ** 2;
    if (buffer[i]! > max) max = buffer[i]!;
  }
  clearAudioBuffer();
  return max;
  return Math.sqrt(sum / buffer.length);
}
  

function updateWaveformData() {
  lineActiveStates.value!.pop();
  lineActiveStates.value!.unshift(isRecording.value);
  targetLineHeights.value!.copyWithin(1, 0, lineCount.value - 1);
  targetLineHeights.value![0] = getNextLineHeight();
}

function interpolateLineHeights() {
  for (let i = 0; i < lineCount.value; i++) {
    if (!lineActiveStates.value![i]!) {
      lineHeights.value![i] = 0;
      continue;
    }
    const smoothing = lineActiveStates.value![i]! ? props.smoothingFactor! : props.smoothingFactor! * 4;
    const current = lineHeights.value![i]!;
    const target = targetLineHeights.value![i]!;
    lineHeights.value![i] = current + (target - current) * smoothing;
  }
}

function drawWaveform() {
  if (!canvasContext.value) return;
  canvasContext.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  canvasContext.value.lineWidth = props.lineWidth!;
  canvasContext.value.lineCap = 'round';

  for (let i = 0; i < lineCount.value; i++) {
    const x = (lineCount.value - i - 1) * (props.lineWidth! + props.lineSpacing!) + props.lineWidth! / 2;
    const centerLineY = canvasHeight.value / 2;
    canvasContext.value.beginPath();
    canvasContext.value.strokeStyle = lineActiveStates.value![i]! ? lineColorActive.value : lineColorInactive.value;
    canvasContext.value.moveTo(x, (centerLineY - 0.5) - lineHeights.value![i]! / 2);
    canvasContext.value.lineTo(x, (centerLineY + 0.5) + lineHeights.value![i]! / 2);
    canvasContext.value.stroke();
    canvasContext.value.closePath();
  }
}

function getNextLineHeight() {
  if (!isRecording.value) return 0;
  return getCurrentAmplitude() * canvasHeight.value * 0.9;
}
</script>