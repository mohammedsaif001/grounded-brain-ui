/** Triggers a browser download of text content. Client-only. */
export function downloadTextFile(
    content: string,
    filename: string,
    mimeType = "text/plain",
) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    // Revoking synchronously can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadMarkdown(content: string, filename: string) {
    downloadTextFile(content, filename, "text/markdown");
}
