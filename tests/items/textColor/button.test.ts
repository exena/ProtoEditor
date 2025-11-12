import { fireEvent } from "@testing-library/dom";
import { createTextColorButton } from "../../../src/items/textColor/button";
import { setupEditorForTest, createHiddenContainer } from "../../utils/setUpEditorForTest";

(window as any).translate = (s: string) => s; // ✅ 추가

test("clicking text color button opens color picker", () => {
  const picker = createHiddenContainer();

  const colorPicker = { on: jest.fn(), off: jest.fn() };
  const { textColorItem } = createTextColorButton(colorPicker, picker);

  const setup = setupEditorForTest();
  const mockView = setup.view;
  const rendered = textColorItem.render(mockView);
  const button = rendered.dom;
  document.body.appendChild(button);

  fireEvent.mouseDown(button);

  expect(picker.style.display).toBe("block");
});
