<template>
    <div class="node-container">
        <div class="node" :style="{ transform: `translate(${x}px, ${y}px)` }">
            <svg class="node-shell" viewBox="0 0 100 100">
                <path class="hex" d="M 7.565 50
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
                                     Z" fill="none" stroke-width="2" stroke="var(--text)" />
            </svg>
            {{ title }}
        </div>
        <div class="children">
            <slot />
        </div>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps<{
    title: string
}>();
const children: Ref<Array<SkillTreeNode>> = ref([]);
const parentNode: SkillTreeNode | undefined = inject('nodeData');
const childCount: ComputedRef<number> = computed(() => {
    return children.value!.length;
});
const siblingIndex: Ref<number> = ref(0);
const min: Ref<number> = ref(0);
const max: Ref<number> = ref(0);

const previousNeighbor: ComputedRef<SkillTreeNode> = computed(() => {
    return getPreviousSiblingAdjacent().traverseToBottom('max');
});
const nextNeighbor: ComputedRef<SkillTreeNode> = computed(() => {
    return getNextSiblingAdjacent().traverseToBottom('min');
});

const phase: ComputedRef<number> = computed(() => {
    if (parentNode!.parentNode === undefined) {
        const phaseIncrement = 360 / parentNode!.childCount.value;
        return phaseIncrement * siblingIndex.value - 90;
    }
    const outwardAngle = parentNode!.phase.value;
    const sperationAngle = 45;
    const spread = sperationAngle * (parentNode!.childCount.value - 1);
    return outwardAngle - (sperationAngle * siblingIndex.value) + (spread / 2);
});

const radius: ComputedRef<number> = computed(() => {
    if (parentNode!.parentNode === undefined) return 70;
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

const root: ComputedRef<SkillTreeNode> = computed(() => {
    let localParentNode = parentNode;
    while (localParentNode!.parentNode) {
        localParentNode = localParentNode!.parentNode;
    }
    return localParentNode!;
});

function getPreviousSiblingAdjacent(): SkillTreeNode {
    let previousSiblingIndex = siblingIndex.value - 1;
    let localParentNode = parentNode;
    while (previousSiblingIndex <= 0) {
        if (localParentNode!.parentNode) {
            localParentNode = localParentNode!.parentNode;
            previousSiblingIndex = localParentNode!.siblingIndex.value - 1;
        } else {
            previousSiblingIndex = localParentNode!.childCount.value - 1;
        }
    }
    return localParentNode!.children.value[previousSiblingIndex];
}

function getNextSiblingAdjacent(): SkillTreeNode {
    let nextSiblingIndex = siblingIndex.value + 1;
    let localParentNode = parentNode;
    while (nextSiblingIndex >= localParentNode!.childCount.value) {
        if (localParentNode!.parentNode) {
            localParentNode = localParentNode!.parentNode;
            nextSiblingIndex = localParentNode!.siblingIndex.value + 1;
        } else {
            nextSiblingIndex = 0;
        }
    }
    return localParentNode!.children.value[nextSiblingIndex];
}

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

function calculateDistanceToNode(node: SkillTreeNode): number {
    return Math.sqrt(Math.pow(node.x.value - x.value, 2) + Math.pow(node.y.value - y.value, 2));
}
function calculateAngleToNode(node: SkillTreeNode): number {
    return Math.atan2(node.y.value - y.value, node.x.value - x.value) * 180 / Math.PI;
}
function calculateViewAngle(node: SkillTreeNode): number {
    const size = 125;
    const distance = calculateDistanceToNode(node);
    return 2 * Math.atan(size / (2 * distance)) * 180 / Math.PI;
}

const nodeData = {
    parentNode: parentNode,
    children: children,
    childCount: childCount,
    siblingIndex: siblingIndex,
    x: x,
    y: y,
    phase: phase,
    min: min,
    max: max,
    traverseToBottom: traverseToBottom,
    getPreviousSiblingAdjacent: getPreviousSiblingAdjacent,
    getNextSiblingAdjacent: getNextSiblingAdjacent,
    previousNeighbor: previousNeighbor,
    nextNeighbor: nextNeighbor
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

        .node-shell {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }
    }

    .children {
        position: absolute;
        top: 62.5px;
        left: 62.5px;
    }
}
</style>