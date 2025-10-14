<template>
  <div>
    <h2
      v-if="props.showTitle"
      class="font-semibold text-gray-900 dark:text-gray-100 mb-(--xxs-em)"
      style="font-size: 1.5em"
    >
      Table of Contents
    </h2>
    <div v-for="section in props.sections" :key="section.url">
      <a
        :href="section.url"
        :style="{ paddingLeft: depth + 'em', color: `${COLORS[props.primaryColor]}` }"
        class="block py-1 transition-colors duration-300"
        @mouseenter="handleMouseEnter($event)"
        @mouseleave="handleMouseLeave($event)"
      >
        {{ section.name }}
      </a>
      <TableOfContents
        :sections="section.sections || []"
        :show-title="false"
        :depth="depth + 1"
        :primary-color="props.primaryColor"
        :secondary-color="props.secondaryColor"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';
const { COLORS } = useConstants();

interface Section {
  name: string
  url: string
  sections?: Section[]
}

const props = withDefaults(defineProps<{
  sections: Section[]
  showTitle?: boolean
  depth?: number
  primaryColor: keyof typeof COLORS
  secondaryColor: keyof typeof COLORS
}>(), {
  showTitle: true,
  depth: 0
})

function handleMouseEnter(event: MouseEvent) {
  const target = event.target as HTMLElement;
  target.style.color = COLORS[props.secondaryColor];
}

function handleMouseLeave(event: MouseEvent) {
  const target = event.target as HTMLElement;
  target.style.color = COLORS[props.primaryColor];
}
</script>