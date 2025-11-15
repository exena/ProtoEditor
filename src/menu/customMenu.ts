import { Schema } from "prosemirror-model";
import {
  createBoldItem,
  createItalicItem,
  createStrikeItem,
  createHeadingDropdown,
} from "../items"
import { createTextColorComponents } from "../items/textColor";
import { createImageUploadMenuComponents } from "../items/imageUpload/imageUploadMenu";

export function createCustomMenu(schema: Schema) {
  const { marks } = schema;

  const bold = createBoldItem(marks.strong);
  const italic = createItalicItem(marks.em);
  const strike = createStrikeItem(marks.strike);
  const headingDropdown = createHeadingDropdown(schema.nodes.heading, [1, 2, 3, 4]);

  const { textColorItem, palleteSyncPlugin, buttonSyncPlugin } = createTextColorComponents();
  const { imageUploadMenuItem, placeholderPlugin } = createImageUploadMenuComponents();

  // === 메뉴 묶음 ===
  const customMenu = [[headingDropdown, bold, italic, strike, textColorItem, imageUploadMenuItem]]

  // const menu = buildMenuItems(mySchema);
  // menu.inlineMenu[0].push(textColorItem, imageUploadMenuItem);
  // const customMenu = menu.fullMenu;

  const plugins = [palleteSyncPlugin, buttonSyncPlugin, placeholderPlugin];

  return { customMenu, plugins };
}
