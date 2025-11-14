import { EditorState, Transaction } from "prosemirror-state";
import { Schema, Node } from "prosemirror-model";
import { placeholderPlugin, insertPlaceholder, replacePlaceholderWithImage, removePlaceholder, placeholderPluginKey } from "../../../src/items/imageUpload/placeholderPlugin";

// 테스트용 간단한 schema
const testSchema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { content: "inline*", group: "block", parseDOM: [{ tag: "p" }], toDOM: () => ["p", 0] },
    text: { group: "inline" },
    image: { inline: true, attrs: { src: {} }, group: "inline", parseDOM: [{ tag: "img[src]", getAttrs: dom => ({ src: (dom as any).getAttribute("src") }) }], toDOM: node => ["img", { src: node.attrs.src }] },
  },
  marks: {},
});

function createView(doc?: Node) {
  const state = EditorState.create({
    doc: doc || testSchema.nodes.doc.createAndFill()!,
    plugins: [placeholderPlugin],
  });

  const dispatch = jest.fn();
  const view: any = { state, dispatch };
  return view;
}

describe("placeholderPlugin", () => {
  test("insertPlaceholder dispatches transaction with placeholder meta", () => {
    const view = createView();
    insertPlaceholder(view, "ph1");

    expect(view.dispatch).toHaveBeenCalled();
    const tr: Transaction = view.dispatch.mock.calls[0][0];
    const meta = tr.getMeta(placeholderPluginKey);
    expect(meta).toEqual({ add: { id: "ph1", pos: view.state.selection.from } });
  });

  test("removePlaceholder dispatches transaction with remove meta", () => {
    const view = createView();
    removePlaceholder(view, "ph1");

    expect(view.dispatch).toHaveBeenCalled();
    const tr: Transaction = view.dispatch.mock.calls[0][0];
    const meta = tr.getMeta(placeholderPluginKey);
    expect(meta).toEqual({ remove: { id: "ph1" } });
  });

  test("replacePlaceholderWithImage dispatches replace transaction and removes placeholder", () => {
    const view = createView();
    // 먼저 placeholder 삽입
    insertPlaceholder(view, "ph1");

    // apply tr을 수동으로 적용
    const trInsert = view.dispatch.mock.calls[0][0];
    const newState = view.state.apply(trInsert);
    view.state = newState;
    view.dispatch = jest.fn(); // dispatch 초기화

    // 교체
    replacePlaceholderWithImage(view, "ph1", "http://uploaded.com/img.png");

    expect(view.dispatch).toHaveBeenCalled();
    const trReplace: Transaction = view.dispatch.mock.calls[0][0];
    const meta = trReplace.getMeta(placeholderPluginKey);
    expect(meta).toEqual({ remove: { id: "ph1" } });

    // 이미지 노드가 교체되었는지 확인
    let found = false;
    trReplace.doc.descendants((node) => {
    if (node.type.name === "image" && node.attrs.src === "http://uploaded.com/img.png") {
      found = true;
    }
    });
    expect(found).toBe(true);
  });
});
