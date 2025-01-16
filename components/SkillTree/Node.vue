<template>
    <div ref="container" class="node-container" :style="{ top: `-${diameter/2}vw`, left: `-${diameter/2}vw` }">
        <div class="node" :class="{ hide: hideLine, hideBody: hide }" :style="{ transform: `translate(${x}vw, ${y}vw)`, 'z-index': zIndex, width: `${diameter}vw`, height: `${diameter}vw` }" @mouseenter="hoverIn" @mouseleave="hoverOut">
            <svg class="node-shell" viewBox="0 0 100 100" >
                <defs>
                    <radialGradient id="spark-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:var(--peach);stop-opacity:1" />
                        <stop offset="60%" style="stop-color:var(--yellow);stop-opacity:0.4" />
                        <stop offset="90%" style="stop-color:var(--yellow);stop-opacity:0.1" />
                        <stop offset="100%" style="stop-color:var(--yellow);stop-opacity:0" />
                    </radialGradient>
                    <mask :id="`icon-mask-${uniqueId}`" height="100%" width="100%">
                        <image :href="props.icon" height="65" width="65" x="17.5" y="17.5"/>
                    </mask>
                </defs>
                <path v-if="onCorners" class="line" :d="`M 50 50 L ${lineEndX} ${lineEndY}`" stroke="var(--text)" stroke-width="2.5"/>
                <path v-else class="line" :d="`M 50 50 L ${lineKneeX} ${lineKneeY} L ${lineEndX} ${lineEndY}`" stroke="var(--text)" stroke-width="2.5" fill="none"/>
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
                                     Z" fill="var(--crust)" stroke-width="2.5" stroke="var(--text)" />
                <path v-if="onCorners && !soloLine" :id="'path1'+uniqueId" :d="`M ${pathX0} ${pathY0} L ${pathX1} ${pathY1} L ${path0X2} ${path0Y2} L ${path0X3} ${path0Y3} L ${pathX4} ${pathY4}`" stroke="none" fill="none"/>
                <path v-if="onCorners && !soloLine" :id="'path2'+uniqueId" :d="`M ${pathX0} ${pathY0} L ${pathX1} ${pathY1} L ${path1X2} ${path1Y2} L ${path1X3} ${path1Y3} L ${pathX4} ${pathY4}`" stroke="none" fill="none"/>
                <path v-if="!onCorners && !soloLine" :id="'path1'+uniqueId" :d="`M ${pathX0} ${pathY0} L ${lineKneeX} ${lineKneeY} L ${pathX1} ${pathY1} L ${path0X2} ${path0Y2} L ${path0X3} ${path0Y3} L ${pathX4} ${pathY4}`" stroke="none" fill="none"/>
                <path v-if="!onCorners && !soloLine" :id="'path2'+uniqueId" :d="`M ${pathX0} ${pathY0} L ${lineKneeX} ${lineKneeY} L ${pathX1} ${pathY1} L ${path1X2} ${path1Y2} L ${path1X3} ${path1Y3} L ${pathX4} ${pathY4}`" stroke="none" fill="none"/>
                <path v-if="soloLine" :id="'path1'+uniqueId" :d="`M ${pathX0} ${pathY0} L ${pathX4} ${pathY4}`" stoke="none" fill="none"/>
                <path v-if="soloLine" :id="'path2'+uniqueId" :d="`M ${pathX0} ${pathY0} L ${pathX4} ${pathY4}`" stoke="none" fill="none"/>
                <circle :class="'shimmer-ball'+uniqueId" class='static' r="10" fill="url(#spark-gradient)">
                    <animateMotion dur="0.5s" fill="freeze">
                        <mpath :href="'#path1'+uniqueId" />
                    </animateMotion>
                </circle>
                <circle :class="'shimmer-ball'+uniqueId" class='static' r="10" fill="url(#spark-gradient)">
                    <animateMotion dur="0.5s" fill="freeze">
                        <mpath :href="'#path2'+uniqueId" />
                    </animateMotion>
                </circle>
                <circle v-if='!props.hide' :class="'shimmer-bg'+uniqueId" class='static' r="50" cx="50" cy="50" fill="url(#spark-gradient)" />
                <rect v-if='props.icon' class="icon" :mask="`url(#icon-mask-${uniqueId})`" x="0" y="0" height="100" width="100" fill="var(--text)"/>
            </svg>
            <p v-if="!props.icon" style="z-index: 1;">
                {{ title }}
            </p>
        </div>
        <div class="children" :style="{ top: `${diameter/2}vw`, left: `${diameter/2}vw` }">
            <slot />
        </div>
    </div>
</template>


<script lang="ts" setup>
const container = ref<HTMLElement>();
const props = defineProps<{
    title: string,
    icon?: string,
    hide?: boolean,
    invertLineBend?: boolean,
    invertChildLineBend?: boolean
}>();
const isAnimating: Ref<boolean> = ref(false);
const hexRadius: number = 49;
const uniqueId: string =  `${Math.random().toString(36).substring(2, 11)}`
const hideLine: ComputedRef<boolean> = computed(() => {
    return props.hide && (childCount.value === 0);
});
const soloLine: ComputedRef<boolean> = computed(() => {
    return props.hide && !hideLine.value;
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
        if (phase.value % 60 === 0) {
            return true;
        } else {
            return false;
        }
    } else {
        if (phase.value % 60 === 0) {
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

const diameter: ComputedRef<number> = computed(() => {
    return 4;
});
const radius: ComputedRef<number> = computed(() => {
    if (parentNode!.parentNode === undefined) return 5;
    return 4.5;
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
    if (parentNode!.invertChildLineBend) {
        val *= -1 as -1 | 1; 
    }
    if (props.invertLineBend) {
        return -1 * val as -1 | 1; 
    }
    return 1 * val as -1 | 1;
});

const lineKneeX: ComputedRef<number> = computed(() => {
    let rad = 100*radius.value/diameter.value;
    const angle = calculateAngleToNode(parentNode!) + (lineBendCoefficent.value * 30);
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    return (rad * Math.cos(angle * Math.PI / 180)) + 50;
});
const lineKneeY: ComputedRef<number> = computed(() => {
    let rad = 100*radius.value/diameter.value;
    const angle = calculateAngleToNode(parentNode!) + (lineBendCoefficent.value * 30);
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    return (rad * Math.sin(angle * Math.PI / 180)) + 50;
});

const lineEndX: ComputedRef<number> = computed(() => {
    let rad = 100*radius.value/diameter.value;
    const angle = calculateAngleToNode(parentNode!);
    return (rad * Math.cos(angle * Math.PI / 180)) + 50;
});
const lineEndY: ComputedRef<number> = computed(() => {
    let rad = 100*radius.value/diameter.value;
    const angle = calculateAngleToNode(parentNode!);
    return (rad * Math.sin(angle * Math.PI / 180)) + 50;
});
const initialAngle: ComputedRef<number> = computed(() => {
    if (onCorners.value) {
        return calculateVectorPhase(50, 50, lineEndX.value, lineEndY.value);
    }
    return calculateVectorPhase(lineKneeX.value, lineKneeY.value, lineEndX.value, lineEndY.value);
});
const secondAngle: ComputedRef<number> = computed(() => {
    if (onCorners.value) {
        return calculateVectorPhase(50, 50, lineEndX.value, lineEndY.value);
    }
    return calculateVectorPhase(50, 50, lineKneeX.value, lineKneeY.value);
});
const initialMagnitude: ComputedRef<number> = computed(() => {
    const rad = 100*radius.value/diameter.value;
    return rad - 2*hexRadius;
});
const pathX0: ComputedRef<number> = computed(() => {
    let rad = hexRadius + initialMagnitude.value;
    if (onCorners.value) {
        return rad * Math.cos((phase.value-180) * Math.PI / 180) + 50;
    }
    rad = 100*radius.value/diameter.value;
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    rad = rad - hexRadius;
    const angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, lineEndX.value, lineEndY.value);
    const position = calulateVectorPosition(lineKneeX.value, lineKneeY.value, angle, rad);
    return position.x;
});
const pathY0: ComputedRef<number> = computed(() => {
    let rad = hexRadius + initialMagnitude.value;
    if (onCorners.value) {
        return rad * Math.sin((phase.value-180) * Math.PI / 180) + 50;
    }
    rad = 100*radius.value/diameter.value;
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    rad = rad - hexRadius;
    const angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, lineEndX.value, lineEndY.value);
    const position = calulateVectorPosition(lineKneeX.value, lineKneeY.value, angle, rad);
    return position.y;
});
const pathX1: ComputedRef<number> = computed(() => {
    if (onCorners.value) {
        return hexRadius * Math.cos((phase.value-180) * Math.PI / 180) + 50;
    }
    let rad = 100*radius.value/diameter.value;
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    rad = rad - hexRadius;
    const angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, 50, 50);
    const position = calulateVectorPosition(lineKneeX.value, lineKneeY.value, angle, rad);
    return position.x;
});
const pathY1: ComputedRef<number> = computed(() => {
    if (onCorners.value) {
        return hexRadius * Math.sin((phase.value-180) * Math.PI / 180) + 50;
    }
    let rad = 100*radius.value/diameter.value;
    rad = (Math.sin(30 * Math.PI / 180)* rad )/Math.sin(120 * Math.PI / 180);
    rad = rad - hexRadius;
    const angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, 50, 50);
    const position = calulateVectorPosition(lineKneeX.value, lineKneeY.value, angle, rad);
    return position.y;
});
const path0X2: ComputedRef<number> = computed(() => {
    let angle = 0
    if (onCorners.value) {
        angle = phase.value + 60;
    } else {
        angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, pathX1.value, pathY1.value) + 60;
    }
    const position = calulateVectorPosition(pathX1.value, pathY1.value, angle, hexRadius);
    return position.x;
});
const path0Y2: ComputedRef<number> = computed(() => {
    let angle = 0
    if (onCorners.value) {
        angle = phase.value + 60;
    } else {
        angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, pathX1.value, pathY1.value) + 60;
    }
    const position = calulateVectorPosition(pathX1.value, pathY1.value, angle, hexRadius);
    return position.y;
});
const path1X2: ComputedRef<number> = computed(() => {
    let angle = 0
    if (onCorners.value) {
        angle = phase.value - 60;
    } else {
        angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, pathX1.value, pathY1.value) - 60;
    }
    const position = calulateVectorPosition(pathX1.value, pathY1.value, angle, hexRadius);
    return position.x;
});
const path1Y2: ComputedRef<number> = computed(() => {
    let angle = 0
    if (onCorners.value) {
        angle = phase.value - 60;
    } else {
        angle = calculateVectorPhase(lineKneeX.value, lineKneeY.value, pathX1.value, pathY1.value) - 60;
    }
    const position = calulateVectorPosition(pathX1.value, pathY1.value, angle, hexRadius);
    return position.y;
});
const path0X3: ComputedRef<number> = computed(() => {
    const angle = calculateVectorPhase(pathX1.value, pathY1.value, path0X2.value, path0Y2.value) - 60;
    const position = calulateVectorPosition(path0X2.value, path0Y2.value, angle, hexRadius);
    return position.x;
});
const path0Y3: ComputedRef<number> = computed(() => {
    const angle = calculateVectorPhase(pathX1.value, pathY1.value, path0X2.value, path0Y2.value) - 60;
    const position = calulateVectorPosition(path0X2.value, path0Y2.value, angle, hexRadius);
    return position.y;
});
const path1X3: ComputedRef<number> = computed(() => {
    const angle = calculateVectorPhase(pathX1.value, pathY1.value, path1X2.value, path1Y2.value) + 60;
    const position = calulateVectorPosition(path1X2.value, path1Y2.value, angle, hexRadius);
    return position.x;
});
const path1Y3: ComputedRef<number> = computed(() => {
    const angle = calculateVectorPhase(pathX1.value, pathY1.value, path1X2.value, path1Y2.value) + 60;
    const position = calulateVectorPosition(path1X2.value, path1Y2.value, angle, hexRadius);
    return position.y;
});
const pathX4: ComputedRef<number> = computed(() => {
    const angle = calculateVectorPhase(path1X2.value, path1Y2.value, path1X3.value, path1Y3.value) + 60;
    const position = calulateVectorPosition(path1X3.value, path1Y3.value, angle, hexRadius);
    return position.x;
});
const pathY4: ComputedRef<number> = computed(() => {
    const angle = calculateVectorPhase(path1X2.value, path1Y2.value, path1X3.value, path1Y3.value) + 60;
    const position = calulateVectorPosition(path1X3.value, path1Y3.value, angle, hexRadius);
    return position.y;
});

const animateGroupKey: ComputedRef<{[key: string]: Array<number>}> = computed(() => {
    const angle = Math.round(secondAngle.value / 10) * 10 + 180;
    const group1 = [
        angle + 60,
        angle - 60,
        angle + 60 + 360,
        angle - 60 + 360,
        angle + 60 - 360,
        angle - 60 - 360
    ]
    const group2 = [
        angle + 120,
        angle - 120,
        angle + 120 + 360,
        angle - 120 + 360,
        angle + 120 - 360,
        angle - 120 - 360
    ]
    const group3 = [
        angle + 180,
        angle - 180,
        angle + 180 + 360,
        angle - 180 + 360,
        angle + 180 - 360,
        angle - 180 - 360
    ]
    return {
        group1: group1,
        group2: group2,
        group3: group3
    }
});

const animateGroup: ComputedRef<number> = computed(() => {
    const key = parentNode!.animateGroupKey.value;
    const angle = Math.round(initialAngle.value / 10) * 10; 
    if (key.group1.includes(angle)) {
        return 1;
    }
    if (key.group2.includes(angle)) {
        return 2;
    }
    if (key.group3.includes(angle)) {
        return 3;
    }
    return 0;
});

const root: ComputedRef<SkillTreeNode> = computed(() => {
    let localParentNode = parentNode;
    while (localParentNode!.parentNode) {
        localParentNode = localParentNode!.parentNode;
    }
    return localParentNode!;
});

function hoverIn(event: MouseEvent): void {
    shimmer(event);
    const shimmerBgs = container.value!.querySelectorAll('.shimmer-bg'+uniqueId) || [];
    shimmerBgs.forEach((ball: Element) => {
        ball.classList.add('hover');
        if (ball.classList.contains('static')) {
            ball.classList.remove('static');
            ball.classList.add('shine');
        }
    });
}

function hoverOut(event: MouseEvent): void {
    const shimmerBgs = container.value!.querySelectorAll('.shimmer-bg'+uniqueId) || [];
    shimmerBgs.forEach((ball: Element) => {
        ball.classList.remove('hover');
        if (ball.classList.contains('shine')) {
            ball.classList.remove('shine');
            ball.classList.add('static');
        }
    });
}

function shimmer(event: MouseEvent|undefined, group: number = 0): void {
    if (isAnimating.value) return;
    if (group !== 0 && animateGroup.value !== group) return;
    isAnimating.value = true;
    const shimmerBalls = container.value!.querySelectorAll('.shimmer-ball'+uniqueId) || [];
    const shimmerBgs = container.value!.querySelectorAll('.shimmer-bg'+uniqueId) || [];
    shimmerBgs.forEach((ball: Element) => {
        if (soloLine.value) return;
        ball.classList.remove('static');
        ball.classList.add('shine');
    });
    shimmerBalls.forEach((ball: Element) => {
        ball.classList.remove('static');
        ball.classList.add('shine');
        const anim = ball.querySelector('animateMotion') as SVGAnimateMotionElement;
        anim.beginElement();
    });
    setTimeout(() => {
        children.value!.forEach((child: SkillTreeNode) => {
            child.shimmer(undefined, 1);
        });
    }, 350/2);
    setTimeout(() => {
        children.value!.forEach((child: SkillTreeNode) => {
            child.shimmer(undefined, 2);
        });
    }, 650/2);        
    setTimeout(() => {
        children.value!.forEach((child: SkillTreeNode) => {
            child.shimmer(undefined, 3);
        });
    }, 975/2);
    setTimeout(() => {
        shimmerBalls.forEach((ball: Element) => {
            ball.classList.remove('shine');
            ball.classList.add('static');
        });
        shimmerBgs.forEach((ball: Element) => {
            if (ball.classList.contains('hover')) return;
            ball.classList.remove('shine');
            ball.classList.add('static');
        });
        isAnimating.value = false;
    }, 1000/2);
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
    invertChildLineBend: props.invertChildLineBend,
    x: x,
    y: y,
    phase: phase,
    min: min,
    max: max,
    traverseToBottom: traverseToBottom,
    shimmer: shimmer,
    animateGroupKey: animateGroupKey,
    animateGroup: animateGroup
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

    .node {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        font-size: 0.45em;
        text-align: center;
        white-space: pre-line;
        word-break: break-word;
        word-spacing: 100px;

        &.hide {
            opacity: 0;
            pointer-events: none;
        }
        &.hideBody {
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

            .static {
                opacity: 0;
                transition: opacity 0.05s;
            }
            .shine {
                opacity: 1;
                transition: opacity 0.05s;
            }

            [class^="shimmer-bg"] {
                &.shine {
                    r: 50;
                    transition: r 0.5s cubic-bezier(0,1,0,1);
                }
                &.static {
                    r: 0;
                    opacity: 1;
                    transition: r 1s cubic-bezier(0,1,.5,1);
                }
            }
        }
    }

    .children {
        position: absolute;
    }
}
</style>