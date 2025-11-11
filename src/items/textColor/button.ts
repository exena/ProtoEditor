import { MenuItem } from "prosemirror-menu";
import { EditorView } from "prosemirror-view";
import { setTextColor } from "./setTextColor";

export function createTextColorButton(colorPicker: any, pickerContainer: HTMLElement) {
  const iconSpan = document.createElement("span");
  iconSpan.textContent = "A";
  iconSpan.style.fontWeight = "bold";
  iconSpan.style.fontSize = "16px";
  iconSpan.style.lineHeight = "20px";
  iconSpan.style.color = "#000";
  iconSpan.setAttribute("data-text-color-button", "1");

  const textColorItem = new MenuItem({
    title: "텍스트 색상",
    run(_state, _dispatch, view: EditorView) {
      const btn = document.querySelector('[data-text-color-button]') as HTMLElement | null;
      const rect = (btn && btn.getBoundingClientRect()) || (view.dom as HTMLElement).getBoundingClientRect();

      pickerContainer.style.left = `${rect.left}px`;
      pickerContainer.style.top = `${rect.bottom + 6}px`;
      pickerContainer.style.display = "block";

      colorPicker.off("selectColor");
      colorPicker.on("selectColor", (ev: any) => {
        const color = typeof ev === "string" ? ev : ev?.color;
        if (color) {
          setTextColor(color)(view.state, view.dispatch);
          const icon = document.querySelector('[data-text-color-button]') as HTMLElement | null;
          if (icon) icon.style.color = color;
        }
        pickerContainer.style.display = "none";
        view.focus();
      });
    },
    render(_view: EditorView): HTMLElement {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "text-color-btn";
      btn.appendChild(iconSpan);

      document.addEventListener("click", (e) => {
        if (!pickerContainer.contains(e.target as Node) && !btn.contains(e.target as Node))
          pickerContainer.style.display = "none";
      });

      return btn;
    },
  });

  return { textColorItem, iconSpan };
}
