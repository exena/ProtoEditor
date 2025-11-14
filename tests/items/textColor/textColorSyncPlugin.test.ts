import { EditorState, Plugin, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { createTextColorSyncPlugin } from "../../../src/items/textColor/textColorSyncPlugin";
import { testTextSchema } from "../../utils/setUpEditorForTextColorTest";

describe("createTextColorSyncPlugin", () => {
  let colorPickerMock: any;
  let view: EditorView;
  let container: HTMLElement;
  let plugin: Plugin;

  beforeEach(() => {
    colorPickerMock = { setColor: jest.fn() };
    container = document.createElement("div");
    document.body.appendChild(container);

    // --- plugin 생성
    plugin = createTextColorSyncPlugin(colorPickerMock);

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
    if (view) view.destroy();
    document.body.innerHTML = "";
  });

  test("selection이 바뀌면 textColor 마크의 색상이 colorPicker에 동기화된다", () => {
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

    // colorPicker.setColor가 올바르게 호출되었는지 확인
    expect(colorPickerMock.setColor).toHaveBeenCalledWith("rgb(255, 0, 0)");
  });

  test("selection이 안 바뀌면 setColor가 호출되지 않는다", () => {
    const pluginView = plugin.spec.view!(view);

    // selection이 바뀌지 않은 상태로 update 호출
    pluginView.update!(view, view.state);

    expect(colorPickerMock.setColor).not.toHaveBeenCalled();
  });
});
