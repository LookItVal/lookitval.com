<template>
  <button
    ref="playButton"
    class="outer-ring relative rounded-full p-(--m-em)"
    @click="clickHandler"
  >
    <div ref="blockShape" class="record-button play bg-red-500 aspect-square h-[5em] flex items-center justify-center">
      <div class="icon w-[1em] h-[1em] rounded-full z-10 flex flex-row" />
    </div>
  </button>
</template>

<script lang="ts" setup>
const blockShape = ref<HTMLElement | null>(null);
const playButton = ref<HTMLElement | null>(null);
const recording = ref(false);

function clickHandler() {
  if (recording.value) {
    blockShape.value?.classList.remove('stop');
    blockShape.value?.classList.add('play');
    playButton.value?.classList.remove('animate');
    recording.value = false;
  } else {
    blockShape.value?.classList.remove('play');
    blockShape.value?.classList.add('stop');
    playButton.value?.classList.add('animate');
    recording.value = true;
  }
}
</script>

<style scoped>
.outer-ring {
  &::before {
    content: '';
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 1em;
    border-radius: inherit; /* !importanté */
    background: linear-gradient(135deg, var(--color-red-500), var(--color-pink-500));
    mask: radial-gradient(circle at center, transparent 3.5em, black 3.6em, black 4em);
    animation: spin 1s infinite linear;
    animation-play-state: paused;
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
  transition: border-radius 0.2s ease-in-out;

  & .icon {
    transition: gap 0.2s ease-in-out;

    &::before, &::after {
      transition: border-radius 0.2s ease-in-out;
    }
  }

  &.play {
    border-radius: 50%;

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
      border-radius: 0.5em 0 0 0.5em;
    }

    & .icon::after {
      content: '';
      position: relative;
      display: block;
      background-color: var(--color-red-100);
      z-index: 11;
      height: 100%;
      width: 50%;
      border-radius: 0 0.5em 0.5em 0;
    }

  }

  &.stop {
    border-radius: 1em;

    & .icon {
      gap: 0.2em;
    }

    & .icon::before {
      content: '';
      position: relative;
      display: block;
      background-color: var(--color-red-100);
      z-index: 11;
      height: 100%;
      width: 50%;
      border-radius: 0 0 0 0;
    }

    & .icon::after {
      content: '';
      position: relative;
      display: block;
      background-color: var(--color-red-100);
      z-index: 11;
      height: 100%;
      width: 50%;
      border-radius: 0 0 0 0;
    }
  }
}
</style>