import { tableNodes } from "prosemirror-tables";

// ✅ tableNodes()로 표 관련 노드 추가
const tableSpecs = tableNodes({
  tableGroup: "block",
  cellContent: "paragraph+",
  cellAttributes: {},
});

// ✔ table 노드를 override하여 style 속성 추가
tableSpecs.table = {
  ...tableSpecs.table,
  attrs: {
    ...tableSpecs.table.attrs,
    alignment: { default: "left" }, // 왼,가,오 정렬 지원
  },
  toDOM(node) {
    const align = node.attrs.alignment;

    // alignment별 스타일 적용
    let style = "";
    if (align === "right") style = "margin-left:auto;";
    else if (align === "center") style = "margin-left:auto;margin-right:auto;";

    return ["table", { style }, 0];
  },
  selectable: true,
};

export { tableSpecs };