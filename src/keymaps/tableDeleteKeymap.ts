import { keymap } from "prosemirror-keymap";
import { deleteTableCommand } from "../commands/deleteTable"; // 직접 만들 함수

export const tableDeleteKeymap = keymap({
  "Backspace": deleteTableCommand,
  "Delete": deleteTableCommand
});