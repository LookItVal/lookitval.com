<template>
  <div
    class="w-full flex flex-row items-center text-base gap-2 my-(--m-em) bg-base-100 rounded-full"
  >
    <div
      class="relative aspect-square p-(--m-em) transition-colors duration-600 rounded-full cursor-pointer text-subtext-300 hover:text-text-100"
      :style="{
        backgroundColor: playing ? COLORS['surface-200'] : COLORS['surface-300']
      }"
      @click="togglePlay"
    >
      <Icon
        :name="playing ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'"
        class="absolute text-4xl -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
      />
    </div>
    <div class="flex-1 flex flex-col">
      <div
        class="h-[1.25em] flex flex-row justify-between"
      >
        <p
          class="text-sm text-subtext-300 font-bold"
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
        class="h-(--s-em) flex items-center"
      >
        <div
          ref="progressTrack"
          class="h-2 relative w-full bg-crust-100 rounded-full cursor-pointer"
          @mouseenter="handlePlayheadHoverEnter"
          @mouseleave="handlePlayheadHoverLeave"
          @mousedown="handlePlayheadGrab"
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
            class="h-2 aspect-square absolute scale-150 rounded-full -translate-x-1/2"
            :style="{
              left: `${progress * 100}%`,
              backgroundColor: COLORS[props.color1!]
            }"
          />
        </div>
      </div>
    </div>
    <div
      class="relative aspect-square p-(--m-em) text-subtext-300 hover:text-text-100 transition-colors duration-500"
    >
      <div
        class="absolute left-0 right-0 bottom-0 aspect-square rounded-full z-5 transition-colors duration-500 cursor-pointer"
        :style="{ 
          backgroundColor: volumeControlOpen ? COLORS['surface-200'] : COLORS['surface-300']
        }"
        @click="toggleVolumeControl"
      />
      <div
        ref="volumeControlSurface"
        class="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center bg-surface-300 rounded-full"        
      >
        <div
          ref="volumeControlTrack"
          class="relative h-full bg-base-100 w-2 rounded-full mt-[1.25em] mb-[4em] cursor-pointer"
          @mouseenter="handleVolumeControlHoverEnter"
          @mouseleave="handleVolumeControlHoverLeave"
          @mousedown="handleVolumeGrab"
        >
          <div 
            ref="volumeControlFill"
            class="absolute left-0 bottom-0 right-0"
            :style="{
              height: `${volume * 100}%`,
              borderRadius: '0 0 10em 10em',
              background: `linear-gradient(180deg, ${COLORS[props.color2!]} 0%, ${COLORS[props.color1!]} 100%)`,
              visibility: volumeControlOpen ? 'visible' : 'hidden'
            }"
          />
          <div 
            ref="volumeControlSliderHead"
            class="absolute h-2 -bottom-1 aspect-square scale-150 rounded-full"
            :style="{
              backgroundColor: COLORS[props.color1!],
              visibility: volumeControlOpen ? 'visible' : 'hidden'
            }"
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
const progressTrack = ref<HTMLElement | null>(null);
const audio = ref<HTMLAudioElement | null>(null);
const volumeControlSurface = ref<HTMLElement | null>(null);
const volumeControlSliderHead = ref<HTMLElement | null>(null);
const volumeControlTrack = ref<HTMLElement | null>(null);
const volumeControlFill = ref<HTMLElement | null>(null);

const playing = ref(false);
const volumeControlOpen = ref(false);
const volume = ref(1.0);
const progress = ref(0);
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

async function openVolumeControl() {
  const ctx = initContext();
  gsap.set(volumeControlSurface.value, {
    top: '-7.5em'
  });
  gsap.set(volumeControlSliderHead.value, {
    visibility: 'hidden',
    scale: 0,
    y: 0
  });
  await nextTick();
  const volumeControlHeight = volumeControlTrack.value!.getBoundingClientRect().height - (volumeControlSliderHead.value!.getBoundingClientRect().height / 2);
  gsap.set(volumeControlSurface.value, {
    top: '0em'
  });
  await nextTick();
  ctx.add(() => {
    const timeline = gsap.timeline();
    timeline.set(volumeControlFill.value, {
      height: '0%'
    });
    timeline.to(volumeControlSurface.value, {
      top: '-7.5em',
      duration: 0.4,
      ease: "back.out"
    });
    timeline.set(volumeControlSliderHead.value, {
      visibility: 'visible',
      scale: 0
    }, "<+0.2");
    timeline.to(volumeControlSliderHead.value, {
      scale: 1.5,
      duration: 0.4,
      ease: "back.out(4)"
    }, "<");
    timeline.to(volumeControlSliderHead.value, {
      y: -1 * (volumeControlHeight * volume.value),
      duration: 0.4,
      ease: "power2.out"
    });
    timeline.to(volumeControlFill.value, {
      height: `${volume.value * 100}%`,
      duration: 0.4,
      ease: "power2.out"
    }, "<");
  });
}

function closeVolumeControl() {
  const ctx = initContext();
  ctx.add(() => {
    const timeline = gsap.timeline();
    timeline.set(volumeControlSliderHead.value, {
      visibility: 'visible',
      scale: 1.5
    });
    timeline.set(volumeControlFill.value, {
      visibility: 'visible'
    });
    timeline.to(volumeControlSliderHead.value, {
      y: 0,
      duration: 0.3,
      ease: "power2.in"
    });
    timeline.to(volumeControlFill.value, {
      height: '0%',
      duration: 0.3,
      ease: "power2.in"
    }, "<");
    timeline.to(volumeControlSliderHead.value, {
      scale: 0,
      duration: 0.3,
      ease: "back.in(4)"
    });
    timeline.to(volumeControlSurface.value, {
      top: '0em',
      duration: 0.3,
      ease: "power2.in"
    }, "<+0.2");
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

watch(volume, (newVolume) => {
  // Update audio element volume using a logarithmic scale for better audio perception
  // Follows the following formula
  // f(x) = (10^(x-1)) * (1/0.9)-(1/9)

  if (audio.value) {
    newVolume = (Math.pow(10, newVolume - 1)) * (1 / 0.9) - (1 / 9);
    audio.value.volume = newVolume;
  }
});

function playheadMouseWatcher(event: MouseEvent) {
  if (!isDraggingPlayhead.value) return;
  if (!progressTrack.value || !audio.value) return;
  const rect = progressTrack.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  let newProgress = mouseX / rect.width;
  newProgress = Math.min(Math.max(newProgress, 0), 1);
  progress.value = newProgress;
  audio.value.currentTime = newProgress * duration.value;
}

function handlePlayheadGrab(event: MouseEvent) {
  isDraggingPlayhead.value = true;  
  playheadMouseWatcher(event);

  const ctx = initContext();
  ctx.add(() => {
    gsap.to(playhead.value, {
      scale: 2.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });

  document.addEventListener('mousemove', playheadMouseWatcher);
  document.addEventListener('mouseup', handlePlayheadRelease);
}

function handlePlayheadRelease() {
  isDraggingPlayhead.value = false;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(playhead.value, {
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });

  document.removeEventListener('mousemove', playheadMouseWatcher);
  document.removeEventListener('mouseup', handlePlayheadRelease);
}
  
function handlePlayheadHoverEnter() {
  if (isDraggingPlayhead.value) return;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(playhead.value, {
      scale: 2,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function handlePlayheadHoverLeave() {
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

function volumeMouseWatcher(event: MouseEvent) {
  if (!isDraggingVolume.value) return;
  if (!volumeControlTrack.value) return;
  const rect = volumeControlTrack.value.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  let newVolume = 1 - (mouseY / rect.height);
  newVolume = Math.min(Math.max(newVolume, 0), 1);
  volume.value = newVolume;

  const volumeControlHeight = volumeControlTrack.value!.getBoundingClientRect().height;
  gsap.to(volumeControlSliderHead.value, {
    y: -1 * (volumeControlHeight * volume.value),
    duration: 0.1,
    ease: "power2.out"
  });
  gsap.to(volumeControlFill.value, {
    height: `${volume.value * 100}%`,
    duration: 0.1,
    ease: "power2.out"
  });
}

function handleVolumeGrab(event: MouseEvent) {
  isDraggingVolume.value = true;  
  volumeMouseWatcher(event);

  const ctx = initContext();
  ctx.add(() => {
    gsap.to(volumeControlSliderHead.value, {
      scale: 2.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });

  document.addEventListener('mousemove', volumeMouseWatcher);
  document.addEventListener('mouseup', handleVolumeRelease);
}

function handleVolumeRelease() {
  isDraggingVolume.value = false;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(volumeControlSliderHead.value, {
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });

  document.removeEventListener('mousemove', volumeMouseWatcher);
  document.removeEventListener('mouseup', handleVolumeRelease);
}

function handleVolumeControlHoverEnter() {
  if (isDraggingVolume.value) return;
  const ctx = initContext();
  ctx.add(() => {
    gsap.to(volumeControlSliderHead.value, {
      scale: 2,
      duration: 0.3,
      ease: "back.out(4)"
    });
  });
}

function handleVolumeControlHoverLeave() {
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
    audio.value.addEventListener('play', () => {
      playing.value = true;
    });
    
    audio.value.addEventListener('pause', () => {
      playing.value = false;
    });
    
    audio.value.addEventListener('ended', () => {
      playing.value = false;
      progress.value = 0;
      currentTime.value = 0;
    });
    
    audio.value.addEventListener('timeupdate', () => {
      if (!isDraggingPlayhead.value && audio.value) {
        currentTime.value = audio.value.currentTime;
        
        // Try to get duration if we don't have it yet
        if (duration.value === 0 && !isNaN(audio.value.duration)) {
          duration.value = audio.value.duration;
        }
        
        const currentProgress = audio.value.currentTime / audio.value.duration;
        progress.value = isNaN(currentProgress) ? 0 : currentProgress;
      }
    });
    
    audio.value.addEventListener('loadedmetadata', () => {
      if (audio.value) {
        duration.value = audio.value.duration;
        audio.value.volume = volume.value;
      }
    });
    
    audio.value.addEventListener('durationchange', () => {
      if (audio.value && !isNaN(audio.value.duration)) {
        duration.value = audio.value.duration;
      }
    });
    
    audio.value.addEventListener('canplay', () => {
      if (audio.value && !isNaN(audio.value.duration)) {
        duration.value = audio.value.duration;
      }
    });
  }
});
</script>