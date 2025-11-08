import { MenuItem } from "prosemirror-menu";
import { placeholderPluginKey, placeholderPlugin, findPlaceholder } from "./placeholderPlugin";

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

export function createImageUploadMenuComponents() {
  const imageUploadMenuItem = new MenuItem({
    title: "이미지 삽입",
    label: "🖼️ 이미지",
    enable: (state) => true, // 항상 활성화

    // ✅ run이 있어야 MenuItemSpec 타입이 맞음
    run(state, dispatch, view) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";

      input.addEventListener("change", async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        // 1️⃣ placeholder 추가
        const id = {};
        const tr = view.state.tr.setMeta(placeholderPluginKey, {
          add: { id, pos: view.state.selection.from },
        });
        dispatch(tr);

        // 2️⃣ 파일 업로드 시작 (비동기)
        uploadImageFile(file).then((uploadedUrl) => {
        const { state, dispatch } = view;
        const pos = findPlaceholder(state, id);

        // 3️⃣ 업로드 완료 후 placeholder 위치 찾기
        if (pos == null) return;

        // 4️⃣ 진짜 이미지로 교체
        const tr = state.tr.replaceWith(
          pos,
          pos,
          state.schema.nodes.image.create({ src: uploadedUrl })
        );
        tr.setMeta(placeholderPluginKey, { remove: { id } });
        dispatch(tr);
        });
      });

      // input 클릭 트리거
      input.click();
    },
  });

  return { imageUploadMenuItem, placeholderPlugin }
}
