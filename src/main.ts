import './css/editor.css'
import './css/dropdown.css'
import './css/table.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser as ProseMirrorDOMParser, DOMSerializer } from 'prosemirror-model';
import { exampleSetup } from "prosemirror-example-setup";
import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { textColorMark } from "./marks/textColorMark";
import { createCustomMenu } from "./menu/customMenu"
import { strikeMark } from './marks/strikeMark';
import { paragraphNode } from './items/textAlign/paragraphNode';
import { tableSpecs } from './items/insertTable/tableNode';


let nodes = basicSchema.spec.nodes.update("paragraph", paragraphNode); // text-align 속성 추가

// 1️⃣ 스키마 확장
const mySchema = new Schema({
  nodes: nodes.append(tableSpecs),
  marks: basicSchema.spec.marks.addToEnd("textColor", textColorMark).addToEnd("strike", strikeMark),
});

// 2️⃣ 커스텀 메뉴 구성
const { customMenu, plugins } = createCustomMenu(mySchema);

// 3️⃣ 초기 문서 파싱
const contentElement = document.querySelector("#content") as HTMLTextAreaElement;
const parser = ProseMirrorDOMParser.fromSchema(mySchema);
const doc = parser.parse(new window.DOMParser().parseFromString(contentElement.value || "<p></p>", "text/html").body);

// 4️⃣ EditorState 생성
const state = EditorState.create({
  doc,
  plugins: [
    ...exampleSetup({ schema: mySchema, menuContent: customMenu }),
    ...plugins
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

    // ② input에 반영
    const htmlString = tempDiv.innerHTML;
    contentElement.value = htmlString;
  },
});
