import { EditorState, Transaction } from "prosemirror-state";
import { setBlockType } from "prosemirror-commands";
import { getHighlightedTablePos } from "./getHighlightedTablePos"

function setTableAlign(align: "left" | "center" | "right", tablePos: any) {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { schema } = state;
    const table = schema.nodes.table;

    const node = state.doc.nodeAt(tablePos);

    if (node && node.type === table) {
      const newAttrs = { ...node.attrs, alignment: align };
      
      if (dispatch) {
        dispatch(
          state.tr.setNodeMarkup(tablePos, table, newAttrs).scrollIntoView()
        );
      }
      return true;
    }
    
    return false;
  };
}

export function setNodeAlign(align: "left" | "center" | "right") {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { selection, schema } = state;
    const { paragraph, table } = schema.nodes;

    const node = selection.$from.parent;

    const tablePos = getHighlightedTablePos(state);

    // 1) TABLE 정렬
    if (table && tablePos != null) {
      return setTableAlign(align, tablePos)(state, dispatch);
    }

    // 2) PARAGRAPH 정렬
    if (paragraph && node.type === paragraph) {
      return setBlockType(paragraph, { textAlign: align })(state, dispatch);
    }

    // if (heading && node.type === heading) {
    //   return setBlockType(heading, { textAlign: align })(state, dispatch);
    // }

    return false;
  };
}
