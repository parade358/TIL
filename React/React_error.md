

**"npx command not found " 에러**

- 터미널 다시 껐다 켜보기.

- 대부분 nodejs 제대로 설치 안하거나 옛날 버전이라서 그럼.

- 맥북이면 brew 쓰지 말고 직접 다운.

- 윈도우는 C 드라이브에 설치.

- 리눅스는 알아서 nodejs 설치나 버전 업데이트 명령어 잘 입력하자.

  

**맥북 "permission 없음" 에러**

- 프로젝트 생성시 저런 에러가 뜨면 터미널 열기

- **sudo npx create-react-app blog** 입력

- 비번입력하라고 하면 맥북 비번 입력

  

**윈도우 "허가되지 않은 스크립트 입니다 " 에러**

- 윈도우 하단 검색메뉴에서 **Powershell 검색 - 우클릭 - 관리자 권한**으로 실행

- **Set-ExecutionPolicy Unrestricted **입력

- 그 다음에 뭐 선택하라고 하면 y 누르고 엔터

  

**The engine "node" is incompatible with this module 에러**

- npx로 설치시 이런 에러가 있을 수 있습니다. nodejs 버전이 낮거나 너무 높다는 뜻

- nodejs를 요구하는 버전으로 재설치.

  

**npm 어쩌구 입력시 안되면**

- https://imspear.tistory.com/31 참고해서 환경변수 등록.

  

**윈도우인데 터미널에서 안되면**

- 보안프로그램 끄기. ex) Ahnlab security

- 작업폴더를 오픈한 다음 파일 - Powershell 열기 - 관리자권한으로 열기 누른 다음 거기서 프로젝트 생성해봅시다.

  

**그래도 뭔가 안되면**

- npm create vite@latest 명령어로 vite 써서 설치.

- 설치 후엔 프로젝트 폴더 오픈해서 터미널에서 npm install.

- 미리보기 시작 명령어는 npm run dev.

- 이외에도 에러 경우의 수가 매우 많기 때문에 정확한 에러메시지 직접 검색이 답.

  

**(참고)**

버전에러 등으로 강의와 같은 리액트 버전에서 코딩하고 싶다면

1. 하단 첨부파일을 압축푸신 뒤에 그 폴더를 에디터로 오픈.
2. 에디터 상단에서 Terminal - New Terminal 오픈하신 다음 npm install 을 입력하면 필요한 라이브러리들이 설치.