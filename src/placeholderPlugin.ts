import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { EditorState } from 'prosemirror-state';

export const placeholderPluginKey = new PluginKey<DecorationSet>("image-upload-placeholder");

export const placeholderPlugin = new Plugin<DecorationSet>({
  key: placeholderPluginKey,
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, old) {
      let set = old.map(tr.mapping, tr.doc);

      const action = tr.getMeta(placeholderPluginKey);
      if (action && action.add) {
        const widget = document.createElement("img");
        widget.src = action.add.src || "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA=="; // 투명 placeholder
        widget.className = "image-upload-placeholder";

        const deco = Decoration.widget(action.add.pos, widget, { id: action.add.id });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(
          set.find(undefined, undefined, spec => spec.id === action.remove.id)
        );
      }

      return set;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});

/**
 * placeholderPluginKey로부터 특정 ID의 placeholder 위치를 찾는 함수
 */
export function findPlaceholder(
  state: EditorState,
  id: unknown
): number | null {
  const decos = placeholderPluginKey.getState(state);
  if (!decos) return null;

  const found = decos.find(undefined, undefined, (spec: any) => spec.id === id);
  return found.length ? found[0].from : null;
}