<template>
  <div ref="vantaBirds" />
</template>

<script lang="js" setup>
import { useConstants } from '@/composables/constants';

const { COLORS } = useConstants();

const props = defineProps({
  mouseControls: {
    type: Boolean,
    default: true
  },
  touchControls: {
    type: Boolean,
    default: true
  },
  gyroControls: {
    type: Boolean,
    default: false
  },
  scale: {
    type: Number,
    default: 1.00
  },
  scaleMobile: {
    type: Number,
    default: 1.00
  },
  backgroundColor: {
    type: String,
    default: 'base-100'
  },
  backgroundAlpha: {
    type: Number,
    default: 0.0
  },
  color1: {
    type: String,
    default: 'mauve-500'
  },
  color2: {
    type: String,
    default: 'lavender-500'
  },
  colorMode: {
    type: String,
    default: 'lerpGradient'
  },
  birdSize: {
    type: Number,
    default: 1.6
  },
  wingSpan: {
    type: Number,
    default: 15.00
  },
  speedLimit: {
    type: Number,
    default: 5.00
  },
  separation: {
    type: Number,
    default: 20.00
  },
  alignment: {
    type: Number,
    default: 20.00
  },
  cohesion: {
    type: Number,
    default: 20.00
  },
  quantity: {
    type: Number,
    default: 5
  }
});

const validColor = (value) => Object.keys(COLORS).includes(value);

watchEffect(() => {
  if (!validColor(props.color1)) {
    console.warn(`color1 "${props.color1}" is not a valid color key in COLORS`);
  }
  if (!validColor(props.color2)) {
    console.warn(`color2 "${props.color2}" is not a valid color key in COLORS`);
  }
});

const vantaBirds = ref(null);
const vantaEffect = ref(null);

const backgroundColorValue = computed(() => {
  const hex = COLORS[props.backgroundColor];
  if (!hex) return 0x000000;
  return parseInt(hex.replace('#', ''), 16);
});

const color1Value = computed(() => {
  const hex = COLORS[props.color1];
  if (!hex) return 0x000000;
  return parseInt(hex.replace('#', ''), 16);
});

const color2Value = computed(() => {
  const hex = COLORS[props.color2];
  if (!hex) return 0x000000;
  return parseInt(hex.replace('#', ''), 16);
});

onMounted(async () => {
  if (!(process.client && vantaBirds.value)) return;
  
  const [{ default: BIRDS }, THREE] = await Promise.all([
    import('vanta/dist/vanta.birds.min'),
    import('three')
  ]);

  vantaEffect.value = BIRDS({
    el: vantaBirds.value,
    THREE: THREE,
    mouseControls: props.mouseControls,
    touchControls: props.touchControls,
    gyroControls: props.gyroControls,
    scale: props.scale,
    scaleMobile: props.scaleMobile,
    backgroundColor: backgroundColorValue.value,
    backgroundAlpha: props.backgroundAlpha,
    color1: color1Value.value,
    color2: color2Value.value,
    colorMode: props.colorMode,
    birdSize: props.birdSize,
    wingSpan: props.wingSpan,
    speedLimit: props.speedLimit,
    separation: props.separation,
    alignment: props.alignment,
    cohesion: props.cohesion,
    quantity: props.quantity
  });
});

onBeforeUnmount(() => {
  if (vantaEffect.value) vantaEffect.value.destroy();
});
</script>