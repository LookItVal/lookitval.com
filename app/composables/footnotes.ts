const footnotePreview = ref("");
const footnote = ref("");
export const useFootnotes = () => {
  const setFootnote = (text: string) => {
    footnote.value = text;
  };
  const setPreview = (text: string) => {
    footnotePreview.value = text;
  };
  const clearFootnote = () => {
    footnote.value = "";
  };
  const clearPreview = () => {
    footnotePreview.value = "";
  };
  return {
    footnote,
    footnotePreview,
    setFootnote,
    setPreview,
    clearFootnote,
    clearPreview,
  };
};