<template>
    <div ref="skillTree" class="skill-tree" :style="{height: (height) + 'px', top: (position) + 'px'}">
        <div class="root-node">
            <SkillTreeNode title="Data Science">
                <SkillTreeNode title="" hide>
                    <SkillTreeNode title="Cloud Computing">
                        <SkillTreeNode title="Azure" />
                        <SkillTreeNode title="Google Cloud Platform" />
                    </SkillTreeNode>
                </SkillTreeNode>
                <SkillTreeNode title="Data Manipulation">
                    <SkillTreeNode title="Google Apps Script" />
                    <SkillTreeNode title="Python">
                        <SkillTreeNode title="Matrix Manipulation">
                            <SkillTreeNode title="" hide/>
                            <SkillTreeNode title="NumPy/ CuPy" />
                            <SkillTreeNode title="Pandas" />
                        </SkillTreeNode>
                        <SkillTreeNode title="Machine Learning">
                            <SkillTreeNode title="PyTorch" />
                        </SkillTreeNode>
                        <SkillTreeNode title="Data Visualization">
                            <SkillTreeNode title="Matplotlib" />
                            <SkillTreeNode title="" hide/>
                            <SkillTreeNode title="" hide/>
                        </SkillTreeNode>
                    </SkillTreeNode>
                    <SkillTreeNode title="R" />
                </SkillTreeNode>
                <SkillTreeNode title="" hide>
                    <SkillTreeNode title="Database Management">
                        <SkillTreeNode title="SQL">
                            <SkillTreeNode title="Oracle" />
                            <SkillTreeNode title="PostgreSQL" />
                        </SkillTreeNode>
                        <SkillTreeNode title="NoSQL">
                            <SkillTreeNode title="MongoDB" />
                            <SkillTreeNode title="Zoho Creator" />
                        </SkillTreeNode>
                    </SkillTreeNode>
                </SkillTreeNode>
            </SkillTreeNode>
            <SkillTreeNode title="Software Development">
                <SkillTreeNode title="Frontend">
                    <SkillTreeNode title="HTML" />
                    <SkillTreeNode title="CSS" />
                    <SkillTreeNode title="JavaScript" invertLineBend>
                        <SkillTreeNode title="Vue.js" />
                        <SkillTreeNode title="TypeScript" />
                        <SkillTreeNode title="" hide/>
                    </SkillTreeNode>
                </SkillTreeNode>
                <SkillTreeNode title="Backend">
                    <SkillTreeNode title="" hide/>
                    <SkillTreeNode title="" hide/>
                    <SkillTreeNode title="Go" />
                    <SkillTreeNode title="Shell Scripting" />
                    <SkillTreeNode title="Haskell" invertLineBend/>
                </SkillTreeNode>
            </SkillTreeNode>
            <SkillTreeNode title="Audio Engineering">
                <SkillTreeNode title="Music Production">
                    <SkillTreeNode title="Musician" />
                    <SkillTreeNode title="FoH Engineering" />
                    <SkillTreeNode title="Mix & Mastering">
                        <SkillTreeNode title="Cubase" />
                        <SkillTreeNode title="ProTools" />
                        <SkillTreeNode title="" hide/>
                    </SkillTreeNode>
                </SkillTreeNode>
                <SkillTreeNode title="Video Production" invertChildLineBend>
                    <SkillTreeNode title="Mix & Mastering" />
                    <SkillTreeNode title="Audio Restoration" />
                    <SkillTreeNode title="Recording" />
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
const depth: ComputedRef<number> = computed(() => {
    return 0;
});
const siblingIndex: Ref<number> = ref(0);
const x: ComputedRef<number> = computed(() => {return 0});
const y: ComputedRef<number> = computed(() => {return 0});
const min: Ref<number> = ref(0);
const max: Ref<number> = ref(0);
const height: ComputedRef<number> = computed(() => {
    return (max.value + 67.5) - (min.value - 67.5);
});
const position: ComputedRef<number> = computed(() => {
    return (height.value / 2) - (max.value + (101.25));
});
const childrenOnCorners: ComputedRef<boolean> = computed(() => {
    return true;
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
    return 0;
});

const nodeData = {
    children: children,
    childCount: childCount,
    childrenOnCorners: childrenOnCorners,
    depth: depth,
    siblingIndex: siblingIndex,
    invertChildLineBend: false,
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