import type { EditorView } from "prosemirror-view";
import { insertPlaceholder, replacePlaceholderWithImage, removePlaceholder } from "./placeholderPlugin";
import { uploadImageFile } from "./uploadImageFile";

export function handleImageUpload(event: Event, view: EditorView) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const id = {};
  insertPlaceholder(view, id);

  uploadImageFile(file).then(
    (uploadedUrl) => replacePlaceholderWithImage(view, id, uploadedUrl),
    () => removePlaceholder(view, id)
  );
}

export function triggerImageFileInputUpload(view: EditorView) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";

  input.addEventListener("change", (event) => handleImageUpload(event, view));
  input.click();
}
