<template>
    <a href="https://www.instagram.com/lookitval" target="_blank" @mouseover="shimmer">
        <svg ref="instaSvg" viewBox="0 0 10 10">
            <defs>
                <mask id="instagram">
                    <image href="~assets/instagram.svg" height="100%" width="100%" />
                </mask>
                <radialGradient id="radial-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:var(--red);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:var(--red);stop-opacity:0" />
                </radialGradient>
            </defs>
            <g mask="url(#instagram)">
                <rect width="100%" height="100%" fill="var(--lavender)" />
                <path id="insta-outer-path" d="M 2.5 7.5
                                         L 5 9.55
                                         C 9.25 9.55 9.55 9.25 9.55 5
                                         C 9.55 0.75 9.25 0.45 5 0.45
                                         C 0.75 0.45 0.45 0.75 0.45 5
                                         C 0.45 9.25 0.75 9.55 5 9.55
                                         L 7.5 7.5" stroke="none" fill="none"/>
                <path id="insta-inner-path" d="M 5 5
                                               L 5 3
                                               C 3.75 3 3 3.75 3 5
                                               C 3 6.25 3.75 7 5 7
                                               C 6.25 7 7 6.25 7 5
                                               C 7 3.75 6.25 3 5 3
                                               Z" stroke="none" fill="none"/>
                <circle ref="outerShimmerBall" class='ball static' r="1" fill="url(#radial-gradient)">
                    <animateMotion dur="1s" fill="freeze">
                        <mpath href="#insta-outer-path" />
                    </animateMotion>
                </circle>
                <circle ref="innerShimmerBall" class='ball static' r="1" fill="url(#radial-gradient)">
                    <animateMotion dur="1s" fill="freeze">
                        <mpath href="#insta-inner-path" />
                    </animateMotion>
                </circle>
                <circle ref="highlightShimmerBall" class='highlight-ball static' cx="7.665" cy="2.325" r="0" fill="url(#radial-gradient)" />
            </g>
        </svg>
    </a>
</template>

<script>
export default {
    name: 'SocialsInstagram',
    data() {
        return {
            isAnimating: false
        };
    },
    methods: {
        shimmer() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            const svg = this.$refs.instaSvg;
            const animations = svg.querySelectorAll('animateMotion');
            animations.forEach(anim => {
                anim.beginElement();
            });
            this.$refs.outerShimmerBall.classList.remove('static');
            this.$refs.outerShimmerBall.classList.add('shimmer');
            this.$refs.innerShimmerBall.classList.remove('static');
            this.$refs.innerShimmerBall.classList.add('shimmer');
            this.$refs.highlightShimmerBall.classList.remove('static');
            this.$refs.highlightShimmerBall.classList.add('shimmer');
            setTimeout(() => {
                this.$refs.outerShimmerBall.classList.add('static');
                this.$refs.outerShimmerBall.classList.remove('shimmer');
                this.$refs.innerShimmerBall.classList.add('static');
                this.$refs.innerShimmerBall.classList.remove('shimmer');
                this.$refs.highlightShimmerBall.classList.add('static');
                this.$refs.highlightShimmerBall.classList.remove('shimmer');
                this.isAnimating = false;
            }, 1000);
        }
    }      
};
</script>

<style lang="less" scoped>
a {
    margin: 0 .625em 0 .625em;
    height: 100%;
    aspect-ratio: 1;
    svg {
        height: 100%;
        .ball.shimmer {
            opacity: 1;
            transition: opacity 0.1s linear;
        }
        .ball.static {
            opacity: 0;
            transition: opacity 0.1s linear;
        }
        .highlight-ball.shimmer {
            animation: record-pulse 1s linear;
        }
    }
}

@keyframes record-pulse {
    0% {
        r: 0;
    }
    50% {
        r: 0.75;
    }
    100% {
        r: 0;
    }
}
</style>