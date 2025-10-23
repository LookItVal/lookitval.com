<template>
  <div
    class="w-full flex flex-row items-center text-base gap-2 my-(--s-em)"
  >
    <div
      class="relative aspect-square p-(--m-em) transition-colors duration-600 rounded-full pointer-cursor"
      :style="{
        backgroundColor: playing ? COLORS['surface-200'] : COLORS['surface-300']
      }"
      @click="togglePlay"
    >
      <Icon
        :name="playing ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'"
        :class="[ 'absolute text-4xl -translate-x-1/2 -translate-y-1/2 transition-colors duration-300', playing ? 'text-subtext-300 hover:text-text-100' : 'text-subtext-300 hover:text-text-100' ]"
      />
    </div>
    <div class="flex-1 flex flex-col">
      <div
        class="h-(--m-em) flex flex-row justify-between"
      >
        <p
          class="text-subtext-300 font-bold"
        >
          {{ props.title }}
        </p>
        <p
          class="text-subtext-200 text-sm"
        >
          {{ `0:00 / 0:00` }}
        </p>
      </div>
      <div
        class="h-(--m-em) flex items-center"
      >
        <div
          class="h-2 relative w-full bg-surface-200 rounded-full"
        >
          <div
            class="h-2 absolute left-0 top-0"
            :style="{
              borderRadius: '10em 0 0 10em',
              width: `${progress * 100}%`,
              background: `linear-gradient(10deg, ${COLORS[props.color1!]} 0%, ${COLORS[props.color2!]} 100%)`
            }"
          />
          <div
            ref="playhead"
            class="h-2 aspect-square absolute scale-150 rounded-full"
            :style="{
              left: `${playheadPosition * 100}%`,
              backgroundColor: COLORS[props.color1!]
            }"
            @mouseenter="playheadHoverEnter"
            @mouseleave="playheadHoverLeave"
          />
        </div>
      </div>
    </div>
    <div
      class="relative aspect-square p-(--m-em) transition-colors duration-600 rounded-full pointer-cursor"
      :style="{
        backgroundColor: volumeControlOpen ? COLORS['surface-200'] : COLORS['surface-300']
      }"
      @click="toggleVolumeControl"
    >
      <Icon
        :name="volume === 0 ? 'material-symbols:no-sound-rounded' : volume < 0.5 ? 'material-symbols:volume-down-rounded' : 'material-symbols:volume-up-rounded'"
        :class="[ 'absolute text-4xl -translate-x-1/2 -translate-y-1/2 transition-colors duration-300', volumeControlOpen ? 'text-subtext-300 hover:text-text-100' : 'text-subtext-300 hover:text-text-100' ]"
      />
    </div>
    <audio ref="audio" :src="src" :style="{ width: '100%' }"></audio>
  </div>
</template>

<script lang='ts' setup>
import { Draggable } from 'gsap/Draggable';
import { gsap } from 'gsap';

const { COLORS } = useConstants();
const { initContext } = useGsapAnimations();

const props = withDefaults(defineProps<{
  src: string,
  title: string,
  color1?: keyof typeof COLORS,
  color2?: keyof typeof COLORS
}>(), {
  color1: 'mauve-500',
  color2: 'lavender-500'
})

const playhead = ref<HTMLElement | null>(null);
const audio = ref<HTMLAudioElement | null>(null);

const playing = ref(false);
const volumeControlOpen = ref(false);
const volume = ref(1.0);
const progress = ref(0);
const playheadPosition = ref(0);
const isDragging = ref(false);

function togglePlay() {
  playing.value = !playing.value;
}

function toggleVolumeControl() {
  volumeControlOpen.value = !volumeControlOpen.value;
}

function handlePlayheadGrab() {
  isDragging.value = true;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(playhead.value, {
      scale: 2.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function handlePlayheadRelease() {
  isDragging.value = false;
  playheadPosition.value = progress.value;
  const ctx = initContext();
  ctx.add(() => {
    // Clear the draggable transform and return to CSS positioning
    gsap.set(playhead.value, { x: 0 });
    gsap.to(playhead.value, {
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}
  
function playheadHoverEnter() {
  if (isDragging.value) return;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(playhead.value, {
      scale: 2.0,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function playheadHoverLeave() {
  if (isDragging.value) return;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(playhead.value, {
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

onMounted(() => {
  if (playhead.value) {
    const ctx = initContext();
    ctx.add(() => {
      Draggable.create(playhead.value, {
        type: "x",
        bounds: playhead.value!.parentElement!,
        onPress: handlePlayheadGrab,
        onRelease: handlePlayheadRelease,
        onDrag: function() {
          const position = this.pointerX;
          const offset = playhead.value!.parentElement!.getBoundingClientRect().left;
          const progressValue = (position - offset) / playhead.value!.parentElement!.offsetWidth;
          progress.value = Math.max(0, Math.min(1, progressValue));
        }
      });
    });
  }
});
</script>