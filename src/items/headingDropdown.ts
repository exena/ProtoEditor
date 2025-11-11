import { MenuItem } from "prosemirror-menu";
import { setBlockType } from "prosemirror-commands";
import type { NodeType} from "prosemirror-model";
import { EditorState } from "prosemirror-state";

/**
 * Heading 드롭다운 메뉴 생성기
 * @param headingNode - schema.nodes.heading
 * @param levels - 지원할 heading 레벨 배열 (기본 [1,2,3])
 */
export function createHeadingDropdown(
  headingNode: NodeType,
  levels: number[] = [1, 2, 3]
) {
  // 현재 heading level 계산 함수
  function getActiveHeadingLevel(state: EditorState): number | null {
    const { $from } = state.selection;
    const parent = $from.parent;
    if (parent.type === headingNode) {
      return parent.attrs.level;
    }
    return null;
  }

  return new MenuItem({
    title: "Heading",
    label: "H",
    enable: (_state) => true,
    run(_state, _dispatch, _view) {},
    render(view) {
      const wrap = document.createElement("div");
      wrap.className = "pm-dropdown";

      const button = document.createElement("div");
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M448 96v320h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H320a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V288H160v128h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V96H32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-32v128h192V96h-32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16z"/></svg>
      `;
      button.className = "ProseMirror-icon";

      // 현재 상태 표시
      const updateButtonLabel = () => {
        const level = getActiveHeadingLevel(view.state);
        // button.textContent = level ? `H${level} ▼` : "본문 ▼";
        button.style.color = level ? "blue" : "currentColor";
      };
      updateButtonLabel();

      const menu = document.createElement("div");
      menu.className = "pm-dropdown-menu hidden";

      // 메뉴 아이템 추가
      levels.forEach((level) => {
        const itemDom = document.createElement("div");
        itemDom.textContent = `H${level}`;
        itemDom.className = "pm-dropdown-item";

        itemDom.addEventListener("mousedown", (e) => {
          e.preventDefault();
          setBlockType(headingNode, { level })(view.state, view.dispatch);
          view.focus();
          menu.classList.add("hidden");
          updateButtonLabel();
        });

        menu.appendChild(itemDom);
      });

      // "본문" 옵션 추가
      const paragraphItem = document.createElement("div");
      paragraphItem.textContent = "본문";
      paragraphItem.className = "pm-dropdown-item";
      paragraphItem.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const paragraphType = view.state.schema.nodes.paragraph;
        setBlockType(paragraphType)(view.state, view.dispatch);
        view.focus();
        menu.classList.add("hidden");
        updateButtonLabel();
      });
      menu.appendChild(paragraphItem);

      // 버튼 토글
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        menu.classList.toggle("hidden");
      });

      // 상태가 바뀔 때마다 label 업데이트
      view.dom.addEventListener("mouseup", () => updateButtonLabel());
      view.dom.addEventListener("keyup", () => updateButtonLabel());

      wrap.appendChild(button);
      wrap.appendChild(menu);
      return wrap;
    },
  });
}
