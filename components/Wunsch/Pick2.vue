<template>
    <div ref="root" class="pick2 cut">
        <div class="line1">
            <h2 ref="good" class="cut">GOOD</h2>
            <h2 ref="fast" class="cut">FAST</h2>
        </div>
        <div class="line2">
            <h2 ref="cheap" class="cut">CHEAP</h2>
        </div>
        <div class="line3">
            <h4 ref="pick" class="cut">Pick</h4><h4 ref="two" class="cut">two.</h4>
        </div>
    </div>
</template>

<script>
import audio1Src from '~/assets/Wunsch/Pick2/1.wav';
import audio2Src from '~/assets/Wunsch/Pick2/2.wav';
import audio3Src from '~/assets/Wunsch/Pick2/3.wav';

export default {
    name: 'WunschPick2',
    methods: {
        animate() {
            const audio1 = new Audio(audio1Src);
            const audio2 = new Audio(audio2Src);
            const audio3 = new Audio(audio3Src);
            this.$refs.root.classList.remove('cut');
            audio1.play();
            setTimeout(() => audio2.play(), 850);
            setTimeout(() => this.$refs.good.classList.remove('cut'), 1000);
            setTimeout(() => audio2.play(), 1850);
            setTimeout(() => this.$refs.fast.classList.remove('cut'), 2000);
            setTimeout(() => audio2.play(), 2850);
            setTimeout(() => this.$refs.cheap.classList.remove('cut'), 3000);
            setTimeout(() => audio3.play(), 3500);
            setTimeout(() => this.$refs.pick.classList.remove('cut'), 5600);
            setTimeout(() => this.$refs.two.classList.remove('cut'), 6000);
            setTimeout(() => this.reset(), 8000);

        },
        reset() {
            this.$refs.root.classList.add('cut');
            this.$refs.good.classList.add('cut');
            this.$refs.fast.classList.add('cut');
            this.$refs.cheap.classList.add('cut');
            this.$refs.pick.classList.add('cut');
            this.$refs.two.classList.add('cut');
        }
    }
};
</script>

<style lang="less" scoped>
.pick2 {
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: black;
    border: 1px solid black;

    .line1 {
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;
        width: 100%;

        h2 {
            color: white;
            font-size: 3em;
        }
    }

    .line2 {
        display: flex;
        justify-content: center;
        flex-direction: row;
        width: 100%;
        margin-top: 100px;

        h2 {
            color: white;
            font-size: 3em;
        }
    }

    .line3 {
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin-top: 200px;
        width: 100%;

        h4 {
            color: white;
            font-size: 2em;
            margin: 0 10px;
        }
    }
}

.cut {
    opacity: 0;
    transition: opacity 1s ease-in;
}
</style>