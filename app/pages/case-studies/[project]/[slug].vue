<template>
  <div>
    <!-- Fixed position items go here -->
    <div class="fixed z-9 bottom-(--s-em) px-(--s-em) w-screen flex justify-center">
      <UIFootnoteViewer />
    </div>
    <div ref="pageWrapper">
      <div ref="pageContent" class="max-w-6xl mx-auto z-1">
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
const { COLORS } = useConstants();

interface Section {
  name: string
  url: string
  sections?: Section[]
}
interface Project {
  title: string
  slug: string
  description?: string
  primary_color: keyof typeof COLORS
  primary_color_highlight: keyof typeof COLORS
  secondary_color: keyof typeof COLORS
  secondary_color_highlight: keyof typeof COLORS
  sections: Section[]
}

const pageWrapper = ref<HTMLElement | null>(null);
const pageContent = ref<HTMLElement | null>(null);
initSmoothScroller(pageWrapper, pageContent, true);

const pageData = await queryCollection('caseStudyPages').path(`/case-studies/${route.params.project}/${route.params.slug}`).first()
const project = (await queryCollection('caseStudies').where('id', '=', `caseStudies/case-studies/${route.params.project}/${route.params.project}.yml`).first())?.meta.body as Project | null;

const primaryColor = computed(() => COLORS[project?.primary_color || 'lavender-100']);
const secondaryColor = computed(() => COLORS[project?.secondary_color || 'mauve-100']);
</script>

<style scoped>
:deep(a) {
  color: v-bind(primaryColor);
}

:deep(a:hover) {
  color: v-bind(secondaryColor);
}
</style>