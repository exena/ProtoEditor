import ColorPicker from "tui-color-picker";
import "tui-color-picker/dist/tui-color-picker.css";

export function createPicker() {
  const pickerContainer = document.createElement("div");
  pickerContainer.style.position = "absolute";
  pickerContainer.style.display = "none";
  pickerContainer.style.zIndex = "1000";
  pickerContainer.style.border = "1px solid #ccc";
  pickerContainer.style.background = "white";
  pickerContainer.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  pickerContainer.style.padding = "8px";
  document.body.appendChild(pickerContainer);

  const colorPicker = ColorPicker.create({
    container: pickerContainer,
    color: "#000000",
  });

  return { colorPicker, pickerContainer };
}
