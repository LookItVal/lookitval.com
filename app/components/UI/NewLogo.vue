<template>
  <NuxtLink to="/" style="aspect-ratio: 1000 / 450;">
    <svg width="100%" height="100%" viewBox="0 0 1000 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="logo-gradient" cx="20%" cy="0%" r="150%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:var(--color-lavender-100);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--color-mauve-100);stop-opacity:1" />
        </radialGradient>
        <mask id="logo-mask" height="100%" width="100%">
          <path
            id="VFinal" 
            d="M 480 390
               L 360 90
               C 345 55 330 30 285 30
               H 85
               C 45 30 30 45 30 85
               V 370
               C 30 410 45 420 85 420
               H 460
               Z"
            fill="white"
          />
        </mask>
      </defs>
      <g mask="url(#logo-mask)">
        <rect width="100%" height="100%" fill="url(#logo-gradient)" />
      </g>
    </svg>
  </NuxtLink>
</template>

<script lang="ts" setup>
</script>