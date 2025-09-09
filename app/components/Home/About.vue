<template>
  <div class="about-me flex flex-col md:flex-row items-center justify-between px-(--m-em) py-(--s-em) bg-base">
    <HomeHexPhoto 
      class="max-md:!size-svw md:w-1/2" 
      :color1="fgColor"
      :color2="bgColor"
    />
    <UICard 
      class="flex flex-col items-center md:w-3/4 p-(--s-em)"
      depth="overlay"
      :opacity="0.8"
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
      <TextAnimationsDecryptedText
        class="text-xl md:text-2xl pb-(--xs-em) text-wrap text-center"
        text="I am a former audio engineer with over seven years of experience in the video production industry, pivoting my career into technology. I've built a strong skill set over years of experience spanning data science, database management, system automation, and web development, all fueled by a passion for continuous learning and creative problem-solving. My background in audio engineering gives me a unique perspective on problem-solving and creativity, combined with an acute attention to detail. This, and my mathematically and technically inclined mindset, makes me a valuable asset to every project I work on."
        :speed="0.1"
        :max-iterations="2"
        :sequential="true"
        reveal-direction="start"
        :use-original-chars-only="false"
        :show-pre-text="false"
        characters=" "
        animate-on="view"
      />
      <!-- <p class="text-lg md:text-xl pb-(--xs-em)">
        I am a former audio engineer with over seven years of experience in the video production industry, pivoting my career into technology. I've built a strong skill set over years of experience spanning data science, database management, system automation, and web development, all fueled by a passion for continuous learning and creative problem-solving. My background in audio engineering gives me a unique perspective on problem-solving and creativity, combined with an acute attention to detail. This, and my mathematically and technically inclined mindset, makes me a valuable asset to every project I work on.
      </p> -->
      <UIShimmeringButton
        :color1="fgColor"
        :color2="bgColor"
        @click="viewResume"
      >
        <p class="text-2xl md:text-3xl py-(--xs-em) px-(--s-em) font-black">
          <UIShimmeringText
            text="View Resume"
            as="span"
            fg-color="base-100"
            bg-color="overlay-200"
            :speed="2"
          />
        </p>
      </UIShimmeringButton>
      <PDFViewer ref="resumePDF" pdf-url="https://docs.google.com/document/d/1ZvWFu-CFvC8oW8W4hgGEbTAkc00s-URR3osO16rttos/export?format=pdf" />
    </UICard>
  </div>
</template>

<script lang="ts" setup>
const resumePDF: Ref<PDFViewer | null> = ref(null);
const fgColor = 'green-500';
const bgColor = 'teal-100';

function viewResume() {
    resumePDF.value!.toggleVisibility();
}
</script>