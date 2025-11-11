import { MenuItem } from "prosemirror-menu";
import { triggerImageFileInputUpload } from "./imageUploadHandler";
import { setupImageUploadMessageListener } from "./imageUploadListener";
import { placeholderPlugin } from "./placeholderPlugin";

export function createImageUploadMenuComponents() {
  const imageUploadMenuItem = new MenuItem({
    title: "이미지 삽입",
    label: "🖼️ 이미지",
    enable: (_state) => true,
    run(_state, _dispatch, view) {
      if (typeof (window as any).openPopupImageUpload === "function") {
        setupImageUploadMessageListener(view);
        (window as any).openPopupImageUpload();
        return;
      }
      triggerImageFileInputUpload(view);
    },
  });

  return { imageUploadMenuItem, placeholderPlugin };
}
