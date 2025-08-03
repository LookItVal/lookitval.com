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
          <stop offset="50%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--lavender);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="invpurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--lavender);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--mauve);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--sapphire);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--blue);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--sapphire);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="invblueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--blue);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--sapphire);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--blue);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--teal);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--green);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--teal);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="invgreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--green);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--teal);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--green);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--peach);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--peach);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="invyellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--peach);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--yellow);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--maroon);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--peach);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--maroon);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="invorangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--peach);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--maroon);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--peach);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--red);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--pink);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="invredGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--red);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--red);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--flamingo);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--flamingo);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="invpinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--flamingo);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--pink);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="ApanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--red);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--sky);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="BpanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--sky);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--red);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="CpanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--sky);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--red);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="ArgbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--red);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--green);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--blue);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="BrgbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--green);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--blue);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--red);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="CrgbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--blue);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--red);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--green);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="AcmyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--sky);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--yellow);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="BcmyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--sky);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="CcmyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--sky);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--mauve);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="ApypGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--pink);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="BpypGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--mauve);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="CpypGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--yellow);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="AmgsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--green);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--sapphire);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="BmgsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--green);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--sapphire);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--mauve);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="CmgsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--sapphire);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--mauve);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--green);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="AyrpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--rosewater);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--pink);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="ByrpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--rosewater);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--yellow);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="CyrpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--pink);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--yellow);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--rosewater);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="AgreyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--subtext0);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--overlay1);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--surface2);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="BgreyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--overlay1);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--surface2);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--subtext0);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="CgreyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--surface2);stop-opacity:1" />
          <stop offset="50%" style="stop-color:var(--subtext0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--overlay1);stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Page Content -->
    <NuxtPage />
  </div>
</template>