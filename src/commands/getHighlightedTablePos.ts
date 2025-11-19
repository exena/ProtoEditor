import { EditorState } from "prosemirror-state";
import { selectedTablePluginKey } from "../plugin/selectedTablePlugin"

export function getHighlightedTablePos(state: EditorState) {
  const pluginState = selectedTablePluginKey.getState(state);
  if (!pluginState) return null;

  return pluginState.selectedPos ?? null;
}
