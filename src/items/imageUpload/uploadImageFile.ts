/**
 * 파일을 업로드하고 URL을 반환하는 함수
 */
export async function uploadImageFile(file: File): Promise<string> {
  // 외부에서 업로드용 URL이 지정되어 있으면 fetch 사용
  const uploadUrl = (window as any).uploadImageUrl; // 서버에서 이미지 업로드 요청을 받는 URL(필수)
  const uploadHeader = (window as any).uploadImageHeader; // 요청 헤더(CSRF 토큰을 넣기 위한 옵션)
  const uploadRequestParam = (window as any).uploadImageRequestParam; // 서버에서 formData 안의 파일을 읽을 때 쓰는 키(필수)
  const uploadResponseKey = (window as any).uploadImageResponseKey; // JSON 응답 키(옵션)

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
      // 서버에서 Json 응답이 올 경우
      const result = await response.json();
      if (uploadResponseKey && result?.[uploadResponseKey]) {
        uploadedUrl = result[uploadResponseKey];
      } else {
        throw new Error("JSON 응답에 이미지 URL이 없습니다.");
      }
    } else {
      // 서버에서 단순 URL 스트링 응답이 올 경우
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
