import { EditorState, Transaction, NodeSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { selectedTablePluginKey } from "../plugin/selectedTablePlugin";

export function insertTable(
  view: EditorView,
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  rows = 3,
  cols = 3
): boolean {
  const { schema } = state;
  const table = createTable(schema, rows, cols);
  const pos = state.tr.selection.$from.before();

  // (1) 테이블 삽입
  let tr = state.tr.replaceSelectionWith(table);
  if (dispatch) dispatch(tr);

  // (2) 테이블 선택 플러그인을 사용.
  const tr1 = view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos)); // 테이블 선택. 실제로는 테이블 측에서 모든 셀 선택으로 전환시킴.
  view.dispatch(tr1);
  const tr2 = view.state.tr.setMeta(selectedTablePluginKey, { pos }); // 셀 선택으로 전환이 끝난 후에 신호를 보낸다.
  view.dispatch(tr2);

  return true;
}

function createTable(schema: any, rows: number, cols: number) {
  const { table, table_row, table_cell } = schema.nodes;

  const rowsArr = [];
  for (let j = 0; j < rows; j++) {
    const cells = [];
    for (let i = 0; i < cols; i++) {
      cells.push(table_cell.createAndFill()!);
    }
    rowsArr.push(table_row.create(null, cells));
  }

  return table.create(null, rowsArr);
}
