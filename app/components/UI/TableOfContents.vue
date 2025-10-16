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
      <a
        :href="section.url"
        :style="{
          borderRadius: calcBorderRadius(section.name),
          paddingLeft: depth + 'em',
          paddingRight: '1em',
          color: `${COLORS[props.fullProject.primary_color]}`,
          backgroundColor: calcBackgroundColor(section.url)
        }"
        class="block py-1 transition-colors duration-300"
        @mouseenter="handleMouseEnter($event)"
        @mouseleave="handleMouseLeave($event)"
      >
        {{ section.name }}
      </a>
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

const calcBackgroundColor = (url: string) => {
  return isOnThisPage(url) ? COLORS['mantle-100'] : 'transparent';
};

const calcBorderRadius = (name: string) => {
  const itemsOnPage = getItemsOnThisPage(props.fullProject);
  const names = itemsOnPage.map(item => item.name);
  const isFirst = names[0] === name;
  const isLast = names[names.length - 1] === name;
  return `${isFirst ? '1em' : '0'} ${isFirst ? '1em' : '0'} ${isLast ? '1em' : '0'} ${isLast ? '1em' : '0'}`;
};
</script>