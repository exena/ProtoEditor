import { setBlockType } from "prosemirror-commands";
import { EditorState, Transaction } from "prosemirror-state";

export function setParagraphAlign(align: "left" | "center" | "right") {
  return function (state: EditorState, dispatch:(tr: Transaction) => void) {
    const { schema } = state;
    const paragraph = schema.nodes.paragraph;

    return setBlockType(paragraph, { textAlign: align })(state, dispatch);
  };
}