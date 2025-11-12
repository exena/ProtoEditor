/**
 * @jest-environment jsdom
 */
import { fireEvent } from "@testing-library/dom";
import { createTextColorButton } from "../../../src/items/textColor/button";
import { setupEditorForTest, createHiddenContainer } from "../../utils/setUpEditorForTest";

describe("TextColorButton", () => {
  let view: any;
  let cleanup: () => void;
  let pickerContainer: HTMLElement;
  let colorPickerMock: any;

  beforeEach(() => {
    const setup = setupEditorForTest();
    view = setup.view;
    cleanup = setup.cleanup;

    pickerContainer = createHiddenContainer();

    colorPickerMock = {
      on: jest.fn(),
      off: jest.fn(),
    };
  });

  afterEach(() => {
    cleanup();
  });

  test("버튼 클릭 시 색상 선택기가 표시된다", () => {
    // ✅ 실제 버튼 생성
    const { textColorItem } = createTextColorButton(colorPickerMock, pickerContainer);
    const { dom: button } = textColorItem.render(view);// render()는 { dom, update }를 반환함
    document.body.appendChild(button);

    // ✅ 버튼 클릭 이벤트 발생
    fireEvent.mouseDown(button);

    // ✅ 기대: pickerContainer가 표시 상태로 바뀜
    expect(pickerContainer.style.display).toBe("block");
    // ✅ colorPicker 이벤트 핸들러가 제대로 등록됨
    expect(colorPickerMock.off).toHaveBeenCalled();
    expect(colorPickerMock.on).toHaveBeenCalled();
  });
});