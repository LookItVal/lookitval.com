const { COLORS: _COLORS } = useConstants();

interface Section {
  name: string
  url: string
  sections?: Section[]
}
interface Project {
  title: string
  slug: string
  description?: string
  primary_color: keyof typeof _COLORS
  primary_color_highlight: keyof typeof _COLORS
  secondary_color: keyof typeof _COLORS
  secondary_color_highlight: keyof typeof _COLORS
  sections: Section[]
}

export default function () {
  const getCurrentProject = async () => {
    const route = useRoute();
    const projectName = route.params.project as string;
    return getProject(projectName);
  }

  const getProject = async (projectName: string) => {
    return (await queryCollection('caseStudies').where('id', '=', `caseStudies/case-studies/${projectName}/${projectName}.yml`).first())?.meta.body as Project | null;
  }

  const getFlatSections = (project: Project) => {
    const flatSections: Array<{ name: string; url: string }> = [];
    
    const flatten = (sections: Section[]) => {
      sections.forEach(section => {
        flatSections.push({ name: section.name, url: section.url });
        if (section.sections) {
          flatten(section.sections);
        }
      });
    };
    
    flatten(project.sections);
    return flatSections;
  }

  const getFlatSectionsWithoutAnchors = (project: Project) => {
    const flatSections = getFlatSections(project);
    const flatSectionsWithoutAnchors: Array<{ name: string; url: string }> = [];
    for (const section of flatSections) {
      const urlWithoutAnchor = section.url.split('#')[0] || section.url;
      if (!flatSectionsWithoutAnchors.find(s => s.url === urlWithoutAnchor)) {
        flatSectionsWithoutAnchors.push({ name: section.name, url: urlWithoutAnchor });
      }
    }
    return flatSectionsWithoutAnchors;
  }

  const getNextPage = (project: Project, currentUrl: string) => {
    const flatSections = getFlatSectionsWithoutAnchors(project);
    const currentIndex = flatSections.findIndex(section => section.url === currentUrl);
    if (currentIndex !== -1 && currentIndex < flatSections.length - 1) {
      return flatSections[currentIndex + 1];
    }
    return undefined;
  }

  const getPreviousPage = (project: Project, currentUrl: string) => {
    const flatSections = getFlatSectionsWithoutAnchors(project);
    const currentIndex = flatSections.findIndex(section => section.url === currentUrl);
    if (currentIndex > 0) {
      return flatSections[currentIndex - 1];
    }
    return undefined;
  }

  const getNextSection = (project: Project, sectionName: string) => {
    const flatSections = getFlatSections(project);
    const currentIndex = flatSections.findIndex(section => section.name === sectionName);
    if (currentIndex !== -1 && currentIndex < flatSections.length - 1) {
      return flatSections[currentIndex + 1];
    }
    return undefined;
  }

  const getPreviousSection = (project: Project, sectionName: string) => {
    const flatSections = getFlatSections(project);
    const currentIndex = flatSections.findIndex(section => section.name === sectionName);
    if (currentIndex > 0) {
      return flatSections[currentIndex - 1];
    }
    return undefined;
  }

  const removeAnchorHash = (url: string): string => {
    return url.split('#')[0] || url;
  }

  const getItemsOnThisPage = (project: Project) => {
    const currentUrl = useRoute().fullPath.split('#')[0] || '';
    const flatSections = getFlatSections(project);
    return flatSections.filter(section => removeAnchorHash(section.url) === currentUrl);
  }
  
  return {
    getItemsOnThisPage,
    getNextPage,
    getPreviousPage,
    getNextSection,
    getPreviousSection,
    getProject,
    getCurrentProject,
    getFlatSections,
    getFlatSectionsWithoutAnchors,
    removeAnchorHash
  };
}