<template>
  <div
    class="w-full flex flex-row items-center text-base gap-2 my-(--s-em)"
  >
    <div
      class="relative aspect-square p-(--m-em) transition-colors duration-600 rounded-full pointer-cursor"
      :style="{
        backgroundColor: playing ? COLORS['surface-100'] : COLORS['surface-300']
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
          class="text-subtext-200 text-sm font-bold"
        >
          {{ timeDisplay }}
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
      class="relative aspect-square p-(--m-em) text-subtext-300 hover:text-text-100 transition-colors duration-500"
    >
      <div
        class="absolute left-0 right-0 bottom-0 aspect-square rounded-full z-5 transition-colors duration-500"
        :style="{ 
          backgroundColor: volumeControlOpen ? COLORS['surface-100'] : COLORS['surface-300']
        }"
        @click="toggleVolumeControl"
      />
      <div
        ref="volumeControlSurface"
        class="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center bg-surface-300 rounded-full"        
      >
        <div class="relative h-full bg-base-100 w-2 rounded-full mt-(--s-em) mb-[4em]">
          <div 
            class="absolute left-0 bottom-0 right-0"
            :style="{
              height: `${volume * 100}%`,
              borderRadius: '0 0 10em 10em',
              background: `linear-gradient(180deg, ${COLORS[props.color2!]} 0%, ${COLORS[props.color1!]} 100%)`
            }"
          />
          <div 
            ref="volumeControlSliderHead"
            class="absolute h-2 aspect-square scale-150 rounded-full"
            :style="{
              backgroundColor: COLORS[props.color1!]
            }"
            @mouseenter="volumeControlHoverEnter"
            @mouseleave="volumeControlHoverLeave"
          />
        </div>
      </div>
      <Icon
        :name="volume === 0 ? 'material-symbols:no-sound-rounded' : volume < 0.5 ? 'material-symbols:volume-down-rounded' : 'material-symbols:volume-up-rounded'"
        class="absolute text-4xl -translate-x-1/2 -translate-y-1/2 z-5 pointer-events-none"
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
const volumeControlSurface = ref<HTMLElement | null>(null);
const volumeControlSliderHead = ref<HTMLElement | null>(null);

const playing = ref(false);
const volumeControlOpen = ref(false);
const volume = ref(1.0);
const progress = ref(0);
const playheadPosition = ref(0);
const isDraggingPlayhead = ref(false);
const isDraggingVolume = ref(false);
const currentTime = ref(0);
const duration = ref(0);

// Format time in mm:ss format
const formatTime = (time: number) => {
  if (isNaN(time) || time === 0 || !isFinite(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const timeDisplay = computed(() => {
  return `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`;
});

function openVolumeControl() {
  const timeline = gsap.timeline();
  timeline.to(volumeControlSurface.value, {
    top: '-7.5em',
    duration: 0.3,
    ease: "back.out"
  });
}

function closeVolumeControl() {
  const timeline = gsap.timeline();
  timeline.to(volumeControlSurface.value, {
    top: '0em',
    duration: 0.3,
    ease: "power2.in"
  });
}

function togglePlay() {
  if (!audio.value) return;
  
  if (playing.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
}

function toggleVolumeControl() {
  if (volumeControlOpen.value) {
    closeVolumeControl();
  } else {
    openVolumeControl();
  }
  volumeControlOpen.value = !volumeControlOpen.value;
}

// Watch for volume changes and apply to audio element
watch(volume, (newVolume) => {
  if (audio.value) {
    audio.value.volume = newVolume;
  }
});

// Debug duration changes
watch(duration, (newDuration) => {
  console.log('Duration changed:', newDuration);
});

function handlePlayheadGrab() {
  isDraggingPlayhead.value = true;
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
  isDraggingPlayhead.value = false;
  
  // Seek audio to new position
  if (audio.value && audio.value.duration) {
    audio.value.currentTime = progress.value * audio.value.duration;
  }
  
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
  if (isDraggingPlayhead.value) return;
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
  if (isDraggingPlayhead.value) return;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(playhead.value, {
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function handleVolumeGrab() {
  isDraggingVolume.value = true;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(volumeControlSliderHead.value, {
      scale: 2.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function handleVolumeRelease() {
  isDraggingVolume.value = false;
  const ctx = initContext();
  ctx.add(() => {
    // Clear the draggable transform and return to CSS positioning
    gsap.set(volumeControlSliderHead.value, { y: 0 });
    gsap.to(volumeControlSliderHead.value, {
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function volumeControlHoverEnter() {
  console.log('hover enter');
  if (isDraggingVolume.value) return;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(volumeControlSliderHead.value, {
      scale: 2.0,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function volumeControlHoverLeave() {
  console.log('hover leave');
  if (isDraggingVolume.value) return;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(volumeControlSliderHead.value, {
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

onMounted(() => {
  if (audio.value) {
    // Set up audio event listeners
    audio.value.addEventListener('play', () => {
      playing.value = true;
    });
    
    audio.value.addEventListener('pause', () => {
      playing.value = false;
    });
    
    audio.value.addEventListener('ended', () => {
      playing.value = false;
      progress.value = 0;
      playheadPosition.value = 0;
      currentTime.value = 0;
    });
    
    audio.value.addEventListener('timeupdate', () => {
      if (!isDraggingPlayhead.value && audio.value) {
        currentTime.value = audio.value.currentTime;
        
        // Try to get duration if we don't have it yet
        if (duration.value === 0 && !isNaN(audio.value.duration)) {
          duration.value = audio.value.duration;
          console.log('timeupdate - got duration:', audio.value.duration);
        }
        
        const currentProgress = audio.value.currentTime / audio.value.duration;
        progress.value = isNaN(currentProgress) ? 0 : currentProgress;
        playheadPosition.value = progress.value;
      }
    });
    
    audio.value.addEventListener('loadedmetadata', () => {
      if (audio.value) {
        console.log('loadedmetadata - duration:', audio.value.duration);
        duration.value = audio.value.duration;
        audio.value.volume = volume.value;
      }
    });
    
    audio.value.addEventListener('durationchange', () => {
      if (audio.value && !isNaN(audio.value.duration)) {
        console.log('durationchange - duration:', audio.value.duration);
        duration.value = audio.value.duration;
      }
    });
    
    audio.value.addEventListener('canplay', () => {
      if (audio.value && !isNaN(audio.value.duration)) {
        console.log('canplay - duration:', audio.value.duration);
        duration.value = audio.value.duration;
      }
    });
  }

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