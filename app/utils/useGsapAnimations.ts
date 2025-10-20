import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export default function () {
  const moveToAnchorWithAnimation = (anchor: string, offsetY: number = 0) => {
    let anchorElement = document.querySelector(anchor);
    const childSpan = anchorElement?.querySelector('span');
    let childP = anchorElement?.querySelector('p');
    if (!anchorElement) return;
    if (childSpan && !childP) {
      const p = document.createElement('p');
      const text = anchorElement.textContent.replace(childSpan.textContent || '', '') || '';
      p.textContent = text;
      anchorElement.insertBefore(p, anchorElement.firstChild);
      // Remove only text nodes, preserve child elements
      console.log(anchorElement.childNodes);
      anchorElement.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          console.log('removing node:', node);
          node.remove();
        }
      });
      console.log(anchorElement.childNodes);
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

    const timeline = gsap.timeline( {onComplete: () => splitText.revert() });
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
  }

  return {
    moveToAnchorWithAnimation
  };
}