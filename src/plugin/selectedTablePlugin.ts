import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export const selectedTablePluginKey = new PluginKey("selected-table-plugin");

export const selectedTablePlugin = new Plugin({
  key: selectedTablePluginKey,

  state: {
    init() {
      return { selectedPos: null };
    },

    apply(tr, value) {
      let selectedPos = value.selectedPos;

      // 버튼 누를 때 { pos }가 meta로 들어옴
      const meta = tr.getMeta(selectedTablePluginKey);
      if (meta && meta.pos !== undefined) {
        selectedPos = meta.pos;
      }

      // Selection이 바뀌면 테이블 선택 해제
      if (tr.selectionSet) {
        selectedPos = null;
      }

      // docChanged가 있어도 selectedPos는 그대로 둔다.
      // (이 전략에서는 테이블 pos가 그대로 유지된다고 믿고 감)
      // 필요하면 mapping 적용도 가능하지만 1번 전략에서는 고정해도 됨.

      return { selectedPos };
    },
  },

  props: {
    decorations(state) {
      const { selectedPos } = selectedTablePluginKey.getState(state);
      if (selectedPos == null) return null;

      const node = state.doc.nodeAt(selectedPos);
      if (!node) return null;

      return DecorationSet.create(state.doc, [
        Decoration.node(
          selectedPos,
          selectedPos + node.nodeSize,
          { class: "selected-table-block" }
        )
      ]);
    },
  }
});
