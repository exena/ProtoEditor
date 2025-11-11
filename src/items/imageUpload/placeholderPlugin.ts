import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";
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
function findPlaceholder(
  state: EditorState,
  id: unknown
): number | null {
  const decos = placeholderPluginKey.getState(state);
  if (!decos) return null;

  const found = decos.find(undefined, undefined, (spec: any) => spec.id === id);
  return found.length ? found[0].from : null;
}

// Placeholder 삽입
export function insertPlaceholder(view: EditorView, id: any) {
  const { state, dispatch } = view;
  const tr = state.tr.setMeta(placeholderPluginKey, {
    add: { id, pos: view.state.selection.from },
  });
  dispatch(tr);
}

// Placeholder → 이미지로 교체
export function replacePlaceholderWithImage(view: EditorView, id: any, uploadedUrl: string) {
  const { state, dispatch } = view;
  const pos = findPlaceholder(state, id);

  // 업로드 완료 후 placeholder 위치 찾기
  if (pos == null) return;

  // 진짜 이미지로 교체
  const tr = state.tr.replaceWith(
    pos,
    pos,
    state.schema.nodes.image.create({ src: uploadedUrl })
  );
  tr.setMeta(placeholderPluginKey, { remove: { id } });
  dispatch(tr);
}

export function removePlaceholder(view: EditorView, id: any){
    const { state, dispatch } = view;
    dispatch(state.tr.setMeta(placeholderPluginKey, { remove: { id } }));
}