import { ScrollSmoother } from 'gsap/ScrollSmoother';

export function useSmoothScroller(wrapperRef: Ref<HTMLElement | null>, contentRef: Ref<HTMLElement | null>, effects: boolean = false) {
  let smoother: ScrollSmoother | null = null

  onMounted(() => {
    if (wrapperRef.value && contentRef.value) {
      smoother = ScrollSmoother.create({
        wrapper: wrapperRef.value,
        content: contentRef.value,
        smooth: 0.5,
        effects: effects,
      })
    }
  })

  onUnmounted(() => {
    if (smoother) {
      smoother.kill()
    }
  })
}