import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

const ctx = ref<gsap.Context | null>(null);

export default function () {
  // Initialize context if it doesn't exist
  const initContext = () => {
    if (!ctx.value) {
      ctx.value = gsap.context(() => {});
    }
    return ctx.value;
  };

  // Clear context (useful for page transitions)
  const clearContext = () => {
    if (ctx.value) {
      ctx.value.revert();
      ctx.value = null;
    }
  };

  const moveToAnchorWithAnimation = (anchor: string, offsetY: number = 0) => {
    const context = initContext();
    
    // Add animations to the context
    return context.add(() => {
      let anchorElement = document.querySelector(anchor);
      const childSpan = anchorElement?.querySelector('span');
      let childP = anchorElement?.querySelector('p');
      if (!anchorElement) return;
      
      if (childSpan && !childP) {
        const p = document.createElement('p');
        const text = anchorElement.textContent.replace(childSpan.textContent || '', '') || '';
        p.textContent = text;
        anchorElement.insertBefore(p, anchorElement.firstChild);
        anchorElement.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.remove();
          }
        });
      }
      
      anchorElement = document.querySelector(anchor);
      childP = anchorElement?.querySelector('p');
      if (childP) {
        anchorElement = childP;
      }

      const splitText = SplitText.create(anchorElement, {
        type: "words,chars",
        ignore: ".no-split",
        reduceWhiteSpace: false,
      });

      const timeline = gsap.timeline({ onComplete: () => splitText.revert() });
      timeline.to(window, {
        scrollTo: {
          y: anchor,
          offsetY: offsetY
        },
        duration: 1,
        ease: 'power2.out'
      });
      timeline.add(gsap.to(splitText.chars, {
        scale: 1.5,
        duration: 0.3,
        stagger: 0.05
      }));
      timeline.add(gsap.to(splitText.chars, {
        scale: 1,
        duration: 0.3,
        stagger: 0.05
      }), '<+0.1');
      
      return timeline;
    });
  }

  const router = useRouter();
  router.afterEach(() => {
      setTimeout(() => {
        clearContext();
      }, 350); // Adjust this delay based on your transition duration
  });

  return {
    moveToAnchorWithAnimation,
    ctx,
    clearContext,
    initContext
  };
}