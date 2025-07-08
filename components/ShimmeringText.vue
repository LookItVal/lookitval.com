<template>
    <div class="shimmering-text" :style="{ width: fullWidth}">
        <div class="shimmering-text-container">
            <component :is="headerTag" ref="textRef" class="seo-text shimmering-header">
                {{ text }}
            </component>
            <svg :width="textWidth" :height="svgHeight" :viewBox="`0 0 ${textWidth} ${svgHeight}`" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask :id="uniqueId">
                        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                            :font-size="fontSize" fill="white" :font-family="fontFamily" :font-weight="fontWeight" line-height="1.2">
                            {{ text }}
                        </text>
                    </mask>
                </defs>
                <g :mask="`url(#${uniqueId})`">
                    <rect
                        :width="textWidth * 2"
                        :height="svgRectHeight * 2"
                        :fill="currentGradient"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            from="0 0"
                            :to="`${-textWidth} ${-svgRectHeight}`"
                            :dur="`${animateTime / 1000}s`"
                            repeatCount="indefinite"
                        />
                    </rect>
                    <rect
                        :width="textWidth * 2"
                        :height="svgRectHeight * 2"
                        :fill="nextGradient"
                    >
                        <animate
                            attributeName="opacity"
                            :dur="`${animateTime / 1000}s`"
                            repeatCount="indefinite"
                            keyTimes="0;0.01;0.05;0.95;1"
                            values="1;1;0;0;1"
                        />
                    </rect>
                </g>
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { tripleGradients } from '~/utils/constants';

const props = defineProps<{
    text: string;
    headerTag: string;
    color: string;
    time?: number;
}>();

const animateTime = computed(() => props.time ?? 3000);
const allowedColors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red', 'pink', 'pan', 'rgb', 'cmy', 'pyp'];

watch(() => props.color, (newColor) => {
    if (!allowedColors.includes(newColor)) {
        console.warn(`Invalid color prop: "${newColor}". Allowed values are: ${allowedColors.join(', ')}`);
    }
});

const headerStyles: Record<string, { fontSize: string; svgHeight: number; svgRectHeight: number; fontFamily: string; fontWeight: number }> = {
    h1: { fontSize: 'clamp(28px,6vw,250%)', svgHeight: 80, svgRectHeight: 80, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 800 },
    h2: { fontSize: 'clamp(24px,5vw,175%)', svgHeight: 70, svgRectHeight: 70, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 800 },
    h3: { fontSize: 'clamp(22px,4.25vw,125%)', svgHeight: 60, svgRectHeight: 60, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 750 },
    h4: { fontSize: 'clamp(20px,4vw,100%)', svgHeight: 50, svgRectHeight: 50, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 },
    h5: { fontSize: 'clamp(16px,3.2vw,80%)', svgHeight: 40, svgRectHeight: 40, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 },
    h6: { fontSize: 'clamp(14px,2.5vw,70%)', svgHeight: 35, svgRectHeight: 35, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400 },
};

const style = headerStyles[props.headerTag] || headerStyles.h2;
const fontSize = style.fontSize;
const svgHeight = style.svgHeight;
const svgRectHeight = style.svgRectHeight;
const fontFamily = style.fontFamily;
const fontWeight = style.fontWeight;

const textRef = ref<HTMLElement | null>(null);

const textWidth = computed(() => {
    if (textRef.value) {
        return textRef.value.getBoundingClientRect().width;
    }
    return 0;
});
const fullWidth = computed(() => {
    return textWidth.value + "px";
});

const svgTransform = computed(() => {
    if (props.headerTag === 'h1') {
        return 'translate(-0.375em,0.25em)';
    } else if (props.headerTag === 'h2') {
        return 'translate(0.0em,0.19em)';
    } else if (props.headerTag === 'h3') {
        return 'translate(-0.05em,0.125em)';
    } else if (props.headerTag === 'h4') {
        return 'translate(-0.1em,0.075em)';
    } else if (props.headerTag === 'h5') {
        return 'translate(0.05em,0.075em)';
    } else if (props.headerTag === 'h6') {
        return 'translate(0em,0.075em)';
    }
    return 'translate(0,0)';
});

const gradients = computed(() => {
    if (tripleGradients.includes(props.color)) {
        return [
            computed(() => `url(#A${props.color}Gradient)`),
            computed(() => `url(#B${props.color}Gradient)`),
            computed(() => `url(#C${props.color}Gradient)`)
        ];
    }
    return [
        computed(() => `url(#${props.color}Gradient)`),
        computed(() => `url(#inv${props.color}Gradient)`)
    ];
});

const currentGradient = ref(gradients.value[0].value);
const nextGradient = ref(gradients.value[0].value);
let gradientIndex = 0;

function swapGradient() {
    gradientIndex = (gradientIndex + 1) % gradients.value.length;
    currentGradient.value = gradients.value[gradientIndex].value;
}
function swapTransitionGradient() {
    nextGradient.value = gradients.value[(gradientIndex + 1) % gradients.value.length].value;
}

let intervalId1: ReturnType<typeof setInterval> | undefined;
let intervalId2: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
    intervalId1 = setInterval(swapGradient, animateTime.value);
    setTimeout(() => {
        swapTransitionGradient();
        intervalId2 = setInterval(swapTransitionGradient, animateTime.value);
    }, animateTime.value / 2); // start transition after first gradient swap

});
onUnmounted(() => {
    if (intervalId1) clearInterval(intervalId1);
    if (intervalId2) clearInterval(intervalId2);
});

const uniqueId = `text-mask-${Math.random().toString(36).substr(2, 9)}`;
</script>

<style lang="less" scoped>
.shimmering-text {
    .shimmering-text-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    
        svg {
            transform: v-bind(svgTransform);
            position: absolute;
        }
        .seo-text.shimmering-header {
            z-index: 10;
            color: transparent;
            position: relative;
            line-height: inherit;
            margin: 0;
            font-family: inherit;
            text-wrap: nowrap;
        }
    }
}
</style>