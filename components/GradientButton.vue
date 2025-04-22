<template>
    <button @click="handleClick" @mouseover="shimmer" class="button-background" :class="color">
        <div ref='shimmers' class="shimmer">
            <div class="shine1"></div>
            <div class="shine2"></div>
        </div>
        <slot />
    </button>
</template>


<script lang="ts" setup>
const props = defineProps<{
    to?: string;
    click?: () => void;
    color: string;
}>();

const colorValidator = (value: string) => {
    return ['red', 'orange', 'yellow', 'green', 'blue', 'purple'].includes(value);
};

if (!colorValidator(props.color)) {
    throw new Error(`Invalid color: ${props.color}`);
}

const isAnimating: Ref<boolean> = ref(false);
const shimmers: Ref<HTMLElement | null> = ref(null);

function shimmer(): void {
    if (isAnimating.value) return;
    isAnimating.value = true;
    shimmers.value!.classList.add('animate');
    setTimeout(() => {
        isAnimating.value = false;
        shimmers.value!.classList.remove('animate');
    }, 1000);
}

function handleClick(): void {
    if (props.click) {
        props.click();
    }
    if (props.to) {
        navigateTo(props.to);
    }
}
</script>


<style lang="less" scoped>
.button-background {
    z-index: 1;
    position: relative;
    width: 100%;
    height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .shimmer {
        z-index: 2;
        position: relative;
        width: 0;
        height: 0;
        top: -100%;
        transform: translate(-100px, -20px) rotate(20deg);
        transition: none;

        &.animate {
            transform: translate(600px, -20px) rotate(20deg);
            transition: transform 1s linear;
        }

        .shine1 {
            margin: 0px 10px;
            width: 10px;
            height: 200px;
            background: linear-gradient(80deg, transparent 0%, white 100%);
        }
        .shine2 {
            margin: 0px 10px;
            position: relative;
            top: -200px;
            left: 15px;
            width: 15px;
            height: 200px;
            background: linear-gradient(80deg, transparent 0%, white 100%);
        }
    }

    :deep(*) {
        z-index: 3;
        color: var(--base);
        transition: color 0.5s;
    }
}

.button-background:hover {
    :deep(*) {
        color: var(--surface0);
        transition: color 0.5s;
    }
}

.pink {
    background: var(--pink-shimmer);
    overflow: hidden;
    border-radius: 50px;
}
.red {
    background: var(--red-shimmer);
    overflow: hidden;
    border-radius: 50px;
}
.orange {
    background: var(--orange-shimmer);
    overflow: hidden;
    border-radius: 50px;
}
.yellow {
    background: var(--yellow-shimmer);
    overflow: hidden;
    border-radius: 50px;
}
.green {
    background: var(--green-shimmer);
    overflow: hidden;
    border-radius: 50px;
}
.blue {
    background: var(--blue-shimmer);
    overflow: hidden;
    border-radius: 50px;
}
.purple {
    background: var(--purple-shimmer);
    overflow: hidden;
    border-radius: 50px;
}
</style>