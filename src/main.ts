import './editor.css'
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser, DOMSerializer} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
});

const serializer = DOMSerializer.fromSchema(mySchema);

const editorView = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")!),
    plugins: exampleSetup({schema: mySchema})
  }),
  dispatchTransaction(transaction) {
    let newState = editorView.state.apply(transaction)
    editorView.updateState(newState)
    const fragment = serializer.serializeFragment(editorView.state.doc.content);
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(fragment);
    const htmlString = tempDiv.innerHTML;
    const content = document.querySelector("#content")!;
    content.innerHTML = htmlString;
  }
});