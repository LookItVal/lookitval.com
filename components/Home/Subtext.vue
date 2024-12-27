<template>
    <div class="subtext">
        <h2>-</h2> <GradientText :text="displayText" header-tag="h2" :color="currentColor" />
    </div>
</template>

<script>
export default {
    name: 'HomeSubtext',
    data() {
        return {
            texts: [
                { text: "Data Scientist", color: "orange" },
                { text: "Audio Engineer", color: "yellow" },
                { text: "Web Developer", color: "green" },
                { text: "Software Developer", color: "blue" }
            ],
            displayText: ' ',
            currentTextIndex: 0,
            currentCharIndex: 0,
            isDeleting: false
        };
    },
    mounted() {
        this.type();
    },
    methods: {
        type() {
            const currentTextObj = this.texts[this.currentTextIndex];
            const currentText = currentTextObj.text;
            if (this.isDeleting) {
                this.displayText = currentText.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
            } else {
                this.displayText = currentText.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
            }

            if (!this.isDeleting && this.currentCharIndex === currentText.length) {
                setTimeout(() => this.isDeleting = true, 1000);
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }

            setTimeout(this.type, this.isDeleting ? 100 : 200);
        }
    },
    computed: {
        currentColor() {
            return this.texts[this.currentTextIndex].color;
        }
    }
}
</script>

<style lang="less" scoped>
.subtext {
    padding-left: 5%;
    display: flex;
    border-right: 0.2em solid var(--text);
    animation: blink-caret 0.75s step-end infinite;
    h2 {
        overflow: hidden;
        text-align: left;
        color: var(--text);
        margin-right: 0.25em;
    }
}

@keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: var(--text); }
}
</style>