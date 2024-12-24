<template>
  <div class="home">
    <HomeNavbar />
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
    <div class="about">
        <div class="left-image">
            <img src="~assets/SoundGirl.jpg" alt="Quinn Valencia Cecil" />
        </div>
        <div class="right-text">
            <h2>About Me</h2>
            <p>Hi! I'm Quinn, a full stack developer with a background in audio engineering. I love creating things, whether it's a new song or a new app. I'm passionate about accessibility and making the web a better place for everyone. I'm currently looking for new opportunities to grow and learn.</p>
            <button>Resume</button>
        </div>
    </div>
    <div class="skills">
        <h2>Skills</h2>
    </div>
    <div class="portfolio">
        <h2>Portfolio</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
    .landing {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
        padding: 0 10%;
        overflow-y: hidden;
    }

    .landing h1 {
        color: var(--lavender);
    }

    .landing h1 span {
        color: var(--mauve);
    }

    .background-lambda {
        translate: 0 -20%;
        font-size: 120vh;
        color: var(--base);
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

    .about {
        background-color: var(--mantle);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60vh;
        padding: 5% 10%;
    }

    .left-image {
        width: 25%;
    }
    .left-image img {
        width: 100%;
    }
    
    .right-text {
        width: 75%;
    }

    .skills {
        background-color: var(--crust);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60vh;
        padding: 5% 10%;
    }

    .portfolio {
        background-color: var(--mantle);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60vh;
        padding: 5% 10%;
    }
</style>