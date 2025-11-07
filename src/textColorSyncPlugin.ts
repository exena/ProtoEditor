// textColorSyncPlugin.ts
import { Plugin } from 'prosemirror-state';
import type ColorPicker from 'tui-color-picker';

export const createTextColorSyncPlugin = (colorPicker: ColorPicker) =>
  new Plugin({
    view(editorView) {
      return {
        update(view, prevState) {
          // selection이 바뀌지 않으면 패스
          if (view.state.selection.eq(prevState.selection)) return;

          const { from, to } = view.state.selection;
          let color: string | null = null;

          view.state.doc.nodesBetween(from, to, (node) => {
            node.marks.forEach((mark) => {
              if (mark.type.name === 'textColor') {
                color = mark.attrs.color;
              }
            });
          });

          if (color) {
            colorPicker.setColor(color);
          }
        },
      };
    },
  });
