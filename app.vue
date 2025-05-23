<template>
  <div>
    <!-- SVG Defnitions -->
     <svg style="position: absolute;">
      <defs>
        <filter id="roundCorners">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.75" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="2.5" intercept="0" />
          </feComponentTransfer>
        </filter>


        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--lavender);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--mauve);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--sapphire);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--blue);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--teal);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--green);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--peach);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--yellow);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--maroon);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--peach);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--red);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--flamingo);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--pink);stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Page Content -->
    <HomeNavbar />
    <NuxtPage />
  </div>
</template>