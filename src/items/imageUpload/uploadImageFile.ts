export async function uploadImageFile(file: File): Promise<string> {
  const uploadUrl = (window as any).uploadImageUrl;
  const uploadHeader = (window as any).uploadImageHeader;
  const uploadRequestParam = (window as any).uploadImageRequestParam;
  const uploadResponseKey = (window as any).uploadImageResponseKey;

  if (typeof uploadRequestParam === "string" && typeof uploadUrl === "string" && uploadUrl.length > 0) {
    const formData = new FormData();
    formData.append(uploadRequestParam, file);

    const response = await fetch(uploadUrl, {
      headers: uploadHeader,
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`이미지 업로드 실패 (status ${response.status})`);
    }

    const contentType = response.headers.get("content-type") || "";
    let uploadedUrl: string;

    if (contentType.includes("application/json")) {
      const result = await response.json();
      if (uploadResponseKey && result?.[uploadResponseKey]) {
        uploadedUrl = result[uploadResponseKey];
      } else {
        throw new Error("JSON 응답에 이미지 URL이 없습니다.");
      }
    } else {
      const result = await response.text();
      if (typeof result === "string" && result.trim().length > 0) {
        uploadedUrl = result.trim();
      } else {
        throw new Error("응답에 이미지 URL이 없습니다.");
      }
    }

    return uploadedUrl;
  }

  // 기본 mock 동작
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      resolve(mockUrl);
    }, 1500);
  });
}
