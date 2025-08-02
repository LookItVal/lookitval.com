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
    return ['purple', 'blue', 'green', 'yellow', 'orange', 'red', 'pink'].includes(value);
};

if (!headerTagValidator(props.headerTag)) {
    throw new Error(`Invalid headerTag: ${props.headerTag}`);
}

if (!colorValidator(props.color)) {
    throw new Error(`Invalid color: ${props.color}`);
}
</script>

<style scoped>
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
}
</style>