# ProtoEditor
<img width="1536" height="1024" alt="ChatGPT Image 2025년 11월 11일 오후 03_15_14" src="https://github.com/user-attachments/assets/57d0a2e6-bfcd-47bc-b39d-f6474f497f65" />

글 작성에 사용하는 WYSIWYG 에디터입니다.

### 기능 목록

- [x]  HTML로 내용 추출해서 글 submit하기
- [x]  글자 색 변경
- [ ]  폰트 크기 변경
- [X]  기울임
- [X]  굵게
- [ ]  밑줄
- [X]  취소선
- [x]  이미지 삽입 구현하기
- [x]  이미지 POST 메서드로 업로드하고 URL 받아오기
- [X]  미리보기 사이트에서 바로 사용해볼 수 있도록 만들기

### 미리보기
[CodeSandbox.io](https://codesandbox.io/p/github/exena/ProtoEditor/main?import=true)

### 사용방법(CDN)
1.
```
<link rel="stylesheet" href="https://exena.github.io/ProtoEditor/protoeditor.css">
<script src="https://exena.github.io/ProtoEditor/protoeditor.js"></script>
```
위 스크립트를 에디터를 사용하고자 하는 html 파일에 넣습니다.

2.
```
<div id="editor"></div>
```
에디터가 들어가야 하는 곳에 위 div를 넣습니다.

3.

```
<input id="content" type="hidden"></input>
```
전송해야 하는 form이 있다면 이렇게 hidden input을 넣습니다.
에디터의 내용이 html 형태로 실시간으로 복사되어 들어갑니다.

### 이미지 업로드
1. 서버에서 이미지 업로드를 요청받는 url과 RequestParam 값을 외부에서 지정해주세요.
```
window.uploadImageUrl
window.uploadImageRequestParam
```

2. 추가로 CSRF 토큰이 필요한 경우 헤더와 서버에서 JSON으로 응답하는 경우 응답 키도 지정할 수 있습니다.
```
window.uploadImageHeader
window.uploadImageResponseKey
```

3. 혹은 이미지 업로드 함수 자체를 외부에서 주입할 수도 있습니다. 이 경우 파일 탐색기를 띄우는 역할까지 해당 함수에 위임됩니다.
```
window.openPopupImageUpload
```

### 사용된 라이브러리
Node.js, Vite, ProseMirror, tui-color-picker

