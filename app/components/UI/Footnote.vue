<template>
  <span
    :class='`text-${props.color} hover:text-mauve-500 pointer`'
    @mouseenter="setFootnote(props.note)" @mouseleave="clearFootnote"
  >
    <sup>
      {{ props.icon }}
    </sup>
  </span>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';
import { useFootnotes } from '@/composables/footnotes';

const { COLORS: _COLORS } = useConstants();
const { setFootnote, clearFootnote } = useFootnotes();

const props = withDefaults(defineProps<{
  note: string,
  icon: string,
  color?: keyof typeof _COLORS
  hoverColor?: keyof typeof _COLORS
}>(), {
  color: 'subtext-100',
  hoverColor: 'mauve-500'
})
</script>