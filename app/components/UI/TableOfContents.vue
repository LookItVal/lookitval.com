<template>
  <div>
    <h2
      v-if="props.showTitle"
      class="font-semibold text-gray-900 dark:text-gray-100 mb-(--xxs-em)"
      style="font-size: 1.5em"
    >
      Table of Contents
    </h2>
    <div
      v-for="(section, index) in props.sections"
      :key="section.url"
      >
      <NuxtLink
        v-if="!isOnThisPage(section.url)"
        :external="true"
        :to="section.url"
        :style="{
          borderRadius: calcBorderRadius(section.name),
          paddingLeft: depth + 'em',
          paddingRight: '1em',
          color: `${COLORS[props.fullProject.primary_color]}`,
          backgroundColor: calcBackgroundColor(section.url)
        }"
        class="block py-1 transition-colors duration-300 text-decoration-none !no-underline"
        @mouseenter="handleMouseEnter($event)"
        @mouseleave="handleMouseLeave($event)"
      >
        {{ section.name }}
      </NuxtLink>
      <button
        v-else
        :to="section.url"
        @click="handleClick($event)"
        :style="{
          borderRadius: calcBorderRadius(section.name),
          paddingLeft: depth + 'em',
          paddingRight: '1em',
          color: `${COLORS[props.fullProject.primary_color]}`,
          backgroundColor: calcBackgroundColor(section.url)
        }"
        class="block py-1 transition-colors duration-300 w-full text-left"
        @mouseenter="handleMouseEnter($event)"
        @mouseleave="handleMouseLeave($event)"

      >
        {{ section.name }}
      </button>
      <TableOfContents
        :full-project="props.fullProject"
        :sections="section.sections || []"
        :show-title="false"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { COLORS } = useConstants();
const { trackNavigation, currentSection } = useNavigationTracking();
const { getItemsOnThisPage, removeAnchorHash } = useCaseStudyNavigationTools();
const { moveToAnchorWithAnimation } = useGsapAnimations();

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

const props = withDefaults(defineProps<{
  fullProject: Project
  sections: Section[]
  showTitle?: boolean
  depth?: number
}>(), {
  showTitle: true,
  depth: 1
})

function handleMouseEnter(event: MouseEvent) {
  const target = event.target as HTMLElement;
  target.style.color = COLORS[props.fullProject.secondary_color];
}

function handleMouseLeave(event: MouseEvent) {
  const target = event.target as HTMLElement;
  target.style.color = COLORS[props.fullProject.primary_color];
}

function isOnThisPage(url: string): boolean {
  const itemsOnPage = getItemsOnThisPage(props.fullProject);
  const urls = itemsOnPage.map(item => item.url);
  return urls.includes(removeAnchorHash(url));
}

function calcBackgroundColor(url: string): string {
  return isOnThisPage(url) ? COLORS['mantle-100'] : 'transparent';
}

function calcBorderRadius(name: string): string {
  const itemsOnPage = getItemsOnThisPage(props.fullProject);
  const names = itemsOnPage.map(item => item.name);
  const isFirst = names[0] === name;
  const isLast = names[names.length - 1] === name;
  return `${isFirst ? '1em' : '0'} ${isFirst ? '1em' : '0'} ${isLast ? '1em' : '0'} ${isLast ? '1em' : '0'}`;
}

function handleClick(event: Event) {
  const currentUrl = (event.currentTarget as HTMLElement).getAttribute('to');
  const anchorHash = currentUrl && currentUrl.includes('#') ? currentUrl.split('#')[1] : null;
  const heading = document.getElementById('heading');
  const offsetY = heading ? heading.getBoundingClientRect().height : 0;
  if (anchorHash) {
    moveToAnchorWithAnimation(`#${anchorHash}`, offsetY);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
</script>