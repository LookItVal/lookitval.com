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
</style>``