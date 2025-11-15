/**
 * @jest-environment jsdom
 */
import { EditorState, Plugin, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { createTextColorPaletteSyncPlugin } from "../../../src/items/textColor/textColorPaletteSyncPlugin";
import { testTextSchema } from "../../utils/setUpEditorForTextColorTest";

describe("createTextColorPaletteSyncPlugin", () => {
  let colorPickerMock: any;
  let plugin: Plugin;
  let view: EditorView;

  beforeEach(() => {
    // --- colorPicker mock
    colorPickerMock = { setColor: jest.fn() };

    // --- plugin 생성
    plugin = createTextColorPaletteSyncPlugin(colorPickerMock);

    // --- 초기 상태 (검정 텍스트)
    const state = EditorState.create({
      schema: testTextSchema,
      doc: testTextSchema.node("doc", null, [testTextSchema.text("hello world")]),
      plugins: [plugin],
    });

    // --- 뷰 생성
    const editorDiv = document.createElement("div");
    document.body.appendChild(editorDiv);
    view = new EditorView(editorDiv, { state });
  });

  afterEach(() => {
    view.destroy();
    document.body.innerHTML = "";
  });

  test("selection 이동 시 textColor 마크가 있으면 버튼 색과 colorPicker를 업데이트한다", () => {
    // --- 새 문서: "he"만 빨간색
    const redText = testTextSchema.text("he", [testTextSchema.mark("textColor", { color: "rgb(255, 0, 0)" })]);
    const restText = testTextSchema.text("llo world");
    const doc = testTextSchema.node("doc", null, [redText, restText]);

    const stateWithColor = EditorState.create({
      schema: testTextSchema,
      doc,
      plugins: [plugin],
    });

    // selection이 "he" 범위를 가리키게 함
    const selection = TextSelection.create(stateWithColor.doc, 1, 3);
    const newState = stateWithColor.apply(stateWithColor.tr.setSelection(selection));

    // --- plugin의 view() 내부 update() 직접 실행
    const pluginView = plugin.spec.view!(view);
    const oldstate = view.state;
    view.updateState(newState);
    pluginView.update!(view, oldstate);   // selection 변경 전달

    // --- 검증
    expect(colorPickerMock.setColor).toHaveBeenCalledWith("rgb(255, 0, 0)"); // colorPicker 동기화 확인
  });

  test("selection이 동일하면 아무 동작도 하지 않는다", () => {
    const prevState = view.state;

    const pluginView = plugin.spec.view!(view);
    pluginView.update!(view, prevState); // 동일 selection

    expect(colorPickerMock.setColor).not.toHaveBeenCalled();
  });
});
