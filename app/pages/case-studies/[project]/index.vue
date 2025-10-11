<template>
  <div>
    <!-- Fixed position items go here -->
    <div ref="pageWrapper">
      <div ref="pageContent">
        <div v-if="!project">Project not found</div>
        <div v-else class="w-full flex flex-col items-center">
          <div class="max-w-4xl flex flex-col items-center">
            <h1 class="text-4xl font-bold mb-(--m-em)">{{ project.meta.title }}</h1>
            <UITableOfContents :sections='(project.meta.sections as Section[])' class="text-sm rounded-4xl p-(--m-em) bg-mantle-100" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { initSmoothScroller } = useSmoothScroller();
interface Section {
  name: string
  url: string
  sections?: Section[]
}
const route = useRoute();

const pageWrapper = ref<HTMLElement | null>(null);
const pageContent = ref<HTMLElement | null>(null);
initSmoothScroller(pageWrapper, pageContent);

const project = await queryCollection('caseStudies').where('id', '=', `caseStudies/case-studies/${route.params.project}/${route.params.project}.yml`).first();
</script>