import { EditorState, Transaction } from "prosemirror-state";

export function insertTable(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  rows = 3,
  cols = 3
): boolean {
  const { schema } = state;
  const table = createTable(schema, rows, cols);
  const tr = state.tr.replaceSelectionWith(table);
  if (dispatch) dispatch(tr.scrollIntoView());
  return true;
}

// 실제 테이블 노드 생성 함수
function createTable(schema: any, rows: number, cols: number) {
  const { table, table_row, table_cell } = schema.nodes;
  const cells = [];
  for (let i = 0; i < cols; i++) {
    cells.push(table_cell.createAndFill()!);
  }
  const rowsArr = [];
  for (let j = 0; j < rows; j++) {
    rowsArr.push(table_row.create(null, cells));
  }
  return table.create(null, rowsArr);
}
