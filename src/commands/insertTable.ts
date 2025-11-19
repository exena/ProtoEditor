import { EditorState, Transaction, NodeSelection } from "prosemirror-state";

export function insertTable(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  rows = 3,
  cols = 3
): boolean {
  const { schema } = state;
  const table = createTable(schema, rows, cols);

  // (1) 테이블 삽입
  let tr = state.tr.replaceSelectionWith(table);

  // (2) 방금 삽입한 'table' 노드의 정확한 시작 위치 계산
  const pos = tr.selection.$from.before(); 
  // ✔ replaceSelectionWith 직후 selection은 삽입된 노드 뒤
  // ✔ $from.before()는 방금 넣은 노드의 시작 위치

  // (3) NodeSelection 적용
  tr = tr.setSelection(NodeSelection.create(tr.doc, pos)).scrollIntoView();

  if (dispatch) dispatch(tr);
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
