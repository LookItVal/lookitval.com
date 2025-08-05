<template>
  <div id="bird-recognition-page" class="h-svh flex flex-col items-center justify-center">
    <BackgroundsBirds
      class="absolute top-0 left-0 w-full h-full -z-10 opacity-75"
      color1="mauve-500"
      color2="lavender-500"
      background-color="crust-100"
      :background-alpha="0.0"
      :quantity="3"
    />
    <h1 class="text-4xl font-bold text-center mb-8">Bird Recognition</h1>
    <BirdClassificationRecordButton />
  </div>
</template>


<script lang="ts" setup>
</script>