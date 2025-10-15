<template>
  <div>
    <!-- Fixed position items go here -->
    <div class="fixed w-screen h-screen grid grid-cols-[auto_1fr] z-9 pointer-events-none">
      <div ref="sidebar" class="h-full p-(--s-em) flex items-center justify-center">
        <AnimationsScrollLag :reverse="true">
          <UITableOfContents
            v-if="project"
            :sections="project.sections"
            class="text-sm rounded-4xl p-(--m-em) bg-base-100 pointer-events-auto"
            :primary-color="project.primary_color"
            :secondary-color="project.secondary_color"
          />
        </AnimationsScrollLag>
      </div>
      <div class="relative flex flex-col-reverse">
        <div ref="heading" class="absolute top-0 w-full flex justify-center items-center">
          <UIMenuBar
            ref="menuBar"
            :animate-on-mount="true"
            class="z-9 py-(--s-em) pointer-events-auto"
            :pin="false"
            featured-action="/bird-recognition"
            scroll-lag="reverse"
          />
        </div>
        <div>
          bottom content
        </div>
        <div class="z-9 pb-(--s-em) px-(--s-em) w-full flex justify-center">
          <UIFootnoteViewer class="pointer-events-auto" />
        </div>
      </div>
    </div>
    <div ref="pageWrapper" :style="{paddingLeft: sidebarWidth, paddingTop: headingHeight}">
      <div ref="pageContent" class="max-w-6xl mx-auto z-1">
        <h1 class="text-4xl md:text-6xl">{{ project?.title || 'Project Title' }}</h1>
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

const sidebar = ref<HTMLElement | null>(null);
const sidebarWidth = computed(() => {
  if (!sidebar.value) return '0px';
  return sidebar.value.getBoundingClientRect().width + 'px';
});
const heading = ref<HTMLElement | null>(null);
const headingHeight = computed(() => {
  if (!heading.value) return '0px';
  return (heading.value.getBoundingClientRect().height * 2) + 'px';
});

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