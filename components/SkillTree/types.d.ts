declare global {
    interface SkillTreeNode {
        parentNode: SkillTreeNode | undefined;
        children: Ref<Array<SkillTreeNode>>;
        childCount: ComputedRef<number>;
        childrenOnCorners: ComputedRef<boolean>;
        depth: ComputedRef<number>;
        siblingIndex: Ref<number>;
        traverseToBottom(direction: 'min' | 'max'): SkillTreeNode;
        x: ComputedRef<number>;
        y: ComputedRef<number>;
        phase: ComputedRef<number>;
        min: Ref<number>;
        max: Ref<number>;
    }
}

export {};
