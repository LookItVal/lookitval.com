<template>
    <div class="the-wunsch">
        <WunschBalloon ref="balloon"/>
    </div>
</template>

<script>
export default {
    name: 'Wunsch',
    data() {
        return {
            wunsch: 'wunsch',
            letterIndex: 0
        };
    },  
    methods: {
        run() {
            this.$refs.balloon.animateBalloon();
        },
        handleKeydown(event) {
            if (event.key.toLowerCase() === this.wunsch[this.letterIndex].toLowerCase()) {
                this.letterIndex++;
                if (this.letterIndex === this.wunsch.length) {
                    this.run();
                    this.letterIndex = 0;
                }
            } else {
                this.letterIndex = 0;
            }     
        }
    },
    mounted() {
        window.addEventListener('keydown', this.handleKeydown);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeydown);
    }
};
</script>