import './editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser as ProseMirrorDOMParser, DOMSerializer } from 'prosemirror-model';
import { exampleSetup } from 'prosemirror-example-setup';
import ColorPicker from 'tui-color-picker';
import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { textColorMark } from "./textColorMark";
import { createTextColorSyncPlugin } from './textColorSyncPlugin';
import { setTextColor } from './setTextColor';

// 1️⃣ 스키마 확장
const mySchema = new Schema({
  nodes: basicSchema.spec.nodes,
  marks: basicSchema.spec.marks.addToEnd("textColor", textColorMark),
});

// 2️⃣ ColorPicker 초기화
const colorPicker = ColorPicker.create({
  container: document.getElementById('color-picker')!,
  color: '#000000',
});

// 3️⃣ 초기 문서 파싱
const contentElement = document.querySelector("#content") as HTMLTextAreaElement;
const parser = ProseMirrorDOMParser.fromSchema(mySchema);
const doc = parser.parse(new window.DOMParser().parseFromString(contentElement.value || "<p></p>", "text/html").body);

// 4️⃣ EditorState 생성
const state = EditorState.create({
  doc,
  plugins: [
    ...exampleSetup({ schema: mySchema }),
    createTextColorSyncPlugin(colorPicker),
  ],
});

// 5️⃣ EditorView 생성
const editorView = new EditorView(document.querySelector("#editor"), {
  state,
  dispatchTransaction(transaction) {
    const newState = editorView.state.apply(transaction);
    editorView.updateState(newState);

    // ① ProseMirror → HTML 직렬화
    const serializer = DOMSerializer.fromSchema(mySchema);
    const fragment = serializer.serializeFragment(editorView.state.doc.content);
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(fragment);

    // ② textarea에 반영
    const htmlString = tempDiv.innerHTML;
    contentElement.value = htmlString;
  },
});

// 6️⃣ ColorPicker 이벤트 연결
colorPicker.on('selectColor', (colorInfo) => {
  const color = colorInfo.color; // { color, origin } 중 color만 사용
  setTextColor(color)(editorView.state, editorView.dispatch);
});
