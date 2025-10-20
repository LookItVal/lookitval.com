const { getCurrentProject, getPreviousSection, getItemsOnThisPage } = useCaseStudyNavigationTools();

const currentSection = ref<string | null>(null);
const trackNavigation = ref(false);

export default function () {
  const setCurrentSection = (sectionId: string) => {
    sectionId = sectionId.replace(/\n/g, ' ');
    currentSection.value = sectionId;
  };

  const setToPreviousSection = async (sectionId: string) => {
    sectionId = sectionId.replace(/\n/g, ' ');
    const project = await getCurrentProject();
    if (project && currentSection.value) {
      const firstItemOnPage = getItemsOnThisPage(project)[0];
      if (firstItemOnPage && firstItemOnPage.name === currentSection.value) return;
      const previousSection = getPreviousSection(project, sectionId);
      if (previousSection) {
        currentSection.value = previousSection.name;
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
    trackNavigation,
    setCurrentSection,
    setToPreviousSection,
    enableTracking,
    disableTracking,
    getCurrentUrl
  };
}