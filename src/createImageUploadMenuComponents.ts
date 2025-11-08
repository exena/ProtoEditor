import { MenuItem } from "prosemirror-menu";
import { placeholderPlugin, insertPlaceholder, replacePlaceholderWithImage, removePlaceholders } from "./placeholderPlugin";
import type { EditorView } from "prosemirror-view";

/**
 * 파일을 업로드하고 URL을 반환하는 함수
 */
async function uploadImageFile(file: File): Promise<string> {
  // 예시: 실제 구현에서는 fetch()로 서버 업로드
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file); // 임시 blob URL
      resolve(mockUrl);
    }, 1500);
  });
}

function triggerImageFileInput(view: EditorView) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";

  input.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // 1️⃣ placeholder 추가
    const id = {}; // id 역할을 하는 객체
    insertPlaceholder(view, id);

    // 2️⃣ 파일 업로드 시작 (비동기)
    uploadImageFile(file).then((uploadedUrl) => {
      replacePlaceholderWithImage(view, id, uploadedUrl);
    }, () => {
      // 실패시 placeholder 지우기
      removePlaceholders(view, id);
    });
  });

  // 버튼 클릭시 화면에 나타나지 않는 input의 클릭 트리거를 작동시킴
  // 브라우저 보안 정책상 사용자 클릭 이벤트의 콜백(현재 함수) 내에서만 호출 가능
  input.click();
}

export function createImageUploadMenuComponents() {
  const imageUploadMenuItem = new MenuItem({
    title: "이미지 삽입",
    label: "🖼️ 이미지",
    enable: (state) => true, // 항상 활성화

    // ✅ run이 있어야 MenuItemSpec 타입이 맞음
    run(state, dispatch, view) {
      triggerImageFileInput(view);
    },
  });

  return { imageUploadMenuItem, placeholderPlugin };
}
