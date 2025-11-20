import { Node, NodeSpec } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";

export const paragraphNode : NodeSpec = {
  ...basicSchema.spec.nodes.get("paragraph"),

  attrs: {
    ...basicSchema.spec.nodes.get("paragraph")?.attrs,
    textAlign: { default: null }
  },

  parseDOM: [
    {
      tag: "p",
      getAttrs(dom: HTMLElement) {
        return {
          textAlign: dom.style.textAlign || null,
        };
      },
    },
  ],

  toDOM(node: Node) {
    const { textAlign } = node.attrs;
    const style = textAlign ? `text-align: ${textAlign};` : null;

    return ["p", { style }, 0];
  },
};
