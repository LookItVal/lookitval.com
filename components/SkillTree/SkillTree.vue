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


<script lang="ts" setup>
const children: Ref<Array<SkillTreeNode>> = ref([]);

const nodeData = {
    children: children
}

provide('nodeData', nodeData);
</script>