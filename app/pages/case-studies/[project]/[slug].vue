<template>
  <div>
    <!-- Fixed position items go here -->
    <UIFootnoteViewer class="fixed bottom-(--s-em) left-(--s-em)" />
    <div ref="pageWrapper">
      <div ref="pageContent" class="max-w-6xl mx-auto">
        <ContentRenderer v-if="pageData" :value="pageData" />
        <div v-else>
          <h1>
            Oops, Seems like you got the wrong link. There is no project here.
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { initSmoothScroller } = useSmoothScroller();
const route = useRoute();

const pageWrapper = ref<HTMLElement | null>(null);
const pageContent = ref<HTMLElement | null>(null);
initSmoothScroller(pageWrapper, pageContent, true);

const pageData = await queryCollection('caseStudyPages').path(`/case-studies/${route.params.project}/${route.params.slug}`).first()
</script>