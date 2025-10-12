const footnote = ref("");
export const useFootnotes = () => {
  const setFootnote = (text: string) => {
    footnote.value = text;
  };
  const clearFootnote = () => {
    footnote.value = "";
  };
  return {
    footnote,
    setFootnote,
    clearFootnote,
  };
};