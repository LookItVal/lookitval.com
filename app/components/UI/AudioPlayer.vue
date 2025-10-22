<template>
  <div :style="{ background: color1, color: color2, padding: '1rem', borderRadius: '8px', maxWidth: '400px' }">
    <h3>{{ title }}</h3>
    <audio :src="src" controls :style="{ width: '100%' }"></audio>
  </div>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  color1: { type: String, default: '#f0f0f0' },
  color2: { type: String, default: '#333' }
});
</script>