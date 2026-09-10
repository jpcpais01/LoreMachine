// Renders a DOM node (a RelicsPage instance) to a PNG and triggers a
// download. Uses html2canvas's onclone callback so it captures an offscreen
// clone instead of mutating the live element — the visible page never
// reflows/flashes, and any ".no-print" overlay (buttons, etc.) is dropped
// from the exported image without needing to touch the print stylesheet.
export async function exportPagePng(el, filename) {
  if (!el) return;
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    onclone: (clonedDoc, clonedEl) => {
      clonedEl.style.transform = "none";
      clonedDoc.querySelectorAll(".no-print").forEach((node) => {
        node.style.display = "none";
      });
    },
  });
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  link.click();
}
