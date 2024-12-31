<template>
    <div ref="skillTree" class="skill-tree">
        <SkillTreeNode title="Audio Engineering">
        </SkillTreeNode>
        <SkillTreeNode title="Data Science">
        </SkillTreeNode>
        <SkillTreeNode title="Software Development">
        </SkillTreeNode>
    </div> 
</template>

<script>
export default {
    name: 'SkillTree',
    data() {
        return {
            children: []
        }
    }
}
</script>