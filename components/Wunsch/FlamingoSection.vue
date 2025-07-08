<template>
    <div class="section">
        <div class="content">
            <slot></slot>
        </div>
        <div class="flamingo-container">
            <img src="~assets/Wunsch/flamingo.png" ref="flamingo" alt="Flamingo" class="flamingo" :style="`left:${position}%`"/>
        </div>
    </div>
</template>


<script lang="ts" setup>
const position: Ref<number> = ref(Math.random() * 200);
const appConfig = useAppConfig()
const flamingo: Ref<HTMLElement | null> = ref(null)


function animateFlamingo() {
    position.value = Math.random() * 200;
    flamingo.value!.classList.add('animate');
    setTimeout(() => {
        flamingo.value!.classList.remove('animate');
    }, 4000);
}

onMounted(() => {
    appConfig.animateFlamingos.push(animateFlamingo)
    updateAppConfig(appConfig)
});
</script>


<style lang="less" scoped>
.section {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .content {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .flamingo-container {
        bottom: 0;
        position: relative;
        width: 500px;
        height: 0px;

        .flamingo {
            position: absolute;
            transform: translateY(100%);
            bottom: -100%;
            height: 200px;
            width: auto;
            z-index: 100;

            &.animate {
                animation: moveFlamingo 4s ease-in-out;
            }
        }
    }
}

@keyframes moveFlamingo {
    0%, 100% {
        transform: rotate(0deg) translateY(100%);;
    }
    35%, 65% {
        transform: rotate(0deg) translateY(0);;
    }
    40%, 50%, 60% {
        transform: rotate(10deg) translateY(0);
    }
    45%, 55% {
        transform: rotate(-10deg) translateY(0);
    }
}
</style>
