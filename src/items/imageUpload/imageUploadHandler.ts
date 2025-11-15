import type { EditorView } from "prosemirror-view";
import { insertPlaceholder, replacePlaceholderWithImage, removePlaceholder } from "../../plugin/placeholderPlugin";
import { uploadImageFile } from "./uploadImageFile";

export function handleImageUpload(event: Event, view: EditorView) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // 1️⃣ placeholder 추가
  const id = {};
  insertPlaceholder(view, id);

  // 2️⃣ 파일 업로드 시작 (비동기)
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
  // 버튼 클릭시 화면에 나타나지 않는 input의 클릭 트리거를 작동시킴
  // 브라우저 보안 정책상 사용자 클릭 이벤트의 콜백(현재 함수) 내에서만 호출 가능
  input.click();
}
