<template>
  <ContentRenderer v-if="page" :value="page" style="width: 100%;" />
  <div v-else>Literally how </div>
</template>

<script lang="ts" setup>
const { data: page } = await useAsyncData('home', () => {
    return queryCollection('home').first();
});
</script>

<style lang="less" scoped>
:deep(.section) {
  &.landing .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
    padding: 0 7em;
    overflow-y: hidden;

    .socials-bar {
      height: 2rem;
    }
  }
}
</style>