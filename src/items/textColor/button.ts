import { MenuItem } from "prosemirror-menu";
import { EditorView } from "prosemirror-view";
import { setTextColor } from "./setTextColor";

export function createTextColorButton(colorPicker: any, pickerContainer: HTMLElement) {
  // 버튼 아이콘 (DOM 노드) — 나중에 플러그인이 이 노드를 찾아 색을 업데이트
  const iconSpan = document.createElement("span");
  iconSpan.textContent = "A";
  iconSpan.style.fontWeight = "bold";
  iconSpan.style.fontSize = "16px";
  iconSpan.style.lineHeight = "20px";
  iconSpan.style.color = "#000";
  // 식별자: 플러그인에서 버튼을 찾기 위해 data 속성 추가
  iconSpan.setAttribute("data-text-color-button", "1");

  const textColorItem = new MenuItem({
    title: "텍스트 색상",
    run(_state, _dispatch, view: EditorView) {
      // 버튼 위치에 따라 picker 띄우기: 메뉴는 내부적으로 버튼 DOM을 만든다.
      // view.dom은 에디터 전체 DOM. 찾은 iconSpan의 부모 버튼을 이용하려 시도.
      // (간단하고 안전한 방법: 툴바 버튼의 bounding rect를 기준으로 위치)
      const btn = document.querySelector('[data-text-color-button]') as HTMLElement | null;
      const rect = (btn && btn.getBoundingClientRect()) || (view.dom as HTMLElement).getBoundingClientRect();

      pickerContainer.style.left = `${rect.left}px`;
      pickerContainer.style.top = `${rect.bottom + 6}px`;
      pickerContainer.style.display = "block";

      // 리스너 중복 방지
      colorPicker.off("selectColor");
      colorPicker.on("selectColor", (ev: any) => {
        const color = typeof ev === "string" ? ev : ev?.color;
        if (color) {
          setTextColor(color)(view.state, view.dispatch);
          // 버튼 아이콘 색 즉시 업데이트 (btn이 있으면)
          if (btn) {
            const icon = btn.querySelector('[data-text-color-button]') as HTMLElement | null;
            if (icon) icon.style.color = color;
          }
        }
        pickerContainer.style.display = "none";
        view.focus();
      });
    },
    render(_view: EditorView): HTMLElement {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "text-color-btn";
      btn.appendChild(iconSpan);

      // 바깥 클릭시 닫기
      document.addEventListener("click", (e) => {
        if (!pickerContainer.contains(e.target as Node) && !btn.contains(e.target as Node))
          pickerContainer.style.display = "none";
      });

      return btn;
    },
  });

  return { textColorItem, iconSpan };
}
