<template>
    <div ref="balloon" class="balloon">
        <img src="~assets/balloon.png" alt="balloon" />
        <div class="balloon-bubble">
            <h6>I am a Social Media Expert!</h6>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WunschBalloon',
    methods: {
        animateBalloon() {
            const balloon = this.$refs.balloon;
            balloon.classList.remove('animate');
            setTimeout(() => balloon.classList.add('animate'), 0);
            setTimeout(() => balloon.classList.remove('animate'), 20000);
        }
    }
};
</script>

<style lang="less" scoped>
.balloon {
    position: fixed;
    bottom: -50vh;
    left: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
        width: 300px;
        height: 300px;
        background-color: white;
    }
    .balloon-bubble {
        position: absolute;
        top: 20px;
        width: 200px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--crust);
        padding: 10px;
        border-radius: 100px;
        h6 {
            font-family: 'Comic Sans';
            margin: 0;
            color: white;
            text-align: center;
        }
    }
}

.animate {
    animation: float 20s, wind 20s ease-in-out;
}

@keyframes float {
    0% {
        bottom: -50vh;
    }
    100% {
        bottom: 200vh;
    }
}

@keyframes wind {
    0% {
        transform: translateX(0);
    }
    10% {
        transform: translateX(50px);
    }
    20% {
        transform: translateX(0);
    }
    30% {
        transform: translateX(50px);
    }
    40% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(50px);
    }
    60% {
        transform: translateX(0);
    }
    70% {
        transform: translateX(50px);
    }
    80% {
        transform: translateX(0);
    }
    90% {
        transform: translateX(50px);
    }
    100% {
        transform: translateX(0);
    }
}
</style>