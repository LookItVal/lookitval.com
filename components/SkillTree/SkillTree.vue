<template>
    <div ref="skillTree" class="skill-tree" :style="{height: (height) + 'vw', top: (position) + 'vw'}" :click="shimmer">
        <div class="root-node" :style="{'margin-top': `${diameter}vw`, 'margin-left': `${0}vw`}">
            <SkillTreeNode title="Data Science" icon="icons/dataScience.svg">
                <SkillTreeNode title="" hide>
                    <SkillTreeNode title="Cloud Computing" icon="icons/cloudComputing.svg">
                        <SkillTreeNode title="Azure" icon="icons/Microsoft_Azure.svg"/>
                        <SkillTreeNode title="Google Cloud Platform" icon="icons/googleCloudPlatform.svg"/>
                    </SkillTreeNode>
                </SkillTreeNode>
                <SkillTreeNode title="Data Manipulation" icon="icons/dataManipulation.svg">
                    <SkillTreeNode title="Google Apps Script" icon="icons/googleAppsScript.svg"/>
                    <SkillTreeNode title="Python" icon="icons/python.svg">
                        <SkillTreeNode title="Matrix Manipulation" icon="icons/matrixManipulation.svg">
                            <SkillTreeNode title="" hide/>
                            <SkillTreeNode title="NumPy/ CuPy" icon="icons/numPy.svg"/>
                            <SkillTreeNode title="Pandas" icon="icons/pandas.svg"/>
                        </SkillTreeNode>
                        <SkillTreeNode title="Machine Learning" icon="icons/machineLearning.svg">
                            <SkillTreeNode title="PyTorch" icon="icons/pyTorch.svg"/>
                        </SkillTreeNode>
                        <SkillTreeNode title="Data Visualization" icon="icons/dataVisualization.svg">
                            <SkillTreeNode title="Matplotlib" icon="icons/matplotlib.svg"/>
                            <SkillTreeNode title="" hide/>
                            <SkillTreeNode title="" hide/>
                        </SkillTreeNode>
                    </SkillTreeNode>
                    <SkillTreeNode title="R" icon="icons/R.svg"/>
                </SkillTreeNode>
                <SkillTreeNode title="" hide>
                    <SkillTreeNode title="Database Management" icon="icons/databaseManagement.svg">
                        <SkillTreeNode title="SQL" icon="icons/SQLDatabases.svg">
                            <SkillTreeNode title="Oracle" icon="icons/OracleSQL.svg"/>
                            <SkillTreeNode title="PostgreSQL" icon="icons/postgresql.svg"/>
                        </SkillTreeNode>
                        <SkillTreeNode title="NoSQL" icon="icons/NoSQLDatabases.svg">
                            <SkillTreeNode title="MongoDB" icon="icons/mongodb.svg"/>
                            <SkillTreeNode title="Zoho Creator" icon="icons/zohoCreator.svg"/>
                        </SkillTreeNode>
                    </SkillTreeNode>
                </SkillTreeNode>
            </SkillTreeNode>
            <SkillTreeNode title="Software Development" icon="icons/softwareEngineering.svg">
                <SkillTreeNode title="Frontend" icon="icons/frontend.svg">
                    <SkillTreeNode title="HTML" icon="icons/html5.svg"/>
                    <SkillTreeNode title="CSS" icon="icons/css3.svg"/>
                    <SkillTreeNode title="JavaScript" icon="icons/javascript.svg" invertLineBend>
                        <SkillTreeNode title="Vue.js" icon="icons/vuejs.svg">
                            <SkillTreeNode title="" hide />
                            <SkillTreeNode title="" hide />
                            <SkillTreeNode title="Nuxt.js" icon="icons/nuxtjs.svg"/>
                        </SkillTreeNode>
                        <SkillTreeNode title="TypeScript" icon="icons/typescript.svg"/>
                        <SkillTreeNode title="" hide/>
                    </SkillTreeNode>
                </SkillTreeNode>
                <SkillTreeNode title="Backend" icon="icons/backend.svg">
                    <SkillTreeNode title="" hide/>
                    <SkillTreeNode title="" hide/>
                    <SkillTreeNode title="Go" icon="icons/golang.svg"/>
                    <SkillTreeNode title="Shell Scripting" icon="icons/bash.svg"/>
                    <SkillTreeNode title="Haskell" icon="icons/haskell.svg" invertLineBend/>
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
const diameter: ComputedRef<number> = computed(() => {
    return 4;
});
const height: ComputedRef<number> = computed(() => {
    return (max.value + (diameter.value/2)) - (min.value - (diameter.value/2));
});

const position: ComputedRef<number> = computed(() => {
    return -(height.value/2) - (min.value);
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

function shimmer(event: MouseEvent|undefined, group: number = 0): void {
    return;
    children.value.forEach((child) => {
        child.shimmer(undefined, 1);
        child.shimmer(undefined, 2);
        child.shimmer(undefined, 3);

    });
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
        height: 0;
        width: 0;
    }
}   
</style>