<template>
    <NuxtLink to="/" class="logo">
        <svg ref="logoSvg" height="100%" width="100%" viewBox="0 0 20 10" @mouseover="shimmer">
            <defs>
                <mask id="logo-mask" height="100%" width="100%">
                    <image href="~assets/QVC.svg" height="100%" width="100%" />
                </mask>
                <radialGradient id="radial-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:var(--red);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:var(--red);stop-opacity:0" />
                </radialGradient>
            </defs>
            <g mask="url(#logo-mask)">
                <rect width="100%" height="100%" fill="var(--lavender)" />
                <path id="animated-path-1" d="M 9.7,7.7
                                               L 7.4,2 
                                               C 7.2,1.6, 6.6,1.25, 6.25,1.25 
                                               H 2.3
                                               C 2.05,1.25, 1.2,1.6, 1.2,2.5
                                               V 7.7
                                               C 1.2,8.5, 2,8.75, 2.3,8.75
                                               H 9
                                               L 10,10" 
                stroke="none" fill="none" />
                <path id="animated-path-2" d="M 9.85,7.8
                                               L 12.2,2.1
                                               L 12.2,2
                                               L 12.5,0" 
                stroke="none" fill="none" />
                <path id="animated-path-3" d="M 9.7,7.7
                                               L 9.82,8
                                               C 10,8.4, 10.5,8.75, 10.75,8.75
                                               H 17.5
                                               C 17.8,8.75, 18.5,8.4, 18.5,7.5
                                               V 2.5
                                               C 18.5,1.6, 17.8,1.25, 17.5,1.25
                                               H 8.5
                                               L 7.5,0"
                stroke="none" fill="none" />
                <circle r="1" fill="url(#radial-gradient)">
                    <animateMotion id="anim1" dur="1s" fill="freeze">
                        <mpath href="#animated-path-1" />
                    </animateMotion>
                </circle>
                <circle r="1" fill="url(#radial-gradient)">
                    <animateMotion id="anim2" dur="0.25s" fill="freeze">
                        <mpath href="#animated-path-2" />
                    </animateMotion>
                </circle>
                <circle r="1" fill="url(#radial-gradient)">
                    <animateMotion id="anim3" dur="1s" fill="freeze">
                        <mpath href="#animated-path-3" />
                    </animateMotion>
                </circle>
                <circle r="0.1" cx="21" cy="11" fill="var(--red)"></circle>
            </g>
        </svg>
    </NuxtLink>
</template>

<script>
export default {
    name: 'Logo',
    data() {
        return {
            isAnimating: false
        };
    },
    methods: {
        shimmer() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            const svg = this.$refs.logoSvg;
            const animations = svg.querySelectorAll('animateMotion');
            animations.forEach(anim => {
                anim.beginElement();
            });
            setTimeout(() => {
                this.isAnimating = false;
            }, 1000); // Adjust the timeout duration to match the longest animation duration
        }
    }
}
</script>

<style scoped>
.logo {
    display: block;
    margin-left: 0em;
    height: 100%;
}
</style>
