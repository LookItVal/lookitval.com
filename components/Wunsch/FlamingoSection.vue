<template>
    <div class="wunsch">
        <div class="section">
            <slot></slot>
        </div>
        <div class="flamingo-container">
            <img src="~assets/Wunsch/flamingo.png" alt="Flamingo" class="flamingo" :style="`left:${position}%`"/>
        </div>
    </div>
    
</template>

<script>
export default {
    name: "WunschFlamingoSection",
    data() {
        return {
            position: Math.random() * 200
        };
    },
    mounted() {
        if (!window.animateFlamingos) {
            window.animateFlamingos = [];
        }
        window.animateFlamingos.push(this.animateFlamingo);
    },
    methods: {
        animateFlamingo() {
            this.position = Math.random() * 200;
            const flamingo = this.$el.querySelector('.flamingo');
            flamingo.classList.add('animate');
            setTimeout(() => {
                flamingo.classList.remove('animate');
            }, 4000);
        }
    }
}
</script>

<style lang="less" scoped>
.wunsch {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .section {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .flamingo-container {
        bottom: 0;
        position: relative;
        width: 500px;
        height: 0px;

        .flamingo {
            position: absolute;
            transform: translateY(100%);
            bottom: -100%;
            height: 200px;
            width: auto;
            z-index: 100;

            &.animate {
                animation: moveFlamingo 4s ease-in-out;
            }
        }
    }
}

@keyframes moveFlamingo {
    0%, 100% {
        transform: rotate(0deg) translateY(100%);;
    }
    35%, 65% {
        transform: rotate(0deg) translateY(0);;
    }
    40%, 50%, 60% {
        transform: rotate(10deg) translateY(0);
    }
    45%, 55% {
        transform: rotate(-10deg) translateY(0);
    }
}
</style>
