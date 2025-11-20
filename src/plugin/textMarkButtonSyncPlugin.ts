// textColorSyncPlugin.ts
import { Plugin } from 'prosemirror-state';

/**
 * selection이 바뀔 때 ColorPicker의 색상을 자동으로 동기화하는 플러그인
 */
export const textMarkButtonSyncPlugin = new Plugin({
  view(_editorView) {
    return {
      update(view, prevState) {
        // selection이 바뀌지 않으면 패스
        if (view.state.selection.eq(prevState.selection)) return;

        const { from, to } = view.state.selection;
        let strong = false;
        let strike = false;
        let italic = false;

        view.state.doc.nodesBetween(from, to, (node) => {
          node.marks.forEach((mark) => {
            if (mark.type.name === 'strong') {
              strong = true;
            }
            if (mark.type.name === 'strike') {
              strike = true;
            }
            if (mark.type.name === 'em') {
              italic = true;
            }
          });
        });

        const boldIconInDom = document.querySelector('#boldIcon')as HTMLElement | null;
        const strikeIconInDom = document.querySelector('#strikeIcon')as HTMLElement | null;
        const italicIconInDom = document.querySelector('#italicIcon')as HTMLElement | null;
        if (boldIconInDom) {
          boldIconInDom.style.color = strong ? "black" : "currentColor";
        }
        if (strikeIconInDom) {
          strikeIconInDom.style.color = strike ? "black" : "currentColor";
        }
        if (italicIconInDom) {
          italicIconInDom.style.color = italic ? "black" : "currentColor";
        }
      },
    };
  },
});