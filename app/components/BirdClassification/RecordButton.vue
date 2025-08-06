<template>
  <button :class="['outer-ring relative rounded-full p-(--m-em) z-1', { animate: isRecording }]">
    <div :class="['record-button bg-red-500 aspect-square h-[6em] flex items-center justify-center', isRecording ? 'stop' : 'play']">
      <div class="icon w-[2em] h-[2em] rounded-full z-10 flex flex-row" />
    </div>
  </button>
</template>

<script lang="ts" setup>
import { useAudio } from '@/composables/audio';
const { isRecording } = useAudio();
</script>

<style scoped>
.outer-ring {
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 1em;
    border-radius: inherit; /* !importanté */
    background: linear-gradient(135deg, var(--color-red-500), var(--color-pink-100));
    mask: radial-gradient(circle at center, transparent 3em, black 4.5em, black 5em);
    animation: spin 1s infinite linear;
    animation-play-state: paused;
    pointer-events: none;
  }

  &.animate::before {
    animation-play-state: running;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.record-button {
  transition: border-radius 0.2s ease-in-out, background-color 0.4s ease-in-out;
  pointer-events: none;

  & .icon {
    transition: gap 0.2s ease-in-out;

    &::before, &::after {
      transition: border-radius 0.2s ease-in-out;
    }
  }

  &.play {
    border-radius: 50%;
    background-color: var(--color-red-500);

    & .icon {
      gap: 0;
    }

    & .icon::before {
      content: '';
      position: relative;
      display: block;
      background-color: var(--color-red-100);
      z-index: 11;
      height: 100%;
      width: 50%;
      border-radius: 1em 0 0 1em;
    }

    & .icon::after {
      content: '';
      position: relative;
      display: block;
      background-color: var(--color-red-100);
      z-index: 11;
      height: 100%;
      width: 50%;
      border-radius: 0 1em 1em 0;
    }

  }

  &.stop {
    border-radius: 1em;
    background-color: var(--color-red-500);

    & .icon {
      gap: 0.4em;
    }

    & .icon::before {
      content: '';
      position: relative;
      display: block;
      background-color: var(--color-red-100);
      z-index: 11;
      height: 100%;
      width: 50%;
      border-radius: 0.4em 0.4em 0.4em 0.4em;
    }

    & .icon::after {
      content: '';
      position: relative;
      display: block;
      background-color: var(--color-red-100);
      z-index: 11;
      height: 100%;
      width: 50%;
      border-radius: 0.4em 0.4em 0.4em 0.4em;
    }
  }
}
</style>