# ProtoEditor
<img width="593" height="106" alt="Design-Editor-11-14-2025_06_50_PM" src="https://github.com/user-attachments/assets/d5d262fb-1707-4dc6-a459-f968bd63b6fb" />

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
- [x]  글 정렬
- [x]  표 삽입
- [ ]  표 조작

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
[TOAST UI ColorPicker](https://github.com/nhn/tui.color-picker)

[ProseMirror](https://prosemirror.net/)

### Setup & Develop
1. 프로젝트 클론, 라이브러리 설치
```
$ git clone https://github.com/exena/ProtoEditor.git
$ npm install
```
- 노드가 설치되어 있어야 합니다. (개발된 버전인 v22 이전 버전의 경우 에러가 생길 수 있습니다.)

2. 실행, 빌드
```
$ npm run dev
$ npm run build
```

3. 테스트 실행
```
$ npx jest
```

