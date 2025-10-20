<template>
  <div :key="`${route.params.project}-${route.params.slug}`">
    <!-- Fixed position items go here -->
    <div class="fixed w-screen h-screen grid grid-cols-[auto_1fr] z-9 pointer-events-none">
      <div class="gradient-blur-overlay-top" :style="{height: headingHeight}"></div>
      <div
        class="gradient-blur-overlay-bottom"
        :style="{ height: (parseFloat(navigationButtonsHeight) / 2) + 'px' }"
      ></div>
      <div ref="sidebar" class="h-full p-(--s-em) flex items-center justify-center"> 
        <AnimationsScrollLag :reverse="true">
          <UITableOfContents
            v-if="project"
            :full-project="project"
            :sections="project.sections"
            class="text-sm rounded-4xl p-(--m-em) bg-base-100 pointer-events-auto"
            :primary-color="project.primary_color"
            :secondary-color="project.secondary_color"
          />
        </AnimationsScrollLag>
      </div>
      <div class="relative flex flex-col-reverse">
        <div ref="heading" id="heading" class="absolute top-0 w-full flex justify-center items-center">
          <UIMenuBar
            ref="menuBar"
            :animate-on-mount="true"
            class="z-9 my-(--s-em) pointer-events-auto"
            :pin="false"
            featured-action="/bird-recognition"
            scroll-lag="reverse"
          />
        </div>
        <AnimationsScrollLag :reverse="true">
          <div ref="navigationButtons" class="w-full flex flex-row justify-between p-(--s-em)">
            <UINavigationButton direction="back" :to="previousPage?.url || ''" :label="previousPage?.name" />
            <UINavigationButton direction="forward" :to="nextPage?.url || ''" :label="nextPage?.name" />
          </div>
        </AnimationsScrollLag>
        <AnimationsScrollLag :reverse="true">
          <div class="z-9 pb-(--s-em) px-(--s-em) w-full flex justify-center">
            <UIFootnoteViewer class="pointer-events-auto" />
          </div>
        </AnimationsScrollLag>
      </div>
    </div>
    <div
      ref="pageWrapper"
      :style="{
        paddingLeft: sidebarWidth,
        paddingTop: headingHeight
      }"
    >
      <div ref="pageContent" class="max-w-6xl mx-auto z-1" :style="{paddingBottom: navigationButtonsHeight}">
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
const { moveToAnchorWithAnimation } = useGsapAnimations();
const { getNextPage, getPreviousPage } = useCaseStudyNavigationTools();
const { getCurrentUrl, enableTracking, disableTracking, setCurrentSection } = useNavigationTracking();
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
initSmoothScroller(pageWrapper, pageContent);

interface NavigationPage {
  name: string;
  url: string;
}

const nextPage = ref<NavigationPage | null>(null);
const previousPage = ref<NavigationPage | null>(null);

const sidebar = ref<HTMLElement | null>(null);
const heading = ref<HTMLElement | null>(null);
const navigationButtons = ref<HTMLElement | null>(null);

// Reactive dimension tracking
const sidebarWidth = ref('0px');
const headingHeight = ref('0px');
const navigationButtonsHeight = ref('100px');

// Force re-measurement when DOM updates
const updateDimensions = () => {
  nextTick(() => {
    if (sidebar.value) {
      sidebarWidth.value = sidebar.value.getBoundingClientRect().width + 'px';
    }
    if (heading.value) {
      headingHeight.value = (heading.value.getBoundingClientRect().height) + 'px';
    }
    if (navigationButtons.value) {
      navigationButtonsHeight.value = (navigationButtons.value.getBoundingClientRect().height * 2) + 'px';
    }
  });
};

// Create a resize observer to track dimension changes
const resizeObserver = ref<ResizeObserver | null>(null);

const pageData = await queryCollection('caseStudyPages').path(`/case-studies/${route.params.project}/${route.params.slug}`).first()
const project = (await queryCollection('caseStudies').where('id', '=', `caseStudies/case-studies/${route.params.project}/${route.params.project}.yml`).first())?.meta.body as Project | null;

const primaryColor = computed(() => COLORS[project?.primary_color || 'lavender-100']);
const secondaryColor = computed(() => COLORS[project?.secondary_color || 'mauve-100']);

onMounted(() => {
  enableTracking();
  
  if (project) {
    nextPage.value = getNextPage(project, getCurrentUrl()) || null;
    previousPage.value = getPreviousPage(project, getCurrentUrl()) || null;
  }

  // Setup resize observer for dimension tracking
  resizeObserver.value = new ResizeObserver(updateDimensions);
  if (sidebar.value) resizeObserver.value.observe(sidebar.value);
  if (heading.value) resizeObserver.value.observe(heading.value);
  if (navigationButtons.value) resizeObserver.value.observe(navigationButtons.value);

  // Initial dimension measurement with proper timing
  setTimeout(updateDimensions, 0);
  setTimeout(updateDimensions, 100); // Fallback for slower renders

  if (route.hash) {
    setCurrentSection(route.hash.split('#')[1] || '');
    setTimeout(() => {
      moveToAnchorWithAnimation(route.hash, parseInt(headingHeight.value.split('px')[0]!) || 0);
    }, 600); // Increased delay to ensure dimensions are ready
  }
});

onUnmounted(() => {
  disableTracking();
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

// Watch for route changes and re-initialize
watch(() => route.params, () => {
  nextTick(() => {
    updateDimensions();
    if (project) {
      nextPage.value = getNextPage(project, getCurrentUrl()) || null;
      previousPage.value = getPreviousPage(project, getCurrentUrl()) || null;
    }
  });
}, { deep: true });
</script>

<style scoped>
.gradient-blur-overlay-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.gradient-blur-overlay-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  mask-image: linear-gradient(to bottom,
    black 0%,
    black 5%,
    rgba(0, 0, 0, 0.75) 50%,
    rgba(0, 0, 0, 0.5) 75%,
    transparent 100%
  );
}

.gradient-blur-overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.gradient-blur-overlay-bottom::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  mask-image: linear-gradient(to top,
    black 0%,
    black 5%,
    rgba(0, 0, 0, 0.75) 12.5%,
    rgba(0, 0, 0, 0.5) 33%,
    transparent 50%,
    transparent 100%
  );
}

:deep(a) {
  color: v-bind(primaryColor);
}

:deep(a:hover) {
  color: v-bind(secondaryColor);
}
</style>