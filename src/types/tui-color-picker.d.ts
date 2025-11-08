declare module 'tui-color-picker' {
  interface ColorPickerOptions {
    container: HTMLElement;
    color?: string;
    preset?: string[];
    usageStatistics?: boolean;
    cssPrefix?: string;
    detailTxt?: string;
  }

  interface SelectedColorInfo {
    color: string;
    origin?: string;
  }

  type SelectColorHandler = (info: SelectedColorInfo | string) => void;

  export default class ColorPicker {
    constructor(options: ColorPickerOptions);
    static create(options: ColorPickerOptions): ColorPicker;

    // 기존 문서에 있는 메서드
    getColor(): string;
    setColor(hex: string): void;
    toggle(isShow?: boolean): void;
    destroy(): void;

    // 이벤트 관련 (추가)
    on(event: 'selectColor', handler: SelectColorHandler): void;
    off(event: 'selectColor', handler?: SelectColorHandler): void;
  }
}
