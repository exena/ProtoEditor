import { Plugin, PluginKey } from "prosemirror-state";
import { NodeSelection } from "prosemirror-state";

export const tableOverlayPlugin = new Plugin({
  key: new PluginKey("tableOverlayPlugin"),

  view(editorView) {
    // overlay root
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "0";
    overlay.style.height = "0";
    overlay.style.pointerEvents = "none"; // overlay 자체는 클릭 안됨

    editorView.dom.parentNode!.appendChild(overlay);

    return {
      update: (view) => {
        // 매 렌더링 때 기존 overlay 초기화
        overlay.innerHTML = "";

        const tables = view.dom.querySelectorAll("table");
        if (!tables || tables.length === 0) return;

        tables.forEach((table) => {
          const rect = table.getBoundingClientRect();
          const parentRect = view.dom.getBoundingClientRect();

          // overlay 내부에 실제 클릭 가능한 영역 추가
          const box = document.createElement("div");
          box.style.position = "absolute";
          box.style.left = rect.left - parentRect.left + "px";
          box.style.top = rect.top - parentRect.top + "px";
          box.style.width = rect.width + "px";
          box.style.height = rect.height + "px";

          box.style.cursor = "pointer";
          box.style.pointerEvents = "auto"; // 클릭 가능
          box.style.background = "rgba(0,0,0,0)"; // 완전 투명

          // 클릭 시 표 전체 선택
          box.addEventListener("mousedown", (e) => {
            e.preventDefault();

            const pos = view.posAtDOM(table, 0);
            const tr = view.state.tr.setSelection(
              NodeSelection.create(view.state.doc, pos)
            );
            view.dispatch(tr);
          });

          overlay.appendChild(box);
        });
      },

      destroy() {
        overlay.remove();
      },
    };
  },
});
