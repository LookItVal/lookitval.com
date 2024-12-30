<template>
    <div class="hex-container" ref="hexContainer">
        <svg viewBox="-5 -5 110 110" class="hex-svg">
            <defs>
                <mask id="hexMask">
                    <path d="M 5 50
                             L 5 32.5
                             C 5 25 5 25 11.75 21.4
                             L 43.25 4.6
                             C 50 1 50 1 56.75 4.6
                             L 88.25 21.4
                             C 95 25 95 25 95 32.5
                             L 95 67.5
                             C 95 75 95 75 88.25 78.6
                             L 56.75 95.4
                             C 50 99 50 99 43.25 95.4
                             L 11.75 78.6
                             C 5 75 5 75 5 67.5
                             Z" fill="white" filter="url(#roundCorners)"/>
                </mask>
                <filter id="roundCorners">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.75" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="2.5" intercept="0" />
                    </feComponentTransfer>
                </filter>
                <linearGradient id="hexGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" style="stop-color:var(--teal);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:var(--green);stop-opacity:1" />
                </linearGradient>
            </defs>
            <path class="glowing-shape" d="M 5 50
                                           L 5 32.5
                                           C 5 25 5 25 11.75 21.4
                                           L 43.25 4.6
                                           C 50 1 50 1 56.75 4.6
                                           L 88.25 21.4
                                           C 95 25 95 25 95 32.5
                                           L 95 67.5
                                           C 95 75 95 75 88.25 78.6
                                           L 56.75 95.4
                                           C 50 99 50 99 43.25 95.4
                                           L 11.75 78.6
                                           C 5 75 5 75 5 67.5
                                           Z" fill="none" stroke-width="2" stroke="url(#hexGradient)" />
            <g class="image-mask" mask="url(#hexMask)">
                <image class="hex-image background-image" ref="backgroundImage" href="~assets/Home/SoundGirlBackground.jpg" width="110%" height="110%" />
                <image class="hex-image foreground-image" ref="foregroundImage" href="~assets/Home/SoundGirlRoto.png" width="115%" height="115%" />
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'HomeHexPhoto',
    mounted() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.$refs.hexContainer.classList.add('animate-entrance');
                    observer.unobserve(entry.target);
                    setTimeout(() => {
                        this.$refs.hexContainer.classList.add('animate');
                    }, 1000);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.$refs.hexContainer);

        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            const scrollValue = window.scrollY;
            const foregroundTranslateY = 10 + scrollValue * -0.01;

            this.$refs.foregroundImage.style.transform = `translateY(${foregroundTranslateY}px) translateX(-15px)`;
        }
    }
}
</script>

<style lang="less" scoped>
.hex-container {
    position: relative;
    height: 100%;
    aspect-ratio: 1;

    .hex-svg {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .glowing-shape {
            transform: translateY(10px);
            opacity: 0;
            transition: transform 1s, opacity 1s ease-out;
        }
        .image-mask {
            transform: translateY(20px) scale(0.9) translateX(5.5px); 
            opacity: 0;
            transition: transform 1s, opacity 1s ease-out;

            .background-image {
                transform: translateY(-5px) translateX(-10px);
                transition: transform 1s ease-out;
            }
            .foreground-image {
                transform: translateY(5px) translateX(-15px);
                transition: transform .5s ease-out;
            }
        }
    }
}

.hex-container.animate-entrance .hex-svg {
    .glowing-shape {
        transform: translateY(-0.5px);
        opacity: 1;
    }
    .image-mask {
        transform: translateY(5px) scale(0.9) translateX(5.5px);
        opacity: 1;

        .background-image {
            transform: translateY(0) translateX(-10px);
        }
    }
}

.hex-container.animate-entrance.animate {
    .glowing-shape {
        animation: hover 2.5s infinite ease-in-out;
    }
}

@keyframes hover {
    0% {
        transform: translateY(-0.5px);
    }
    50% {
        transform: translateY(0.5px);
    }
    100% {
        transform: translateY(-0.5px);
    }
}
</style>