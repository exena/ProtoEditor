import { MenuItem } from "prosemirror-menu";
import { setBlockType } from "prosemirror-commands";
import { NodeType } from "prosemirror-model";

export function createHeadingDropdown(heading: NodeType, levels: number[] = [1, 2, 3]) {
  // H1~H3 생성
  const items = levels.map((level) =>
    new MenuItem({
      title: `Heading ${level}`,
      label: `H${level}`,
      run: setBlockType(heading, { level }),
      enable: (state) => setBlockType(heading, { level })(state),
    })
  );

  // 실제 드롭다운을 렌더링하는 MenuItem
  const dropdown = new MenuItem({
    title: "Heading",
    label: "H",
    run(_state, _dispatch, _view) {},
    render(view) {
      const wrap = document.createElement("div");
      wrap.className = "pm-dropdown";

      const button = document.createElement("button");
      button.textContent = "H ▼";
      wrap.appendChild(button);

      const menu = document.createElement("div");
      menu.className = "pm-dropdown-menu hidden";
      wrap.appendChild(menu);

      // 하위 메뉴 아이템 렌더링
      items.forEach((item) => {
        const dom = item.render(view).dom; // view가 여기서 전달됨
        menu.appendChild(dom);
      });

      // 토글
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        menu.classList.toggle("hidden");
      });

      return wrap;
    },
  });

  return dropdown;
}
