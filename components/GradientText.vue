<template>
    <div class="gradient-text">
        <component :is="headerTag" :class="color">
            {{ text }}
        </component>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps<{
    text: string;
    headerTag: string;
    color: string;
}>();

const headerTagValidator = (value: string) => {
    return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value);
};

const colorValidator = (value: string) => {
    return ['purple', 'blue', 'green', 'yellow', 'orange', 'red', 'pink', 'rainbow'].includes(value);
};

if (!headerTagValidator(props.headerTag)) {
    throw new Error(`Invalid headerTag: ${props.headerTag}`);
}

if (!colorValidator(props.color)) {
    throw new Error(`Invalid color: ${props.color}`);
}
</script>


<style lang="less" scoped>

@property --color1 {
  syntax: '<color>';
  inherits: false;
  initial-value: var(--lavender); /* Or any valid starting color literal e.g. #C8B6F2 */
}

@property --color2 {
  syntax: '<color>';
  inherits: false;
  initial-value: var(--mauve); /* Or any valid starting color literal e.g. #D8BFD8 */
}

@keyframes rainbow-shimmer {
    0% {
        background: var(--purple-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    14.2% {
        background: var(--purple-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    14.3% {
        background: var(--blue-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    28.5% {
        background: var(--blue-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    28.6% {
        background: var(--green-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    42.8% {
        background: var(--green-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    42.9% {
        background: var(--yellow-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    57% {
        background: var(--yellow-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    57.1% {
        background: var(--orange-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    71.3% {
        background: var(--orange-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    71.4% {
        background: var(--red-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    85.6% {
        background: var(--red-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    85.7% {
        background: var(--pink-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
    99.9% {
        background: var(--pink-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
    }
}

@keyframes rainbow-shimmer-after {
    0% {
        background: var(--pink-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
    14.2% {
        background: var(--pink-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 0;
    }
    14.21% {
        background: var(--purple-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
    28.5% {
        background: var(--purple-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 0;
    }
    28.51% {
        background: var(--blue-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
    42.8% {
        background: var(--blue-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 0;
    }
    42.81% {
        background: var(--green-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
    57% {
        background: var(--green-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 0;
    }
    57.01% {
        background: var(--yellow-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
    71.3% {
        background: var(--yellow-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 0;
    }
    71.31% {
        background: var(--orange-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
    85.6% {
        background: var(--orange-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 0;
    }
    85.61% {
        background: var(--red-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
    99.9% {
        background: var(--red-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 0;
    }
    99.91% {
        background: var(--pink-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        opacity: 1;
    }
}

.gradient-text {
    .purple {
        background: var(--purple-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .blue {
        background: var(--blue-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .green {
        background: var(--green-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .yellow {
        background: var(--yellow-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .orange {
        background: var(--orange-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .red {
        background: var(--red-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .pink {
        background: var(--pink-shimmer);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .rainbow {
        z-index: 99;
        animation: rainbow-shimmer 120s linear infinite;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
    .rainbow::before {
        z-index: 100;
        content: v-bind('JSON.stringify(props.text)');
        position: absolute;
        height: 100%;
        animation: rainbow-shimmer-after 120s linear infinite;
        background-clip: text;
        -webkit-background-clip: text;
    }
}
</style>