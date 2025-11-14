// utils/setUpEditorForTest.ts
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { Schema, DOMParser as PMDOMParser } from "prosemirror-model";

export const testTextSchema = new Schema({
  nodes: {
    doc: { content: "text*" },
    text: { group: "text" },
  },
  marks: {
    textColor: {
      attrs: { color: {} },
      toDOM(mark) {
        return ["span", { style: `color: ${mark.attrs.color}` }, 0];
      },
      parseDOM: [
        {
          style: "color",
          getAttrs: (value: string) => ({ color: value }),
        },
      ],
    },
  },
});

/**
 * 테스트용 ProseMirror EditorView를 설정하고 반환합니다.
 * jsdom 환경에서 실제 DOM에 mount되어 동작합니다.
 */
export function setupEditorForTextColorTest() {
  // 테스트용 DOM 생성
  document.body.innerHTML = `<div id="editor"></div>`;
  const editorEl = document.querySelector("#editor") as HTMLElement;

  // 상태 생성
  const state = EditorState.create({
    schema: testTextSchema,
    doc: PMDOMParser.fromSchema(testTextSchema).parse(document.createElement("div")),
  });

  // EditorView 생성
  const view = new EditorView(editorEl, { state });

  // 테스트 후 정리용 destroy 함수 제공
  const cleanup = () => {
    view.destroy();
    document.body.innerHTML = "";
  };

  return { view, editorEl, cleanup };
}

/**
 * 색상 선택기나 팝오버처럼 외부 DOM이 필요한 경우를 위한 헬퍼
 * 테스트에서 pickerSetup.ts의 createPicker로 컨테이너를 불러오려고 하면 JSDOM에는 window.tui가 없어서 에러가 발생함
 */
export function createHiddenContainer(id = "picker-container") {
  const container = document.createElement("div");
  container.id = id;
  container.style.display = "none";
  document.body.appendChild(container);
  return container;
}
