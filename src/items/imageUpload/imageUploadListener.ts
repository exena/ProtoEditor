import type { EditorView } from "prosemirror-view";
import { insertPlaceholder, replacePlaceholderWithImage } from "../../plugin/placeholderPlugin";

// 외부에서 이미지 업로드하면서 메시지 이벤트를 보내주면 받기 위한 함수
// MenuItem.run에서 참조할 외부 팝업 오픈 함수 예시:
// window.openPopupImageUpload = function () {
//   window.open("/image-upload-popup", "이미지 업로드", "width=600,height=400");
// };
// 팝업 쪽에서 업로드 상태 전송 예시:
// window.opener.postMessage({ status: "uploading", placeholderId: {} }, "*");
// window.opener.postMessage({ status: "done", uploadedUrl: "...", placeholderId: {} }, "*");
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
