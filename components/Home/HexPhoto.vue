<template>
    <div class="hex-container">
        <svg viewBox="-5 -5 110 110" class="hex-svg">
            <defs>
                <mask id="hexMask">
                    <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" fill="white" filter="url(#roundCorners)"/>
                </mask>
                <filter id="roundCorners">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.75" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="2.5" intercept="0" />
                    </feComponentTransfer>
                </filter>
            </defs>
            <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" stroke-width="1" :stroke="hexColor" fill-opacity="0" stroke-linejoin="round" filter="url(#roundCorners)" />
            <image href="~assets/SoundGirlBackground.jpg" width="100" heigh="100" mask="url(#hexMask)" transform="scale(0.9) translate(5.5,5.5)" />
            <image href="~assets/SoundGirlRoto.png" width="100" heigh="100" mask="url(#hexMask)" transform="scale(0.9) translate(5.5,5.5)" />
        </svg>
    </div>
</template>

<script>
export default {
    name: 'HomeHexPhoto',
    props: {
        hexColor: {
            type: String,
            default: 'var(--green)'
        }
    }
}
</script>

<style scoped>
.hex-container {
    position: relative;
    height: 100%;
    aspect-ratio: 1;
}

.hex-svg {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.hex-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: url(#hexClip);
    scale: 0.9;
}

.background-image,
.foreground-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 130%;
    object-fit: cover;
}

.foreground-image {
    z-index: 1;
}
</style>