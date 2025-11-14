import type { MarkSpec } from 'prosemirror-model';

export const strikeMark: MarkSpec = {
  // HTML로 렌더링할 때 <s> 태그 사용
  toDOM: () => ["s", 0],

  // HTML을 파싱할 때 <s> 태그를 strike 마크로 변환
  parseDOM: [
    { tag: "s" },             // <s> 태그
    { style: "text-decoration", getAttrs: (value) => value === "line-through" ? {} : false } // CSS 스타일
  ]
};