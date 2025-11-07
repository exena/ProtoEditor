import type { Command } from 'prosemirror-state';

export const setTextColor = (color: string): Command => (state, dispatch) => {
  const { schema, selection } = state;
  const { from, to } = selection;
  const markType = schema.marks.textColor;

  if (!markType) return false;
  if (!dispatch) return true;

  const tr = state.tr.addMark(from, to, markType.create({ color }));
  dispatch(tr);
  return true;
};