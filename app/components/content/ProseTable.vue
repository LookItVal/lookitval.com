<template>
  <Scrollable class="w-full rounded-4xl text-base md:text-lg">
    <table>
      <slot />
    </table>
  </Scrollable>
</template>

<script lang="ts" setup>
import Scrollable from '../UI/Scrollable.vue';

</script>