<template>
  <div class="flex flex-col items-center justify-center w-full max-w-5xl p-(--m-em)">
    <div class="relative mb-(--s-em) w-full h-[5em]">
      <div class="absolute top-0 left-0 w-full h-full bg-surface-300 rounded-4xl opacity-50" />
      <canvas
        ref="canvasRef"
        class="absolute top-0 left-0 w-full h-full rounded-full"
        :width="canvasWidth"
        :height="canvasHeight"
      />
    </div>
    <BirdClassificationRecordButton />
  </div>
</template>

<script lang="ts" setup>
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(0);
const canvasHeight = ref(0);

onMounted(async () => {
  await setupCanvas()
})

const setupCanvas = async () => {
  await nextTick()
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    canvasWidth.value = rect.width
    canvasHeight.value = rect.height
  }
}

</script>