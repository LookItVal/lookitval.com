declare global {
    interface SkillTreeNode {
        children: Ref<Array<SkillTreeNode>>;
    }
}

export {};
