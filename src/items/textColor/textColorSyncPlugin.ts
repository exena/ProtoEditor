// textColorSyncPlugin.ts
import { Plugin } from 'prosemirror-state';
import type ColorPicker from 'tui-color-picker';

/**
 * selection이 바뀔 때 ColorPicker의 색상을 자동으로 동기화하는 플러그인
 */
export const createTextColorSyncPlugin = (colorPicker: ColorPicker) =>
  new Plugin({
    view(_editorView) {
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
            try {
              colorPicker.setColor(color);
            } catch {
              // 일부 버전의 tui-color-picker는 setColor 인자 형태가 다를 수 있음
            }
          }
        },
      };
    },
  });
