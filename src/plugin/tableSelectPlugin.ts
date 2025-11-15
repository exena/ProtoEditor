import { Plugin, PluginKey } from "prosemirror-state";
import { NodeSelection } from "prosemirror-state";

export const tableSelectPlugin = new Plugin({
  key: new PluginKey("tableSelectPlugin"),

  props: {
    handleDOMEvents: {
      mousedown(view, event) {
        // 표 클릭인지 확인
        const dom = event.target;
        if (!(dom instanceof HTMLElement)) return false; // 타입 가드 다운캐스팅

        const table = dom.closest("table"); // 타입 가드가 있어야 함
        if (!table) return false;

        // 표 노드 위치 찾기
        // DOM → pos 매핑 (표 노드의 시작 위치)
        const pos = view.posAtDOM(table, 0);

        // NodeSelection으로 표 선택
        const tr = view.state.tr.setSelection(
          NodeSelection.create(view.state.doc, pos)
        );

        view.dispatch(tr);
        return true;
      },
    }
  }
});
