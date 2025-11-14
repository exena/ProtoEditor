/**
 * @jest-environment jsdom
 */
import { uploadImageFile } from "../../../src/items/imageUpload/uploadImageFile";

describe("uploadImageFile - fetch branch", () => {
  let originalUploadUrl: any;
  let originalUploadRequestParam: any;
  let originalUploadResponseKey: any;
  let originalUploadHeader: any;

  beforeEach(() => {
    // Window 설정 저장
    originalUploadUrl = (window as any).uploadImageUrl;
    originalUploadRequestParam = (window as any).uploadImageRequestParam;
    originalUploadResponseKey = (window as any).uploadImageResponseKey;
    originalUploadHeader = (window as any).uploadImageHeader;

    // 기본 설정
    (window as any).uploadImageUrl = "/upload";
    (window as any).uploadImageRequestParam = "file";
    (window as any).uploadImageHeader = { "X-Test": "test" };

    jest.clearAllMocks();

    Object.defineProperty(window, "fetch", {
      writable: true,
      value: jest.fn(),
    });
  });

  afterEach(() => {
    // Window 원래 값 복원
    (window as any).uploadImageUrl = originalUploadUrl;
    (window as any).uploadImageRequestParam = originalUploadRequestParam;
    (window as any).uploadImageResponseKey = originalUploadResponseKey;
    (window as any).uploadImageHeader = originalUploadHeader;
  });

  const mockFile = new File(["dummy"], "image.png", { type: "image/png" });

  // ----------------------
  // 1. JSON 응답 성공 테스트
  // ----------------------
  test("uploads via fetch and parses JSON response", async () => {
    (window as any).uploadImageResponseKey = "url";

    const fetchMock = jest.spyOn(global, "fetch" as any).mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({ url: "http://uploaded.com/img.png" }),
    });

    const result = await uploadImageFile(mockFile);

    expect(fetchMock).toHaveBeenCalled();
    expect(result).toBe("http://uploaded.com/img.png");
  });

  // ----------------------
  // 2. text 응답 성공 테스트
  // ----------------------
  test("uploads via fetch and parses text response", async () => {
    // uploadResponseKey를 주지 않음 → text 브랜치로
    (window as any).uploadImageResponseKey = undefined;

    const fetchMock = jest.spyOn(global, "fetch" as any).mockResolvedValue({
      ok: true,
      headers: {
        get: () => "text/plain",
      },
      text: async () => "http://uploaded.com/img2.png",
    });

    const result = await uploadImageFile(mockFile);

    expect(fetchMock).toHaveBeenCalled();
    expect(result).toBe("http://uploaded.com/img2.png");
  });

  // ----------------------
  // 3. response.ok = false → 에러
  // ----------------------
  test("throws error when response is not ok", async () => {
    jest.spyOn(global, "fetch" as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(uploadImageFile(mockFile)).rejects.toThrow(
      "이미지 업로드 실패 (status 500)"
    );
  });

  // ----------------------
  // 4. JSON 응답이지만 key 없음 → 에러
  // ----------------------
  test("throws error when JSON response missing expected URL key", async () => {
    (window as any).uploadImageResponseKey = "url";

    jest.spyOn(global, "fetch" as any).mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => ({ wrongKey: "nope" }),
    });

    await expect(uploadImageFile(mockFile)).rejects.toThrow(
      "JSON 응답에 이미지 URL이 없습니다."
    );
  });
});
