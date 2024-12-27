<template>
  <div class="home">
    <HomeNavbar />
    <div class="landing">
        <span class="background-lambda">λ</span>
        <div class="left-text">
            <h1><span>Quinn</span> <span>Valencia</span> <span>Cecil</span></h1>
            <HomeSubtext />
            <div class="socials-bar">
                <Socials />
            </div>
        </div>
        <div class="right-image">
            <img src="~assets/BoomOp.png" alt="Quinn Valencia Cecil" />
        </div>
    </div>
    <div class="about">
        <div class="left-image">
            <HomeHexPhoto hex-color="var(--green)" />
        </div>
        <div class="right-text">
            <div class="about-header"><h2>About</h2><GradientText text="Me" header-tag="h2" color="green" class="header-highlight"/></div>
            <p>Hi! I'm Quinn, a full stack developer with a background in audio engineering. I love creating things, whether it's a new song or a new app. I'm passionate about accessibility and making the web a better place for everyone. I'm currently looking for new opportunities to grow and learn.</p>
            <GradientButton :click="viewResume" color="green" class="resume-button">
                <h4 style="font-weight: 900;color:var(--crust)">View Resume</h4>
            </GradientButton>
            <PDFViewer ref="resumePDF" pdfUrl="https://docs.google.com/document/d/1LaukwAxBx__iYZ_xRLRSmrjDKb8UyPx0fAWnWfSYWFw/export?format=pdf" />
        </div>
    </div>
    <div class="skills">
        <h2>Skills</h2>
    </div>
    <div class="portfolio">
        <h2>Portfolio</h2>
        <GradientText text="Testalsjhdf" header-tag="h1" color="purple" />
    </div>
  </div>
</template>

<script>
export default {
    name: "Home",
    methods: {
        viewResume() {
        console.log("Viewing resume");
        this.$refs.resumePDF.toggleVisibility();
        }
    }
}
</script>

<style lang="less" scoped>
.landing {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
    padding: 0 10%;
    overflow-y: hidden;

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
        align-items: flex-start;
        width: 100vw;

        h1 {
            color: var(--lavender);
            span {
                color: transparent;
                background: linear-gradient(-45deg,var(--lavender),var(--mauve));
                background-clip: text;
                -webkit-background-clip: text;
            }
        }

        .socials-bar {
            margin-top: 10px;
            height: 32px;
        }
    }

    .right-image {
        width: 25%;
        img {
            height: 100%;
            padding-left: 20%;
            padding-bottom: 50%;
            object-fit: cover;
            object-position: bottom;
        }
    }
}

.about {
    background-color: var(--mantle);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60vh;
    padding: 0 2.5%;

    .left-image {
        width: 50%;
        height: 100%;
    }

    .right-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 75%;

        .about-header {
            display: flex;
            justify-content: center;
            align-items: center;

            ::v-deep .header-highlight h2 {
                margin-left: 0.25em;
                font-weight: 800;
            }
        }

        .resume-button {
            width: 10em;
        }
    }
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