<template>
    <NuxtLink to="/" class="logo">
        <svg height="100%" width="100%" viewBox="4 0 10 1">
            <mask id="logo-mask" height="100%" width="100%">
                <image href="~assets/QVC.svg" height="100%" width="100%" />
            </mask>
            <rect width="100%" height="100%" fill="var(--lavender)" mask="url(#logo-mask)" />
        </svg>
    </NuxtLink>
</template>

<script>
export default {
    name: 'Logo'
}
</script>

<style scoped>
.logo {
    display: block;
    height: 100%;
}
</style>