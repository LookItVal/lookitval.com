<template>
    <div class="socials">
        <SocialsGithub />
        <SocialsIMDB />
        <SocialsLinkedIn />
        <SocialsInstagram />
    </div>
</template>

<script lang="ts" setup>
console.log("Socials component loaded");
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
        svg {
            height: 100%;
        }
    }
}
</style>        