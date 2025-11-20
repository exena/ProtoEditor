import { MenuItem } from "prosemirror-menu";
import { insertTable } from "../../commands/insertTable";

export const insertTableItem = new MenuItem({
  title: "표 삽입",
  // label: "📋 표",
  enable: (state) => !!state,
  run: (state, dispatch, view) => {
    // 필요한 rows, cols 기본값 설정
    const rows = 3;
    const cols = 3;

    insertTable(view, state, dispatch, rows, cols);
  },
  render: (_view) => {
      const dom = document.createElement("div");
      dom.className = "ProseMirror-icon";
      dom.title = "Insert Table";
      // SVG 삽입
      dom.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z"/></svg>
      `;
      return dom;
    },
});
