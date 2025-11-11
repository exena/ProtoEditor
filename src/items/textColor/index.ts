// items/textColor/index.ts
import { createPicker } from "./pickerSetup";
import { createTextColorButton } from "./button";
import { createTextColorSyncPlugin } from "./textColorSyncPlugin";
import { createTextButtonColorSyncPlugin } from "./textButtonColorSyncPlugin";

export function createTextColorComponents() {
  const { colorPicker, pickerContainer } = createPicker();
  const { textColorItem, iconSpan } = createTextColorButton(colorPicker, pickerContainer);

  const palleteSyncPlugin = createTextColorSyncPlugin(colorPicker);
  const buttonSyncPlugin = createTextButtonColorSyncPlugin(colorPicker);

  return { textColorItem, palleteSyncPlugin, buttonSyncPlugin };
}
