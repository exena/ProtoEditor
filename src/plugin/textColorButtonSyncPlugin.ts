import { Plugin, PluginView } from 'prosemirror-state';
// =====================
// Plugin: selection 변경 감지 → 버튼 색 업데이트 / colorPicker.setColor
// =====================
export const createTextColorButtonSyncPlugin = () => 
  new Plugin({
    view(_view): PluginView {
      // view()는 PluginView를 반환. 여기선 plugin-level data를 유지할 필요 없음.
      return {
        update(currentView, prevState) {
            // selection이 안 바뀌었다면 무시
            if (!prevState || currentView.state.selection.eq(prevState.selection)) return;

            // 선택/커서에서 textColor 마크 검사
            const { from, to, empty } = currentView.state.selection;
            let activeColor: string | null = null;

            if (!empty) {
            currentView.state.doc.nodesBetween(from, to, (node) => {
              if (!node.isText) return;
              node.marks.forEach((mark) => {
              if (mark.type.name === "textColor") activeColor = mark.attrs.color;
              });
            });
            } else {
              // 커서 위치: storedMarks 또는 $from.marks()
              const storedMarks = currentView.state.storedMarks || currentView.state.selection.$from.marks();
              storedMarks.forEach((m) => {
                if (m.type.name === "textColor") activeColor = m.attrs.color;
              });
            }

            // 버튼 DOM 찾기 (menu가 렌더링한 DOM 내부의 iconSpan 복사본을 찾음)
            // prosemirror-menu가 icon DOM을 버튼 내부에 넣을 때 iconSpan에 data-attr가 복사되므로 그걸 찾는다.
            const iconInDom = document.querySelector('[data-text-color-button]') as HTMLElement | null;
            if (iconInDom) {
              iconInDom.style.color = activeColor || "#000";
            }
        },
      };
    },
  });