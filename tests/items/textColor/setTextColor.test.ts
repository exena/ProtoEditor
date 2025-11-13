import { EditorState, TextSelection } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { setTextColor } from "../../../src/items/textColor/setTextColor";
import { textColorMark } from "../../../src/items/textColor/textColorMark";

// ✅ 커스텀 스키마 생성
const customSchema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { content: "inline*", group: "block" },
    text: { group: "inline" },
  },
  marks: { textColor: textColorMark },
});


test("setTextColor marks text with the given color", () => {
  // ✅ 문서 안에 paragraph 추가
  const doc = customSchema.nodes.doc.createAndFill(
    null,
    customSchema.nodes.paragraph.create(null, customSchema.text("Hello"))
  )!;

  const state = EditorState.create({ doc });
  // ✅ 실제 "Hello" 텍스트의 selection은 1~6 (문서 전체 기준)
  const selection = TextSelection.create(state.doc, 1, 6);
  const newState = state.apply(state.tr.setSelection(selection));

  const dispatch = jest.fn();
  const result = setTextColor("#ff0000")(newState, dispatch);

  expect(result).toBe(true);
  expect(dispatch).toHaveBeenCalled();
});
