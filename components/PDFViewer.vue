<template>
    <Transition name="fade">
        <div v-if="isVisible" class="pdf-viewer" @click="toggleVisibility">
            <iframe :src="embeddedPdfUrl" class="pdf-frame" @click.stop></iframe>
        </div>
    </Transition>
</template>

<script>
export default {
    name: 'PDFViewer',
    props: {
        pdfUrl: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isVisible: true
        };
    },
    computed: {
        embeddedPdfUrl() {
            return `https://docs.google.com/gview?url=${this.pdfUrl}&embedded=true`;
        }
    },
    methods: {
        toggleVisibility() {
            this.isVisible = !this.isVisible;
        }
    }
};
</script>

<style lang="less" scoped>
.pdf-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .pdf-frame {
        width: 80%;
        height: 80%;
        border: none;
    }
}

.fade-enter-active, .fade-leave-active {
    opacity: 1;
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
    
</style>