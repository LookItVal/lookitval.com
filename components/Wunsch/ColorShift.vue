<template>
    <div ref='colorShift' class="color-shift off">
    </div>
</template>

<script>
export default {
    name: 'WunschColorShift',
    methods: {
        shift() {
            const randomDegree = Math.floor(Math.random() * (350 - 10 + 1)) + 10;
            this.$refs.colorShift.style.backdropFilter = `hue-rotate(${randomDegree}deg)`;
            this.$refs.colorShift.style.transition = 'backdrop-filter 10s';

            setTimeout(() => {
                this.$refs.colorShift.style.backdropFilter = 'hue-rotate(0deg)';
                this.$refs.colorShift.style.transition = 'backdrop-filter 10s';
            }, 15000);
        }
    }
}
</script>

<style lang="less" scoped>
.color-shift {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    pointer-events: none;

    &.on {
        transition: backdrop-filter 1s;
    }
    &.off {
        backdrop-filter: hue-rotate(0deg);
        transition: backdrop-filter 1s;
    }
}
</style>