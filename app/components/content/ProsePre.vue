<template>
  <pre
    :class="[
      'relative overflow-x-auto text-sm md:text-base p-(--m-em) rounded-(--l-em)',
      language == 'output' ? '-mt-(--xl-em) mb-(--s-em) pt-(--l-em)' : 'my-(--s-em)'
    ]"
    :style="language == 'output' ? 'border-top-left-radius: 0; border-top-right-radius: 0;' : ''"
  ><div
    v-gsap.whenVisible.from="{opacity: 0}"
    class="absolute top-0 bottom-0 left-0 right-0 bg-mantle-100 -z-100"
  /><p v-gsap.whenVisible.from="{opacity: 0, x: -50}" class="text-xs md:text-sm text-overlay-100 italic pb-(--xs-em)">{{ language }}</p><div v-gsap.whenVisible.from="{opacity: 0, y: 50}"><slot /></div></pre>
</template>

<script lang="ts" setup>
defineProps<{
  language?: string
}>()
</script>