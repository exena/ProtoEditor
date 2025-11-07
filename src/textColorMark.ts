import type { MarkSpec } from 'prosemirror-model';

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