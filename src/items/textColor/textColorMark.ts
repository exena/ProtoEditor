import type { MarkSpec } from 'prosemirror-model';

// 스키마 선언시 넣어주는 용도
export const textColorMark: MarkSpec = {
  attrs: {
    color: {},
  },
  parseDOM: [
    {
      style: 'color',
      getAttrs: (value) => ({ color: value }),
    },
  ],
  toDOM(mark) {
    return ['span', { style: `color: ${mark.attrs.color}` }, 0];
  },
};