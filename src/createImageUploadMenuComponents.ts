import { MenuItem } from "prosemirror-menu";
import { placeholderPlugin, insertPlaceholder, replacePlaceholderWithImage, removePlaceholder } from "./placeholderPlugin";
import type { EditorView } from "prosemirror-view";

/**
 * 파일을 업로드하고 URL을 반환하는 함수
 */
async function uploadImageFile(file: File): Promise<string> {
  // 외부에서 업로드용 URL이 지정되어 있으면 fetch 사용
  const uploadUrl = (window as any).uploadImageUrl;
  const uploadHeader = (window as any).uploadImageHeader;
  const uploadRequestParam = (window as any).uploadImageRequestParam;

  if (typeof uploadRequestParam === "string" && typeof uploadUrl === "string" && uploadUrl.length > 0) {
    const formData = new FormData();
    formData.append(uploadRequestParam, file);
    
    const response = await fetch(uploadUrl, {
      headers: uploadHeader,
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`이미지 업로드 실패 (status ${response.status})`);
    }

    // 서버가 문자열로 URL을 반환하는 경우
    const result = await response.text();

    // 단순 문자열이면 그대로 리턴
    if (typeof result === "string" && result.trim().length > 0) {
      return result;
    } else {
      throw new Error("응답에 이미지 URL이 없습니다.");
    }
  }

  // 기본 mock 동작 (fetch 미사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file); // 임시 blob URL
      resolve(mockUrl);
    }, 1500);
  });
}

function handleImageUpload(event: Event, view: EditorView) {
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
    removePlaceholder(view, id);
  });
}

function triggerImageFileInputUpload(view: EditorView) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";

  input.addEventListener("change", async (event) => {
    handleImageUpload(event, view)
  });

  // 버튼 클릭시 화면에 나타나지 않는 input의 클릭 트리거를 작동시킴
  // 브라우저 보안 정책상 사용자 클릭 이벤트의 콜백(현재 함수) 내에서만 호출 가능
  input.click();
}

// 외부에서 이미지 업로드하면서 메시지 이벤트를 보내주면 받기 위한 함수
// MenuItem.run에서 참조할 외부 팝업 오픈 함수 예시:
// window.openPopupImageUpload = function () {
//   window.open("/image-upload-popup", "이미지 업로드", "width=600,height=400");
// };
// 팝업 쪽에서 업로드 상태 전송 예시:
// window.opener.postMessage({ status: "uploading", id }, "*");
// window.opener.postMessage({ status: "done", url, id }, "*");
function setupImageUploadMessageListener(view: EditorView) {
  window.addEventListener("message", async (event) => {
    if (event.origin !== window.location.origin) return;

    const { status, uploadedUrl, placeholderId } = event.data;
    if (!status) return;

    if (status === "uploading") {
      // 1️⃣ placeholder 추가
      if (!placeholderId) return;
      insertPlaceholder(view, placeholderId);
    }

    if (status === "done") {
      // 2️⃣ 이미지 노드로 교체
      if (!uploadedUrl || !placeholderId) return;
      replacePlaceholderWithImage(view, placeholderId, uploadedUrl);
    }
  });
}

export function createImageUploadMenuComponents() {
  const imageUploadMenuItem = new MenuItem({
    title: "이미지 삽입",
    label: "🖼️ 이미지",
    enable: (_state) => true, // 항상 활성화

    // ✅ run이 있어야 MenuItemSpec 타입이 맞음
    run(_state, _dispatch, view) {
      // 1️⃣ 외부에 window.openPopupImageUpload 함수가 정의되어 있으면 그걸 실행
      if (typeof (window as any).openPopupImageUpload === "function") {
        // 외부에서 들어올 메시지를 받는 리스너 추가
        setupImageUploadMessageListener(view);
        (window as any).openPopupImageUpload();
        return;
      }

      // 2️⃣ 없다면 기본 업로드 트리거 사용
      triggerImageFileInputUpload(view);
    },
  });

  return { imageUploadMenuItem, placeholderPlugin };
}
