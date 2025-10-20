import { Flip } from 'gsap/Flip';
import { gsap } from 'gsap';

const { getCurrentProject, getPreviousSection, getItemsOnThisPage } = useCaseStudyNavigationTools();

const currentSection = ref<string | null>(null);
const oldSection = ref<string | null>(null);
const trackNavigation = ref(false);

export default function () {
  const moveActiveSectionIndicator = async () => {
    await nextTick();
    
    gsap.set(".toc-active-section.current", {
      display: 'none'
    });
    gsap.set(".toc-active-section.old", {
      display: 'block'
    });
    
    await nextTick();
    const state = Flip.getState(".toc-active-section");
    
    gsap.set(".toc-active-section.old", {
      display: 'none'
    });
    gsap.set(".toc-active-section.current", {
      display: 'block'
    });
    
    const timeline = gsap.timeline({ onComplete: clearOldSection });
    timeline.add(Flip.from(state, {
      duration: 0.5,
      ease: "power1.inOut",
    }));
  }

  const clearOldSection = () => {
    oldSection.value = null;
  };

  const setCurrentSection = (sectionId: string) => {
    sectionId = sectionId.replace(/\n/g, ' ');
    const animate = currentSection.value !== null;
    oldSection.value = currentSection.value;
    currentSection.value = sectionId;
    if (animate) {
      moveActiveSectionIndicator();
    }
  };

  const setToPreviousSection = async (sectionId: string) => {
    sectionId = sectionId.replace(/\n/g, ' ');
    const project = await getCurrentProject();
    if (project && currentSection.value) {
      const firstItemOnPage = getItemsOnThisPage(project)[0];
      if (firstItemOnPage && firstItemOnPage.name === currentSection.value) return;
      const previousSection = getPreviousSection(project, sectionId);
      if (previousSection) {
        oldSection.value = currentSection.value;
        currentSection.value = previousSection.name;
        moveActiveSectionIndicator();
      }
    }
  };

  const enableTracking = async () => {
    trackNavigation.value = true;
    const project = await getCurrentProject();
    if (project && currentSection.value === null) {
      const firstItemOnPage = getItemsOnThisPage(project)[0];
      if (firstItemOnPage) {
        currentSection.value = firstItemOnPage.name;
      }
    }
  };
  
  const disableTracking = () => {
    trackNavigation.value = false;
  };

  const getCurrentUrl = () => {
    const url = useRequestURL().href;
    const parts = url.split('/');
    const path = '/' + parts.slice(3).join('/');
    const anchorIndex = path.indexOf('#');
    return anchorIndex !== -1 ? path.substring(0, anchorIndex) : path;
  };

  return {
    currentSection,
    oldSection,
    trackNavigation,
    clearOldSection,
    setCurrentSection,
    setToPreviousSection,
    enableTracking,
    disableTracking,
    getCurrentUrl
  };
}