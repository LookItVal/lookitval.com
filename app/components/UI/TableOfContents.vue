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
        :style="{ paddingLeft: depth + 'em' }"
        class="block py-1 text-mauve-100 hover:text-lavender-100"
      >
        {{ section.name }}
      </a>
      <TableOfContents
        :sections="section.sections || []"
        :show-title="false"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Section {
  name: string
  url: string
  sections?: Section[]
}

const props = withDefaults(defineProps<{
  sections: Section[]
  showTitle?: boolean
  depth?: number
}>(), {
  showTitle: true,
  depth: 0
})
</script>