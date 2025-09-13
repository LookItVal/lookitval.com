<template>
  <div>
    <UICard 
      v-if="!opened"
      class="p-(--m-em) max-w-(--xxl-em) mx-auto text-center"
      depth="item"
    >
      <Icon name="material-symbols:question-mark-rounded" />
    </UICard>
  </div>
</template>

<script lang="ts" setup>
const opened = ref(false);
</script>

