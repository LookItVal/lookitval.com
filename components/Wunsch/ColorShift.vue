<template>
    <div ref='colorShift' class="color-shift off">
    </div>
</template>


<script lang="ts" setup>
const colorShift: Ref<HTMLElement | null> = ref(null);

function shift() {
    const randomDegree = Math.floor(Math.random() * (330 - 30 + 1)) + 30;
    colorShift.value!.style.backdropFilter = `hue-rotate(${randomDegree}deg)`;
    colorShift.value!.classList.remove('off');
    colorShift.value!.classList.add('on');

    setTimeout(() => {
        colorShift.value!.classList.remove('on');
        colorShift.value!.classList.add('off');
    }, 15000);
}

defineExpose({
    shift
});
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
        transition: opacity 0.3s ease-in-out;
    }
    &.off {
        opacity: 0;
        transition: opacity 3s ease-in-out;
    }
}
</style>