<template>
    <button @click="click" @mouseover="shimmer" class="button-background" :class="color">
        <svg viewBox="0 0 0 0" width="100%" height="100%">
        </svg>
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "GradientButton",
    data() {
        return {
            isAnimating: false
        };
    },
    props: {
        click: {
            type: Function,
            required: true
        },
        color: {
            type: String,
            required: true,
            validator: (value) => {
                return ['red', 'orange', 'yellow', 'green', 'blue', 'purple'].includes(value);
            }
        }
    },
    methods: {
        shimmer() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            setTimeout(() => this.isAnimating = false, 1000);
        }
    }
}
</script>

<style lang="less" scoped>
.button-background {
    position: relative;
    width: 100%;
    height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep .button-background * {
    color: var(--base); 
}

svg {
    position: absolute;
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