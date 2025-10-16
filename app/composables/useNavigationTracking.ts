const currentSection = ref<string | null>(null);
const trackNavigation = ref(false);

export default function () {
  const setCurrentSection = (sectionId: string | null) => {
    currentSection.value = sectionId;
  };

  const enableTracking = () => {
    trackNavigation.value = true;
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
    trackNavigation,
    setCurrentSection,
    enableTracking,
    disableTracking,
    getCurrentUrl
  };
}