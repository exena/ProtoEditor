import type { EditorView } from "prosemirror-view";
import { insertPlaceholder, replacePlaceholderWithImage } from "./placeholderPlugin";

export function setupImageUploadMessageListener(view: EditorView) {
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;

    const { status, uploadedUrl, placeholderId } = event.data;
    if (!status) return;

    if (status === "uploading") {
      if (!placeholderId) return;
      insertPlaceholder(view, placeholderId);
    }

    if (status === "done") {
      if (!uploadedUrl || !placeholderId) return;
      replacePlaceholderWithImage(view, placeholderId, uploadedUrl);
    }
  });
}
