<template>
  <div class="relative overflow-hidden">
    <div
      class="blur-overlay-top"
    />
    <div class="blur-overlay-bottom" />
    <div
      class="blur-overlay-left"
      :style="{
        transformOrigin: 'left',
        transform: `scaleX(${scrollX === -1 ? 0 : scrollX})`
      }"
    />
    <div
      class="blur-overlay-right"
      :style="{
        transformOrigin: 'right',
        transform: `scaleX(${scrollX === -1 ? 0 : (1 - scrollX)})`
      }"
    />
    <div ref="scrollable" class="scrollable relative overflow-auto ">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const scrollable = ref<HTMLElement | null>(null);
const scrollX = ref(0);
const scrollY = ref(0);

function handleScroll() { 
  if (scrollable.value) {
    scrollX.value = (scrollable.value.scrollWidth - scrollable.value.clientWidth) === 0 ? -1 : scrollable.value.scrollLeft / (scrollable.value.scrollWidth - scrollable.value.clientWidth);
    scrollY.value = (scrollable.value.scrollHeight - scrollable.value.clientHeight) === 0 ? -1 : scrollable.value.scrollTop / (scrollable.value.scrollHeight - scrollable.value.clientHeight);
  }
}

onMounted(() => {
  if (scrollable.value) {
    scrollable.value.addEventListener('scroll', handleScroll);
    handleScroll();
  }
});
</script>

<style scoped>
.scrollable {
  scrollbar-width: thin !important;
  scrollbar-color: rgba(from var(--color-mauve-100) r g b / 0.3) transparent !important;
}

.blur-overlay-top, .blur-overlay-bottom, .blur-overlay-left, .blur-overlay-right {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.blur-overlay-top::before, .blur-overlay-bottom::before,
.blur-overlay-left::before, .blur-overlay-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
}

.blur-overlay-top {
  top: 0;
  left: 0;
  width: 100%;
  height: clamp(10px, 10%, 15vh);
}
.blur-overlay-top::before {
  mask-image: linear-gradient(to bottom,
    black 0%,
    black 5%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 75%,
    transparent 100%
  );
}

.blur-overlay-left {
  top: 0;
  left: 0;
  width: clamp(10px, 10%, 15vw);
  height: 100%;
}
.blur-overlay-left::before {
  mask-image: linear-gradient(to right,
    black 0%,
    black 5%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 75%,
    transparent 100%
  );
}

.blur-overlay-right {
  top: 0;
  right: 0;
  width: clamp(10px, 10%, 15vw);
  height: 100%;
}
.blur-overlay-right::before {
  mask-image: linear-gradient(to left,
    black 0%,
    black 5%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 75%,
    transparent 100%
  );
}
</style>