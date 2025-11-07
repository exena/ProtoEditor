declare module 'tui-color-picker' {
  interface ColorPickerOptions {
    container: HTMLElement;
    color?: string;
  }

  interface SelectedColorInfo {
    color: string;
    origin: 'palette' | 'manual' | string;
  }

  export default class ColorPicker {
    static create(options: ColorPickerOptions): ColorPicker;
    on(event: 'selectColor', callback: (colorInfo: SelectedColorInfo) => void): void;
    getColor(): string;
    setColor(color: string): void;
  }
}
