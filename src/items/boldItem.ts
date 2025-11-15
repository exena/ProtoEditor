import { MenuItem } from "prosemirror-menu";
import { toggleMark } from "prosemirror-commands";
import { MarkType } from "prosemirror-model";

export function createBoldItem(strongMark: MarkType) {
  return new MenuItem({
    title: "굵게",
    // label: "B",
    run: toggleMark(strongMark),
    enable: (state) => toggleMark(strongMark)(state),
    render: (_view) => {
      const dom = document.createElement("div");
      dom.className = "ProseMirror-icon";
      dom.title = "Toggle bold";
      // SVG 삽입
      dom.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M333.49 238a122 122 0 0 0 27-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h31.87v288H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 0 1 0 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 0 1 0 112z"/></svg>
      `;
      return dom;
    },
  });
}