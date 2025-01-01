declare global {
    interface SkillTreeNode {
        parentNode: SkillTreeNode | undefined;
        children: Ref<Array<SkillTreeNode>>;
        childCount: ComputedRef<number>;
        siblingIndex: Ref<number>;
        getPreviousSiblingAdjacent(): SkillTreeNode;
        getNextSiblingAdjacent(): SkillTreeNode;
        previousNeighbor: ComputedRef<SkillTreeNode>;
        nextNeighbor: ComputedRef<SkillTreeNode>;
        traverseToBottom(direction: 'min' | 'max'): SkillTreeNode;
        x: ComputedRef<number>;
        y: ComputedRef<number>;
        phase: ComputedRef<number>;
        min: Ref<number>;
        max: Ref<number>;
    }
}

export {};
