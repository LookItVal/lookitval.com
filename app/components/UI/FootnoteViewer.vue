<template>
  <div>
    <p>
      {{ note }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useFootnotes } from '@/composables/footnotes';

const { footnote } = useFootnotes();

const note = ref<string>('');

watch(footnote, (newVal) => {
  note.value = newVal;
});
</script>