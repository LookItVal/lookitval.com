<template>
    <div ref="skillTree" class="skill-tree" :style="{height: height + 'px'}">
        <div class="root-node">
            <SkillTreeNode title="Audio Engineering">
                <SkillTreeNode title="Recoding">
                    <SkillTreeNode title="Location Audio" />
                    <SkillTreeNode title="Studio Audio" />
                </SkillTreeNode>
                <SkillTreeNode title="Mixing & Mastering">
                    <SkillTreeNode title="ProTools" />
                    <SkillTreeNode title="Cubase" />
                    <SkillTreeNode title="Izotope Ozone" />
                    <SkillTreeNode title="Izotope RX" />
                    <SkillTreeNode title="Midi Composition" />
                </SkillTreeNode>
                <SkillTreeNode title="Live Sound">
                    <SkillTreeNode title="FOH Engineering" />
                    <SkillTreeNode title="Bassist in Crash" />
                </SkillTreeNode>
            </SkillTreeNode>
            <SkillTreeNode title="Data Science">
                <SkillTreeNode title="Databases">
                    <SkillTreeNode title="Orical SQL" />
                    <SkillTreeNode title="PostgreSQL" />
                    <SkillTreeNode title="Zoho Creator" />
                </SkillTreeNode>
                <SkillTreeNode title="Machine Learning" />
                <SkillTreeNode title="Python">
                    <SkillTreeNode title="Pandas" />
                    <SkillTreeNode title="Numpy" />
                    <SkillTreeNode title="Cupy" />
                </SkillTreeNode>
                <SkillTreeNode title="Google Apps Script" />
                <SkillTreeNode title="R" />
            </SkillTreeNode>
            <SkillTreeNode title="Software Development">
                <SkillTreeNode title="Live Sound">
                </SkillTreeNode>
            </SkillTreeNode>
        </div>
    </div> 
</template>


<script lang="ts" setup>
const children: Ref<Array<SkillTreeNode>> = ref([]);
const childCount: ComputedRef<number> = computed(() => {
    return children.value!.length;
});
const siblingIndex: Ref<number> = ref(0);
const x: ComputedRef<number> = computed(() => {return 0});
const y: ComputedRef<number> = computed(() => {return 0});
const min: Ref<number> = ref(0);
const max: Ref<number> = ref(0);
const height: ComputedRef<number> = computed(() => {
    return max.value - min.value + 125;
});

function getPreviousSiblingAdjacent(): SkillTreeNode {
    let previousSiblingIndex = siblingIndex.value - 1;
    let localParentNode = undefined;
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
    let localParentNode = undefined;
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
   
function findMin(batch: Array<SkillTreeNode>): number {
    let min = 0;
    for (let i = 0; i < batch.length; i++) {
        const child = batch[i];
        if (child.x.value < min) {
            min = child.x.value;
        }
        if (child.childCount.value > 0) {
            const childMin = findMin(child.children.value);
            if (childMin < min) {
                min = childMin;
            }
        }
    }
    return min;
}

function findMax(batch: Array<SkillTreeNode>): number {
    let max = 0;
    for (let i = 0; i < batch.length; i++) {
        const child = batch[i];
        console.log(child.x.value);
        if (child.x.value > max) {
            max = child.x.value;
        }
        if (child.childCount.value > 0) {
            const childMax = findMax(child.children.value);
            if (childMax > max) {
                max = childMax;
            }
        }
    }
    return max;
}

function traverseToBottom(direction: 'min' | 'max'): SkillTreeNode {
    throw new Error('This should never be called how did you even make this happen?.');
}

const previousNeighbor: ComputedRef<SkillTreeNode> = computed(() => {
    throw new Error('This should never be called how did you even make this happen?.');
});
const nextNeighbor: ComputedRef<SkillTreeNode> = computed(() => {
    throw new Error('This should never be called how did you even make this happen?.');
});
const phase: ComputedRef<number> = computed(() => {
    throw new Error('This should never be called how did you even make this happen?.');
});

const nodeData = {
    children: children,
    childCount: childCount,
    siblingIndex: siblingIndex,
    x: x,
    y: y,
    phase: phase,
    min: min,
    max: max,
    getPreviousSiblingAdjacent: getPreviousSiblingAdjacent,
    getNextSiblingAdjacent: getNextSiblingAdjacent,
    traverseToBottom: traverseToBottom,
    previousNeighbor: previousNeighbor,
    nextNeighbor: nextNeighbor

}

provide('nodeData', nodeData);
</script>

<style lang="less" scoped>
.skill-tree {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .root-node {
        position: relative;
        margin-top: 62.5px;
        height: 0;
        width: 0;
    }
}   
</style>