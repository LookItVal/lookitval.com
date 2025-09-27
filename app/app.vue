<template>
  <div>
    <!-- <div class="display-none
      bg-rosewater-100 bg-rosewater-500
      bg-flamingo-100 bg-flamingo-500
      bg-pink-100 bg-pink-500
      bg-mauve-100 bg-mauve-500
      bg-red-100 bg-red-500
      bg-maroon-100 bg-maroon-500
      bg-peach-100 bg-peach-500
      bg-yellow-100 bg-yellow-500
      bg-green-100 bg-green-500
      bg-teal-100 bg-teal-500
      bg-sky-100 bg-sky-500
      bg-sapphire-100 bg-sapphire-500
      bg-blue-100 bg-blue-500
      bg-lavender-100 bg-lavender-500
      bg-text-100 bg-text-500
      bg-subtext-100 bg-subtext-300 bg-subtext-500 bg-subtext-700
      bg-overlay-100 bg-overlay-200 bg-overlay-300 bg-overlay-500 bg-overlay-600 bg-overlay-700
      bg-surface-100 bg-surface-200 bg-surface-300 bg-surface-500 bg-surface-600 bg-surface-700
      bg-base-100 bg-base-500
      bg-mantle-100 bg-mantle-500
      bg-crust-100 bg-crust-500
    "></div> -->
    <!-- Don't delete this it's the only thing making tailwind inject all colors -->
    <!-- SVG Defnitions -->
    <svg style="position: absolute;">
      <defs/>
    </svg>

    <!-- Loading Page -->
    <div id='globalLoadingScreen' class="global-loading-screen fixed top-0 left-0 right-0 bottom-0 bg-base-100 z-50" />

    <!-- Page Content -->
    <NuxtPage />
  </div>
</template> <!-- TODO: Convert nested css to less -->

<script lang="ts" setup>
</script>

<style>
.global-loading-screen {
  transform: translateY(-100%);
}

/* Global loading screen animations during page transitions */
.page-leave-active .global-loading-screen,
.page-enter-from .global-loading-screen {
  transition: transform 5s ease-in-out;
}

.page-enter-active .global-loading-screen {
  transform: translateY(0%);
}

.page-leave-to .global-loading-screen {
  transform: translateY(0%);
}
</style>

<style>
/* Page transition styles */
.page-enter-active, 
.page-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.page-enter-from, 
.page-leave-to {
  opacity: 1;
}
</style>