<template>
    <div ref='colorShift' class="color-shift off">
    </div>
</template>

<script>
export default {
    name: 'WunschColorShift',
    methods: {
        shift() {
            const randomDegree = Math.floor(Math.random() * (330 - 30 + 1)) + 30;
            this.$refs.colorShift.style.backdropFilter = `hue-rotate(${randomDegree}deg)`;
            this.$refs.colorShift.classList.remove('off');
            this.$refs.colorShift.classList.add('on');

            setTimeout(() => {
                this.$refs.colorShift.classList.remove('on');
                this.$refs.colorShift.classList.add('off');
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
        opacity: 1;
        transition: opacity 3s ease-in-out;
    }
    &.off {
        opacity: 0;
        transition: opacity 3s ease-in-out;
    }
}
</style>