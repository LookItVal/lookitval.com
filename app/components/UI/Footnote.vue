<template>
  <sup :class='`text-${props.color} hover:text-${props.hoverColor} pointer`' @mouseenter="setFootnote(props.note)" @mouseleave="clearFootnote"><slot /></sup>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';
import { useFootnotes } from '@/composables/footnotes';

const { COLORS: _COLORS } = useConstants();
const { setFootnote, clearFootnote } = useFootnotes();

const props = withDefaults(defineProps<{
  note: string
  color?: keyof typeof _COLORS
  hoverColor?: keyof typeof _COLORS
}>(), {
  color: 'text-100',
  hoverColor: 'mauve-100'
})
</script>