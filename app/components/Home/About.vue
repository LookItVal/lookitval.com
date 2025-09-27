<template>
  <div class="about-me flex flex-col md:flex-row items-center justify-between px-(--m-em) py-(--s-em) bg-base">
    <HomeHexPhoto 
      class="max-md:!size-svw md:w-1/2" 
      :color1="fgColor"
      :color2="bgColor"
    />
    <UICard 
      v-gsap.whenVisible.once.from="{opacity: 0, y: 50}"
      class="flex flex-col items-center md:w-3/4 p-(--s-em)"
      depth="overlay"
      :opacity="0.5"
    >
      <div class="flex flex-row text-4xl md:text-6xl font-bold pb-(--xxs-em)">
        <h2>About</h2>
        <UIShimmeringText
          class="pl-(--xxs-em)"
          text=" Me"
          as="h2"
          :fg-color="fgColor"
          :bg-color="bgColor"
        />
      </div>
      <p
        class="text-xl md:text-2xl pb-(--xs-em) text-balance text-center"
      >
        I am a former audio engineer with over seven years of experience in the video production industry, pivoting my career into technology. I've built a strong skill set over years of experience spanning data science, database management, system automation, and web development, all fueled by a passion for continuous learning and creative problem-solving. My background in audio engineering gives me a unique perspective on problem-solving and creativity, combined with an acute attention to detail. This, and my mathematically and technically inclined mindset, makes me a valuable asset to every project I work on.
      </p>
      <UIShimmeringButton
        :color1="fgColor"
        :color2="bgColor"
        :click="props.viewResume"
      >
        <p class="text-2xl md:text-3xl py-(--xs-em) px-(--s-em) font-black">
          <UIShimmeringText
            text="My Résumé"
            as="span"
            fg-color="base-100"
            bg-color="surface-100"
          />
        </p>
      </UIShimmeringButton>
    </UICard>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  viewResume: () => void
}>();

const fgColor = 'green-500';
const bgColor = 'teal-100';
</script>