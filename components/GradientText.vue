<template>
    <div class="gradient-text-container">
        <!-- SVG for rendering gradient text with a mask -->
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" id="gradient-text-svg">
            <!-- Rectangle filled with the SVG gradient, masked by the text shape -->
            <rect x="0" y="0" width="100%" height="100%"
                  :fill="`url(#${color}Gradient)`"
                  :mask="`url(#${maskId})`" />
        </svg>
        <!-- Hidden, styled header element used for measurement and semantics/accessibility -->
        <!-- It's styled to be invisible but occupy space for measurement initially -->
        <component :is="headerTag" ref="measureElementRef" class="measure-element" aria-hidden="true">
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

const maskId = `mask-${props.text.replace(/\s+/g, '-')}`;

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
.measure-element {
    transform: translateY(-100%);
}
</style>