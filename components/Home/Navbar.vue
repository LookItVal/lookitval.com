<template>
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
</template>

<script>
export default {
    name: 'HomeNavbar'
}
</script>

<style lang="less" scoped>
.navbar {
    z-index: 10
}
</style>