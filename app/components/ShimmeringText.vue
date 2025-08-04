<template>
  <div>
    <component
      class="shimmer absolute !text-transparent z-1"
      :is="as"
      :style="{
        background: `linear-gradient(110deg, transparent, transparent, ${backgroundColor}, transparent, transparent)`
      }"
      v-text="text"
    />
    <component
      class="relative z-0"
      :style="{
        color: foregroundColor
      }"
      :is="as"
      v-text="text"
    >
    </component>
  </div>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';

const { COLORS } = useConstants();
const allowedColors = Object.keys(COLORS) as (keyof typeof COLORS)[];

const props = withDefaults(defineProps<{
  text: string
  as: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  speed?: number
  fgColor: typeof allowedColors[number]
  bgColor: typeof allowedColors[number]
}>(), {
  speed: 3
})

function validateColor(color: string) {
  return allowedColors.includes(color as typeof allowedColors[number])
}

const foregroundColor = computed(() =>
  validateColor(props.fgColor) ? `var(--color-${props.fgColor})` : 'inherit'
)
const backgroundColor = computed(() =>
  validateColor(props.bgColor) ? `var(--color-${props.bgColor})` : 'var(--purple-shimmer)'
)
</script>

<style scoped>
.shimmer {
  will-change: background-position;
  contain: layout, style, paint;
  background-size: 200% 100% !important;
  background-repeat: no-repeat !important;
  background-clip: text !important;
  animation: shimmer v-bind(speed +'s') infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0%;
  }
  100% {
    background-position: -100% 0%;
  }
}

</style>