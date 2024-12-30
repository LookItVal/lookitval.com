<template>
    <div class="the-wunsch">
        <WunschBalloon ref="balloon"/>
        <WunschColorShift ref="colorShift"/>
        <WunschPick2 ref="pick2"/>
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
            const commands = [
                this.$refs.balloon.animateBalloon,
                this.$refs.colorShift.shift,
                this.animateFlamingos,
                this.$refs.pick2.animate
            ]
            const randomIndex = Math.floor(Math.random() * commands.length);
            commands[randomIndex]();
        },
        handleKeydown(event) {
            if (event.key && event.key.toLowerCase() === this.wunsch[this.letterIndex].toLowerCase()) {
                this.letterIndex++;
                if (this.letterIndex === this.wunsch.length) {
                    this.run();
                    this.letterIndex = 0;
                }
            } else {
                this.letterIndex = 0;
            }     
        },
        animateFlamingos() {
            window.animateFlamingos.forEach((animateFlamingo) => animateFlamingo());
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