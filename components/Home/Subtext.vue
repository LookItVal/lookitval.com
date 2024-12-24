<template>
    <div class="subtext">
        <h2 :style="{ color: currentColor }">
            <span>- </span>{{ displayText }}
        </h2>
    </div>
</template>

<script>
export default {
    name: 'HomeSubtext',
    data() {
        return {
            texts: [
                { text: "Data Scientist", color: "red" },
                { text: "Audio Engineer", color: "yellow" },
                { text: "Web Developer", color: "green" },
                { text: "Software Developer", color: "mauve" }
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
            const color = this.texts[this.currentTextIndex].color;
            return `var(--${color})`;
        }
    }
}
</script>

<style scoped>
.subtext {
    padding-left: 5%;
}

h2 {
    white-space: nowrap;
    overflow: hidden;
    border-right: 0.15em solid var(--text);
    animation: blink-caret 0.75s step-end infinite;
    text-align: left;
}
h2 span {
    color: var(--text);
}

@keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: var(--text); }
}
</style>