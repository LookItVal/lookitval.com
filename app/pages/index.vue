<template>
  <div class="background-lambda flex justify-between items-center h-[100svh] px-(--l-em) overflow-y-hidden">
    <div class="flex flex-col items-start">
      <h1 class="text-4xl font-bold">Quinn Valencia Cecil</h1>
      <HomeJobTitles  />
      <Socials />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HomeJobTitles } from '#components';

  useHead({
    title: "Look, It's Val!",
    meta: [
      {
        name: 'description',
        content: 'Personal Portfolio and Website of Quinn Valencia Cecil.'
      }
    ]
  });
</script>

