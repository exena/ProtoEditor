import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { toggleMark } from "prosemirror-commands";

let view: EditorView;

beforeEach(() => {
  document.body.innerHTML = `<div id="editor"></div>`;
  const state = EditorState.create({
    schema,
  });
  view = new EditorView(document.querySelector("#editor")!, { state });
});

afterEach(() => {
  view.destroy();
});

test("toggleMark adds strong mark", () => {
  const { state } = view;
  toggleMark(schema.marks.strong)(state, view.dispatch);
  const tr = view.state.tr;
  expect(tr.selection.empty).toBe(true);
});
