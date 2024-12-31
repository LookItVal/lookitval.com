<template>
    <div class="node-container">
        <div class="node">
            <svg class="node-shell" viewBox="0 0 100 100">
                <path class="hex" d="M 5 50
                                     L 5 32.5
                                     C 5 25 5 25 11.75 21.4
                                     L 43.25 4.6
                                     C 50 1 50 1 56.75 4.6
                                     L 88.25 21.4
                                     C 95 25 95 25 95 32.5
                                     L 95 67.5
                                     C 95 75 95 75 88.25 78.6
                                     L 56.75 95.4
                                     C 50 99 50 99 43.25 95.4
                                     L 11.75 78.6
                                     C 5 75 5 75 5 67.5
                                     Z" fill="none" stroke-width="2" stroke="var(--text)" />
            </svg>
            {{ title }}
        </div>
        <div class="children">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SkillTreeNode',
    props: {
        title: String
    },
    data() {
        return {
            children: []
        }
    },
    computed: {
        parentNode() {
            let parent = this.$parent;
            return parent;
        },
        phase() {
            return 0;
        }
    },
    mounted() {
        this.$parent.$data.children.push(this);
    }
};
</script>

<style lang="less" scoped>
.node-container {
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
}
</style>