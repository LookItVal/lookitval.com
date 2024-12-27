<template>
    <a href="https://www.linkedin.com/in/qcecil" target="_blank" @mouseover="shimmer">
        <svg ref="linkedinSvg" viewBox="0 0 10 10">
            <defs>
                <mask id="linkedin">
                    <image href="~assets/linkedin.svg" height="100%" width="100%" />
                </mask>
                <linearGradient id="linear-gradient" x1="0" y1="0.5" x2="1" y2="0.5">
                    <stop offset="0%" style="stop-color:var(--red);stop-opacity:0" />
                    <stop offset="100%" style="stop-color:var(--red);stop-opacity:1" />
                </linearGradient>
                <radialGradient id="radial-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:var(--red);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:var(--red);stop-opacity:0" />
                </radialGradient>
            </defs>
            <g mask="url(#linkedin)">
                <rect width="100%" height="100%" fill="var(--lavender)" />
                <path id="outer-path" d="M 6.25 8.25
                                         L 5 9.55
                                         C 9.25 9.55 9.55 9.25 9.55 5
                                         C 9.55 0.75 9.25 0.45 5 0.45
                                         C 0.75 0.45 0.45 0.75 0.45 5
                                         C 0.45 9.25 0.75 9.55 5 9.55
                                         Z" stroke="none" fill="none"/>
                <rect ref="shimmerBox" class='box static' x="1" y="1" width="1" height="7" fill="url(#linear-gradient)" />
                <circle ref="shimmerBall" class='ball static' r="1" fill="url(#radial-gradient)">
                    <animateMotion dur="1s" fill="freeze">
                        <mpath href="#outer-path" />
                    </animateMotion>
                </circle>
                <rect ref="coverBox1" class="cover-box static" x="8.4" y="0" width="2" height="10" fill="var(--lavender)" />
                <rect ref="coverBox2" class="cover-box static" x="6" y="0" width="5" height="3" fill="var(--lavender)" />
                <rect ref="coverBox3" class="cover-box static" x="-7.05" y="0" width="2" height="10" fill="var(--lavender)" />
                <rect ref="coverBox4" class="cover-box static" x="-7.05" y="0" width="3" height="1.25" fill="var(--lavender)" />
            </g>
        </svg>
    </a>
</template>

<script>
export default {
    name: 'SocialsLinkedIn',
    data() {
        return {
            isAnimating: false
        };
    },
    methods: {
        shimmer() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            const svg = this.$refs.linkedinSvg;
            const animations = svg.querySelectorAll('animateMotion');
            animations.forEach(anim => {
                anim.beginElement();
            });
            this.$refs.shimmerBox.classList.remove('static');
            this.$refs.shimmerBox.classList.add('shimmer');
            this.$refs.shimmerBall.classList.remove('static');
            this.$refs.shimmerBall.classList.add('shimmer');
            this.$refs.coverBox1.classList.remove('static');
            this.$refs.coverBox1.classList.add('shimmer');
            this.$refs.coverBox2.classList.remove('static');
            this.$refs.coverBox2.classList.add('shimmer');
            this.$refs.coverBox3.classList.remove('static');
            this.$refs.coverBox3.classList.add('shimmer');
            this.$refs.coverBox4.classList.remove('static');
            this.$refs.coverBox4.classList.add('shimmer');
            setTimeout(() => {
                this.$refs.shimmerBox.classList.add('static');
                this.$refs.shimmerBox.classList.remove('shimmer');
                this.$refs.shimmerBall.classList.add('static');
                this.$refs.shimmerBall.classList.remove('shimmer');
                this.$refs.coverBox1.classList.add('static');
                this.$refs.coverBox1.classList.remove('shimmer');
                this.$refs.coverBox2.classList.add('static');
                this.$refs.coverBox2.classList.remove('shimmer');
                this.$refs.coverBox3.classList.add('static');
                this.$refs.coverBox3.classList.remove('shimmer');
                this.$refs.coverBox4.classList.add('static');
                this.$refs.coverBox4.classList.remove('shimmer');
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
        .box.shimmer {
            width: 1.5;
            transform: translateX(7px);
            transition: width 0.1s linear, transform 1s linear;
        }
        .box.static {
            width: 0;
            transform: translateX(0px);
            transition: width 0.1s linear, transform 0.3s cubic-bezier(.93,-0.32,1,-0.05);
        }      
        .ball.shimmer {
            opacity: 1;
            transition: opacity 0.1s linear;
        }
        .ball.static {
            opacity: 0;
            transition: opacity 0.1s linear;
        }  
        .cover-box.shimmer {
            transform: translateX(0px);
            transition: transform 0.3s linear 0.5s;
        }
        .cover-box.static {
            transform: translateX(7px);
            transition: transform 0.1s linear 0.2s;
        }    
    }
}
</style>