<template>
    <div class="socials">
        <SocialsGithub ref="github" />
        <!-- <SocialsIMDB ref="imdb" /> -->
        <!-- <SocialsLinkedIn ref="linkedin" /> -->
        <!-- <SocialsInstagram ref="instagram" /> -->
    </div>
</template>

<script lang="ts" setup>
const github: Ref<SocialsElement | null> = ref(null);
//const imdb: Ref<SocialsElement | null> = ref(null);
//const linkedin: Ref<SocialsElement | null> = ref(null);
//const instagram: Ref<SocialsElement | null> = ref(null);
const socials = [github];

onMounted(() => {
    socials.forEach((element, index) => {
        setTimeout(() => {
            element.value!.$el.classList.add('visible');
            setTimeout(() => {
                element.value!.shimmer();
            }, 400);
        }, index * 150);
    });
});
</script>

<style lang="less" scoped>
.socials {
    display: flex;
    justify-content: space-between;
    height: 100%;

    a {
        margin: 0 .625em 0 .625em;
        height: 100%;
        aspect-ratio: 1;
        transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        svg {
            height: 100%;
        }

        &:not(.visible) {
            opacity: 0;
            transform: translateY(50px);
        }
        &.visible {
            opacity: 1;
            transform: translateY(0px);
        }
    }
}
</style>
