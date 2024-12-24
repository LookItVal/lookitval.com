<template>
  <div class="home">
    <div class="navbar">
        <Logo />
        <div height="100%">
            <NuxtLink to="/portfolio" height="100%">
                <button>Portfolio</button>
            </NuxtLink>
            <NuxtLink to="/contact" height="100%">
                <button>Contact</button>
            </NuxtLink>
        </div>
    </div>
    <div class="landing">
        <span class="background-lambda">λ</span>
        <div class="left-text">
            <h1>Quinn Valencia Cecil</h1>
            <h2>Full Stack Developer</h2>
        </div>
        <div class="right-image">
            <img src="~assets/BoomOp.png" alt="Quinn Valencia Cecil" />
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
    .home {
        overflow: hidden;
    }

    .landing {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
        padding: 0 10%;
    }

    .background-lambda {
        translate: 0 -20%;
        font-size: 120vh;
        color: var(--crust);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1000;
    }

    .left-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
    }
    .right-image {
        width: 25%;
    }

    .right-image img {
        height: 100%;
        padding-left: 20%;
        padding-bottom: 50%;
        object-fit: cover;
        object-position: bottom;
    }
</style>