import { MenuItem } from "prosemirror-menu";
import { toggleMark } from "prosemirror-commands";
import { MarkType } from "prosemirror-model";

export function createItalicItem(emMark: MarkType) {
  return new MenuItem({
    title: "Toggle italic",
    // label: "I",
    run: toggleMark(emMark),
    enable: (state) => toggleMark(emMark)(state),
    render: (view) => {
      const dom = document.createElement("div");
      dom.className = "ProseMirror-icon";
      dom.title = "Toggle Italic";
      // SVG 삽입
      dom.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 48v32a16 16 0 0 1-16 16h-62.76l-80 320H208a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h62.76l80-320H112a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16z"/></svg>
      `;
      return dom;
    },
  });
}
