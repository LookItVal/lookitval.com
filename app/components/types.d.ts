declare global {
    interface PDFViewer extends HTMLElement {
        toggleVisibility(): void;
    }
}

export {};