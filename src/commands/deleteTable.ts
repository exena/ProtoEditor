import { EditorState, Transaction } from "prosemirror-state";
import { getHighlightedTablePos } from "./getHighlightedTablePos";

export function deleteTableCommand(state: EditorState, dispatch?: (tr: Transaction) => void) {
  const pos = getHighlightedTablePos(state);
  if (pos == null) return false;

  const $pos = state.doc.resolve(pos);
  const table = $pos.nodeAfter;
  if (!table) return false;

  if (dispatch) {
    const tr = state.tr.delete(pos, pos + table.nodeSize);
    dispatch(tr);
  }
  return true;
}
