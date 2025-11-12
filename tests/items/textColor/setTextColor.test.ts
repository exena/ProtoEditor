import { EditorState, TextSelection } from "prosemirror-state";
import { DOMOutputSpec, MarkSpec, Schema } from "prosemirror-model";
import { setTextColor } from "../../../src/items/textColor/setTextColor";

// ✅ 테스트용 textColor 마크 정의
const textColorMark: MarkSpec = {
  attrs: { color: { default: null } },
  parseDOM: [
    {
      style: "color",
      getAttrs: (value: string) => ({ color: value }),
    },
  ],
  toDOM(mark): DOMOutputSpec {
    return ["span", { style: `color: ${mark.attrs.color || "inherit"}` }, 0];
  },
};

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
  // ✅ 실제 텍스트의 selection은 1~6 (문서 전체 기준)
  const selection = TextSelection.create(state.doc, 1, 6);
  const newState = state.apply(state.tr.setSelection(selection));

  const dispatch = jest.fn();
  const result = setTextColor("#ff0000")(newState, dispatch);

  expect(result).toBe(true);
  expect(dispatch).toHaveBeenCalled();
});
