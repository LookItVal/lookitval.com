import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export default function () {
  const moveToAnchorWithAnimation = (anchor: string, offsetY: number = 0) => {
    const splitText = SplitText.create(anchor, {type: "chars"});
    const timeline = gsap.timeline( {onComplete: () => splitText.revert()} );
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