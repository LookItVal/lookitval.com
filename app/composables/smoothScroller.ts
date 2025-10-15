import { ScrollSmoother } from 'gsap/ScrollSmoother';
import type { gsap } from 'gsap';

const smoothness = ref(0.75);
const currentVelocity = ref(0);

export function useSmoothScroller() {
  let smoother: ScrollSmoother | null = null;
  let velocityTween: gsap.core.Tween | null = null;

  const initSmoothScroller = (wrapperRef: Ref<HTMLElement | null>, contentRef: Ref<HTMLElement | null>, effects: boolean = false) => {
    onMounted(() => {
      if (wrapperRef.value && contentRef.value) {
        smoother = ScrollSmoother.create({
          wrapper: wrapperRef.value,
          content: contentRef.value,
          smooth: smoothness.value,
          effects: effects,
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const scrollTop = self.scrollTop();
            const contentEl = self.content() as HTMLElement;
            const wrapperEl = self.wrapper() as HTMLElement;
            const maxScroll = contentEl.scrollHeight - wrapperEl.clientHeight;
            
            // Check if at top or bottom (with small tolerance)
            const tolerance = 0;
            const atTop = scrollTop <= tolerance;
            const atBottom = scrollTop >= maxScroll - tolerance;
            
            if ((atTop || atBottom) && Math.abs(velocity) > 0.1) {
              // Kill any existing velocity tween
              if (velocityTween) {
                velocityTween.kill();
              }
              currentVelocity.value = 0;
            } else if (!velocityTween) {
              // Normal velocity update when not tweening
              currentVelocity.value = velocity;
            }
          }
        })
      }
    })

    onUnmounted(() => {
      if (velocityTween) {
        velocityTween.kill();
        velocityTween = null;
      }
      if (smoother) {
        smoother.kill();
        smoother = null;
      }
    })
  }

  return {
    smoothness,
    currentVelocity,
    initSmoothScroller
  }
}