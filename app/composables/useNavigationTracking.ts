const { getCurrentProject, getPreviousSection, getFlatSections } = useCaseStudyNavigationTools();

const currentSection = ref<string | null>(null);
const trackNavigation = ref(false);

export default function () {
  const setCurrentSection = (sectionId: string) => {
    sectionId = sectionId.replace(/\n/g, ' ');
    currentSection.value = sectionId;
  };

  const setToPreviousSection = async () => {
    const project = await getCurrentProject();
    if (project && currentSection.value) {
      const previousSection = getPreviousSection(project, currentSection.value);
      if (previousSection) {
        currentSection.value = previousSection.name;
      }
    }
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
    setToPreviousSection,
    enableTracking,
    disableTracking,
    getCurrentUrl
  };
}