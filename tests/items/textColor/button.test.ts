import { fireEvent } from "@testing-library/dom";
import { createTextColorButton } from "../../../src/items/textColor/textColorItem";
import { setupEditorForTextColorTest, createHiddenContainer } from "../../utils/setUpEditorForTextColorTest";

test("글자색 버튼을 누르면 컬러 팔레트가 나타난다.", () => {
  const picker = createHiddenContainer();

  const colorPicker = { on: jest.fn(), off: jest.fn() };
  const { textColorItem } = createTextColorButton(colorPicker, picker);

  const setup = setupEditorForTextColorTest();
  const mockView = setup.view;
  const rendered = textColorItem.render(mockView);
  const button = rendered.dom;
  document.body.appendChild(button);

  fireEvent.mouseDown(button);

  expect(picker.style.display).toBe("block");
  expect(colorPicker.on).toHaveBeenCalled();
  expect(colorPicker.off).toHaveBeenCalled();
});