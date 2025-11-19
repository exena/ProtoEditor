import { NodeSelection, Plugin, PluginKey } from "prosemirror-state";
import { selectedTablePluginKey } from "./selectedTablePlugin";

export const tableOverlayPluginKey = new PluginKey("tableOverlayPlugin");

export const tableOverlayPlugin = new Plugin({
  key: tableOverlayPluginKey,

  view(editorView) {
    const buttons = new Map(); // pos -> button

    const container = editorView.dom.parentElement; // 에디터 래퍼
    const editor = editorView.dom;

    return {
      update(view) {
        const { doc } = view.state;

        // 1. 모든 버튼을 제거(재생성)
        buttons.forEach((btn) => btn.remove());
        buttons.clear();

        // 2. 테이블 노드를 검색하며 버튼 생성
        doc.descendants((node, pos) => {
          if (node.type.name !== "table") return;

          const tableDOM = view.nodeDOM(pos);
          if (!(tableDOM instanceof HTMLElement)) return;

          // 버튼 DOM 생성
          const btn = document.createElement("div");
          btn.className = "pm-table-select-button";
          btn.textContent = "▦"; // 적당한 표기

          // 클릭 시 meta 전송
          btn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            const tr1 = view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos)); // 테이블 선택. 실제로는 테이블 측에서 모든 셀 선택으로 전환시킴.
            view.dispatch(tr1);
            const tr2 = view.state.tr.setMeta(selectedTablePluginKey, { pos }); // 셀 선택으로 전환이 끝난 후에 신호를 보낸다.
            view.dispatch(tr2);
          });

          container!.appendChild(btn);
          buttons.set(pos, btn);

          // 위치 계산
          const rect = tableDOM.getBoundingClientRect();
          const editorRect = editor.getBoundingClientRect();

          btn.style.position = "absolute";
          btn.style.left = editorRect.left - container!.getBoundingClientRect().left + "px";
          btn.style.top = rect.top - container!.getBoundingClientRect().top + "px";
        });
      },

      destroy() {
        buttons.forEach((btn) => btn.remove());
      }
    };
  }
});