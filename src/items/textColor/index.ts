// items/textColor/index.ts
import { createPicker } from "./pickerSetup";
import { createTextColorButton } from "./button";
import { createTextColorPaletteSyncPlugin } from "./textColorPaletteSyncPlugin";
import { createTextColorButtonSyncPlugin } from "./textColorButtonSyncPlugin";

export function createTextColorComponents() {
  const { colorPicker, pickerContainer } = createPicker();
  const { textColorItem } = createTextColorButton(colorPicker, pickerContainer);

  const palleteSyncPlugin = createTextColorPaletteSyncPlugin(colorPicker);
  const buttonSyncPlugin = createTextColorButtonSyncPlugin();

  return { textColorItem, palleteSyncPlugin, buttonSyncPlugin };
}
