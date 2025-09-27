import { ScrollSmoother } from 'gsap/ScrollSmoother';

const smoothness = ref(0.75);
const currentVelocity = ref(0);

export function useSmoothScroller() {
  let smoother: ScrollSmoother | null = null

  const initSmoothScroller = (wrapperRef: Ref<HTMLElement | null>, contentRef: Ref<HTMLElement | null>, effects: boolean = false) => {
    onMounted(() => {
      if (wrapperRef.value && contentRef.value) {
        smoother = ScrollSmoother.create({
          wrapper: wrapperRef.value,
          content: contentRef.value,
          smooth: smoothness.value,
          effects: effects,
          onUpdate: (self) => {
            currentVelocity.value = self.getVelocity();
          }
        })
      }
    })

    onUnmounted(() => {
      if (smoother) {
        smoother.kill()
      }
    })
  }

  return {
    smoothness,
    currentVelocity,
    initSmoothScroller
  }
}