import { MenuItem } from "prosemirror-menu";
import { triggerImageFileInputUpload } from "./imageUploadHandler";
import { setupImageUploadMessageListener } from "./imageUploadListener";
import { placeholderPlugin } from "../../plugin/placeholderPlugin";

export function createImageUploadMenuComponents() {
  const imageUploadMenuItem = new MenuItem({
    title: "이미지 삽입",
    // label: "🖼️ 이미지",
    enable: (_state) => true,
    run(_state, _dispatch, view) {
      if (typeof (window as any).openPopupImageUpload === "function") {
        setupImageUploadMessageListener(view);
        (window as any).openPopupImageUpload();
        return;
      }
      triggerImageFileInputUpload(view);
    },
    render: (_view) => {
      const dom = document.createElement("div");
      dom.className = "ProseMirror-icon";
      dom.title = "Insert Image";
      // SVG 삽입
      dom.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"/></svg>
      `;
      return dom;
    },
  });

  return { imageUploadMenuItem, placeholderPlugin };
}
