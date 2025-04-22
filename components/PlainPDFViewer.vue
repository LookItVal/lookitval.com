<template>
    <div ref="pdfViewer" class="pdf-viewer">
        <iframe :src="embeddedPdfUrl" class="pdf-frame"></iframe>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    pdfUrl: string;
}>();

const embeddedPdfUrl: ComputedRef<string> = computed(() => {
    return `https://docs.google.com/gview?url=${props.pdfUrl}&embedded=true`;
});
</script>

<style lang="less" scoped>
.pdf-viewer {
    position: relative;
    width: 100%;
    height: 100vh;
    
    .pdf-frame {
        position: relative;
        width: 100%;
        height: 100%;
    }
}
</style>