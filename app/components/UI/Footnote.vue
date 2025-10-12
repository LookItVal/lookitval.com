<template>
  <span @mouseenter="setFootnote(props.note)" @mouseleave="clearFootnote">
    <sup :class='`text-${props.color} hover:text-${props.hoverColor} pointer`'>
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
  color: 'text-100',
  hoverColor: 'mauve-100'
})
</script>