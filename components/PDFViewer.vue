<template>
    <div ref="pdfViewer" class="pdf-viewer hidden invisible" @click="toggleVisibility">
        <iframe :src="embeddedPdfUrl" class="pdf-frame" @click.stop></iframe>
        <a :href="pdfUrl" target="_self" class="download-link" @click.stop>
            <img src="~assets/icons/download.svg" alt="Download PDF" />
        </a>
    </div>
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
    computed: {
        embeddedPdfUrl() {
            return `https://docs.google.com/gview?url=${this.pdfUrl}&embedded=true`;
        }
    },
    methods: {
        toggleVisibility() {
            const pdf = this.$refs.pdfViewer;
            if (pdf.classList.contains('visible')) {
                pdf.classList.remove('visible');
                pdf.classList.add('invisible');
                setTimeout(() => pdf.classList.add('hidden'), 500);
            } else {
                pdf.classList.remove('hidden');
                setTimeout(() => {
                    pdf.classList.remove('invisible');
                    pdf.classList.add('visible');
                }, 0); // Fuck you javascript. Do not delete this or transitions dont happen.
            }
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

    .download-link {
        position: absolute;
        top: 0;
        right: 0;
        img {
            width: 50px;
            height: 50px;
        }
    }
}

.visible {
    opacity: 1;
    transition: opacity 0.5s;
    .pdf-frame {
        transform: scale(1);
        transition: transform 0.5s;
    }
}
.invisible {
    opacity: 0;
    transition: opacity 0.5s;
    .pdf-frame {
        transform: scale(0);
        transition: transform 0.5s;
    }
}
.hidden {
    display: none;
}
</style>