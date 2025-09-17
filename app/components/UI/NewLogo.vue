<template>
  <NuxtLink to="/" style="aspect-ratio: 1000 / 450;">
    <svg width="100%" height="100%" viewBox="0 0 1000 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="logo-gradient" cx="20%" cy="0%" r="150%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:var(--color-lavender-100);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--color-mauve-100);stop-opacity:1" />
        </radialGradient>
        <path 
          id="StartKeyframe"
          d="M 499.999 0 A 225 225 0 1 0 500 0 Z"
        />
        <path
          id="QKeyframe1A"
          d="M 204 121 C 147 121 116 171 117 221 C 118 286 160 322 205 321 C 228 321 252 309 268 294 C 350 221 373 299 389 325 C 416 370 469 391 511 391 C 638 391 655 257 656 221 C 656 187 645 58 511 58 C 492 58 432 58 389 121 C 361 163 339 191 264 141 C 248 131 231 121 204 121 Z"
        />
        <path
          id="QKeyframe1B"
          d="M 205 56 C 110 57 60 142 61 225 C 63 334 133 391 209 393 C 220 393 231 392 240 390 C 251 388 261 385 270 380 C 291 371 307 356 319 339 C 326 330 331 320 336 310 C 341 300 345 290 348 279 C 354 258 357 239 357 225 C 358 160 332 56 205 56 Z M 213 209 H 213 V 209 H 213 Z"
        />
        <path
          id="VKeyframe1"
          d="M 500 60
             C 405 60 360 145 360 225
             C 360 305 405 395 500 395
             C 595 395 640 305 640 225
             C 640 145 595 60 500 60
             Z"
        />
        <path
          id="CKeyframe1A"
          d="M 726 223 C 644 89 501 278 482 195 C 477 166 363 118 361 221 C 363 340 472 281 476 259 C 497 156 650 346 726 224 Z"
        />
        <path
          id="CKeyframe1B"
          d="M 881 229 C 887 -133 636 170 567 176 C 497 176 359 121 361 221 C 368 328 500 248 561 248 C 638 247 878 677 881 241 Z"
        />
        <path
          id="CKeyframe1C"
          d="M 800 57 C 721 57 655 112 654 225 C 653 338 726 392 800 392 C 874 394 936 338 936 225 C 935 112 879 57 800 57 Z"
        />
        <path
          id="VKeyframe2A"
          d="M 440 370 C 375 285 400 170 360 90 C 345 60 330 30 300 30 H 299 H 298 H 297 H 296 C 295 30 295 30 295 30 C 230 4 280 0 280 0 C 281 0 281 0 281 0 L 282 0 H 283 H 284 H 285 C 340 0 360 40 385 65 C 415 95 470 130 500 130 C 530 130 530 120 550 120 C 570 120 580 120 590 140 C 600 160 600 320 580 350 C 560 380 600 420 630 420 H 630 H 631 H 632 H 633 C 634 420 635 420 636 420 C 646 420 700 450 575 450 H 574 L 573 450 L 572 450 H 571 H 570 C 520 450 460 395 440 370 Z"
        />
        <path
          id="VKeyframe2B"
          d="M 470 390 C 405 305 420 175 360 90 C 340 65 330 30 285 30 H 85 C 55 30 30 55 30 85 V 86 V 87 V 88 C 30 150 0 150 0 88 V 87 V 86 V 85 C 0 38 38 0 85 0 H 285 C 340 0 365 20 385 65 C 385 65 470 220 500 220 C 530 220 570 120 580 110 C 590 100 610 90 625 110 C 640 130 520 370 525 390 C 530 410 540 420 570 420 H 915 C 945 420 970 395 970 365 V 364 C 970 363 970 363 970 363 C 970 362 960 362 970 362 C 975 300 1000 300 1000 362 V 363 V 364 V 365 C 1000 410 960 450 915 450 H 560 C 510 450 490 415 470 390 Z"
        />
        <path
          id="VKeyframe2C"
          d="M 480 390 L 360 90 C 345 55 330 30 285 30 H 85 C 55 30 30 55 30 85 V 365 C 30 395 55 420 85 420 C 150 420 150 420 86 420 C 150 420 150 450 86 450 C 345 450 85 450 85 450 C 40 450 0 410 0 365 V 85 C 0 38 38 0 85 0 H 285 C 340 0 365 20 385 65 C 385 65 465 290 495 290 C 525 290 600 65 615 55 C 625 45 640 40 650 55 C 660 70 520 370 525 390 C 530 410 540 420 570 420 H 915 C 945 420 970 395 970 365 V 85 C 970 55 945 30 915 30 H 914 C 850 30 850 0 915 0 H 915 C 960 0 1000 40 1000 85 V 365 C 1000 412 962 450 915 450 H 560 C 525 450 500 425 480 390 Z"
        />
        <mask id="logo-mask" height="100%" width="100%">
          <path 
            id="QFinal" 
            d="M 205 56 C 110 57 60 142 61 225 C 63 334 133 391 209 393 C 222 393 242 393 255 387 C 272 409 286 428 302 450 H 498 C 476 450 461 419 461 419 C 461 419 332 419 321 419 C 307 402 300 387 287 370 C 341 338 357 256 357 225 C 358 160 332 56 205 56 Z M 325 225 C 322 301 277 337 272 345 L 221 278 L 185 278 L 242 358 C 231 362 218 362 207 362 C 192 361 92 344 90 225 C 89 147 147 85 205 85 C 270 86 328 129 325 225 Z"
            fill="white"
          />
          <path
            id="VFinal" 
            d="M 480 390
               L 360 90
               C 345 55 330 30 285 30
               H 85
               A 55 55 0 0 0 30 85
               V 365
               A 55 55 0 0 0 85 420
               H 460
               S 475 450 500 450
               H 85
               A 85 85 0 0 1 0 365
               V 85
               A 85 85 0 0 1 85 0
               H 285
               C 340 0 365 20 385 65
               L 500 350
               L 615 55
               H 650
               L 515 390
               C 525 410 540 420 560 420
               H 915
               A 55 55 0 0 0 970 365
               V 85
               A 55 55 0 0 0 915 30
               H 400
               C 395 20 385 0 365 0
               H 915
               A 85 85 0 0 1 1000 85
               V 365
               A 85 85 0 0 1 915 450
               H 560
               C 525 450 500 425 480 390
               Z"
            fill="white"
          />
          <path
            id="CFinal"
            d="M 800 57 C 720 58 655 112 654 225 C 653 338 726 392 803 392 C 903 394 935 326 939 283 L 908 282 C 903 330 869 361 804 360 C 733 360 688 312 686 225 C 684 149 729 87 800 88 C 856 90 895 107 908 168 H 939 V 167 C 924 89 869 56 800 57 Z"
            fill="white"
          />
        </mask>
      </defs>
      <g mask="url(#logo-mask)">
        <rect width="100%" height="100%" fill="url(#logo-gradient)" />
        <circle r="100" cx="1100" cy="450" fill="white"/>
      </g>
    </svg>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
gsap.registerPlugin(MorphSVGPlugin);

function animateEntrance() {
  const mainDuration = 10;
  const mainEaseFunction = "linear";
  const initialDelay = 0;

  const ctx = gsap.context(() => {
    const timeline = gsap.timeline();

    gsap.set("#logo-mask #VFinal", { morphSVG: "#StartKeyframe" });
    gsap.set("#logo-mask #QFinal", { morphSVG: "#StartKeyframe" });
    gsap.set("#logo-mask #CFinal", { morphSVG: "#StartKeyframe" });


    // Keyframe 1
    const QKeyframe1Timeline = gsap.timeline( {paused: true} );
    QKeyframe1Timeline.to("#logo-mask #QFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#QKeyframe1A"
    })
    .to("#logo-mask #QFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#QKeyframe1B"
    });
    const CKeyframe1Timeline = gsap.timeline( {paused: true} );
    CKeyframe1Timeline.to("#logo-mask #CFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#CKeyframe1A"
    })
    .to("#logo-mask #CFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#CKeyframe1B"
    })
    .to("#logo-mask #CFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#CKeyframe1C"
    });

    timeline.to(QKeyframe1Timeline, {
      progress: 1,
      duration: mainDuration,
      ease: mainEaseFunction
    }, initialDelay)
    .to("#logo-mask #VFinal", {
      duration: mainDuration / 3,
      ease: mainEaseFunction,
      morphSVG: "#VKeyframe1"
    }, `<`)
    .to(CKeyframe1Timeline, {
      progress: 1,
      duration: mainDuration,
      ease: mainEaseFunction
    }, `<`);


    // Keyframe 2
    const VKeyframe2Timeline = gsap.timeline( {paused: true} );
    VKeyframe2Timeline.to("#logo-mask #VFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#VKeyframe2A"
    })
    .to("#logo-mask #VFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#VKeyframe2B"
    })
    .to("#logo-mask #VFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#VKeyframe2C"
    })
    .to("#logo-mask #VFinal", {
      duration: 1,
      ease: 'linear',
      morphSVG: "#VFinal"
    });

    timeline.to("#logo-mask #QFinal", {
      duration: mainDuration,
      ease: mainEaseFunction,
      morphSVG: "#QFinal"
    })
    .to(VKeyframe2Timeline, {
      progress: 1,
      duration: mainDuration,
      ease: mainEaseFunction
    }, '<')
    .to("#logo-mask #CFinal", {
      duration: mainDuration,
      ease: mainEaseFunction,
      morphSVG: "#CFinal"
    }, '<');
  });
}

onMounted(() => {
  animateEntrance();
});
</script>