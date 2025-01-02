<template>
    <div class="node-container">
        <div class="node" :class="{ hide: hideLine }" :style="{ transform: `translate(${x}px, ${y}px)`, 'z-index': zIndex }">
            <svg class="node-shell" viewBox="0 0 100 100">
                <path v-if="onCorners" class="line" :d="`M 50 50 L ${lineEndX} ${lineEndY}`" stroke="var(--text)" stroke-width="2"/>
                <path v-else class="line" :d="`M 50 50 L ${lineKneeX} ${lineKneeY} L ${lineEndX} ${lineEndY}`" stroke="var(--text)" stroke-width="2" fill="none"/>
                <path v-if="!props.hide" class="hex" d="M 7.565 50
                                     L 7.565 33
                                     C 7.565 25.5 7.565 25.5 14.06 21.75
                                     L 43.25 4.6
                                     C 50 1 50 1 56.75 4.6
                                     L 85.94 21.75
                                     C 92.435 25.5 92.435 25.5 92.435 33
                                     L 92.435 67
                                     C 92.435 74.5 92.435 74.5 85.94 78.25
                                     L 56.75 95.4
                                     C 50 99 50 99 43.25 95.4
                                     L 14.06 78.25
                                     C 7.565 74.5 7.565 74.5 7.565 67
                                     Z" fill="var(--crust)" stroke-width="2" stroke="var(--text)" />
            </svg>
            <p style="z-index: 1;">
                {{ title }}
            </p>
        </div>
        <div class="children">
            <slot />
        </div>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps<{
    title: string,
    hide?: boolean,
    invertLineBend?: boolean
}>();
const hideLine: ComputedRef<boolean> = computed(() => {
    return props.hide && (childCount.value === 0);
});
const children: Ref<Array<SkillTreeNode>> = ref([]);
const parentNode: SkillTreeNode | undefined = inject('nodeData');
const childCount: ComputedRef<number> = computed(() => {
    return children.value!.length;
});
const depth: ComputedRef<number> = computed(() => {
    if (parentNode!.parentNode === undefined) return 0;
    return parentNode!.depth.value + 1;
});
const siblingIndex: Ref<number> = ref(0);
const min: Ref<number> = ref(0);
const max: Ref<number> = ref(0);

const onCorners: ComputedRef<boolean> = computed(() => {
    return parentNode!.childrenOnCorners.value;
});
const childrenOnCorners: ComputedRef<boolean> = computed(() => {
    if (childCount.value % 2 === 0) {
        if (parentNode!.phase.value % 60 === 0) {
            return false;
        } else {
            return true;
        }
    } else {
        if (parentNode!.phase.value % 60 === 30) {
            return false;
        } else {
            return true;
        }
    }
});
const zIndex: ComputedRef<number> = computed(() => {
    return 10 - depth.value;
});

const phase: ComputedRef<number> = computed(() => {
    if (parentNode!.parentNode === undefined) {
        const phaseIncrement = 360 / parentNode!.childCount.value;
        return phaseIncrement * siblingIndex.value - 90;
    }
    const outwardAngle = parentNode!.phase.value;
    const sperationAngle = 60;
    const spread = sperationAngle * (parentNode!.childCount.value - 1);
    return outwardAngle - (sperationAngle * siblingIndex.value) + (spread / 2);
});

const radius: ComputedRef<number> = computed(() => {
    if (parentNode!.parentNode === undefined) return 85;
    return 150;
});
const x: ComputedRef<number> = computed(() => {
    return (radius.value * Math.cos(phase.value * Math.PI / 180)) + parentNode!.x.value;
});
const y: ComputedRef<number> = computed(() => {
    const val = (radius.value * Math.sin(phase.value * Math.PI / 180)) + parentNode!.y.value;
    if (root.value.min.value > val) root.value.min.value = val;
    if (root.value.max.value < val) root.value.max.value = val;
    return val;
});


const lineBendCoefficent: ComputedRef<1 | -1>  = computed(() => {
    let val = -1;
    if (siblingIndex.value % 2 === 0) {
        val = 1;
    }
    if (props.invertLineBend) {
        return -1 * val as -1 | 1; 
    }
    return 1 * val as -1 | 1;
});

const lineKneeX: ComputedRef<number> = computed(() => {
    let rad = 4*radius.value/5;
    const angle = calculateAngleToNode(parentNode!) + (lineBendCoefficent.value * 30);
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    return (rad * Math.cos(angle * Math.PI / 180)) + 50;
});
const lineKneeY: ComputedRef<number> = computed(() => {
    let rad = 4*radius.value/5;
    const angle = calculateAngleToNode(parentNode!) + (lineBendCoefficent.value * 30);
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    return (rad * Math.sin(angle * Math.PI / 180)) + 50;
});

const lineEndX: ComputedRef<number> = computed(() => {
    const angle = calculateAngleToNode(parentNode!);
    return ((4*radius.value/5) * Math.cos(angle * Math.PI / 180)) + 50;
});
const lineEndY: ComputedRef<number> = computed(() => {
    const angle = calculateAngleToNode(parentNode!);
    return ((4*radius.value/5) * Math.sin(angle * Math.PI / 180)) + 50;
});

const root: ComputedRef<SkillTreeNode> = computed(() => {
    let localParentNode = parentNode;
    while (localParentNode!.parentNode) {
        localParentNode = localParentNode!.parentNode;
    }
    return localParentNode!;
});

function traverseToBottom(direction: 'min' | 'max'): SkillTreeNode {
    let localParentNode = parentNode;
    while (localParentNode!.children.value.length > 0) {
        if (direction === 'min') {
            localParentNode = localParentNode!.children.value[0];
        } else {
            localParentNode = localParentNode!.children.value[localParentNode!.children.value.length - 1];
        }
    }
    return localParentNode!;
}

function calculateAngleToNode(node: SkillTreeNode): number {
    return Math.atan2(node.y.value - y.value, node.x.value - x.value) * 180 / Math.PI;
}

const nodeData = {
    parentNode: parentNode,
    children: children,
    childrenOnCorners: childrenOnCorners,
    childCount: childCount,
    depth: depth,
    siblingIndex: siblingIndex,
    x: x,
    y: y,
    phase: phase,
    min: min,
    max: max,
    traverseToBottom: traverseToBottom
}

provide('nodeData', nodeData);

onMounted(() => {
    siblingIndex.value = parentNode!.childCount.value
    parentNode!.children.value.push(nodeData);
});

</script>

<style lang="less" scoped>
.node-container {
    position: absolute;
    top: -62.5px;
    right: -62.5px; 
    .node {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 125px;
        width: 125px;
        font-size: 0.45em;
        text-align: center;
        white-space: pre-line;
        word-break: break-word;
        word-spacing: 100px;

        &.hide {
            opacity: 0;
            pointer-events: none;
        }

        .node-shell {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            overflow: visible;
        }
    }

    .children {
        position: absolute;
        top: 62.5px;
        left: 62.5px;
    }
}
</style>