import { EditorState, TextSelection } from "prosemirror-state";
import { setTextColor } from "../../../src/items/textColor/setTextColor";
import { testTextSchema } from "../../utils/setUpEditorForTextColorTest";

test("setTextColor marks text with the given color", () => {
  const doc = testTextSchema.nodes.doc.create(
    null,
    testTextSchema.text("Hello")
  );

  const state = EditorState.create({ doc });

  const selection = TextSelection.create(state.doc, 1, 5); // state.doc.content.size = 5 ("Hello")
  const newState = state.apply(state.tr.setSelection(selection));

  const dispatch = jest.fn();
  const result = setTextColor("#ff0000")(newState, dispatch);

  expect(result).toBe(true);
  expect(dispatch).toHaveBeenCalled();
});