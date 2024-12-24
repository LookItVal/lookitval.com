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
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>