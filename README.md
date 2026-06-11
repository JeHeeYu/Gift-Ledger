# 축의대 명부

여러 노트북에서 동시에 접수할 수 있는 축의대 운영 화면입니다. Firebase 설정이 있으면 Firestore 실시간 동기화로 동작하고, 설정이 없으면 브라우저 로컬 저장소로 동작합니다.

## 실행

```bash
npm install
npm run dev
```

## Firebase 설정

1. Firebase Console에서 프로젝트를 만듭니다.
2. Web app을 등록하고 Firebase config 값을 확인합니다.
3. Authentication에서 Anonymous provider를 활성화합니다.
4. Firestore Database를 생성합니다.
5. `firestore.rules` 내용을 Firestore Rules에 배포합니다.
6. `.env.example`을 참고해서 `.env.local`을 만듭니다.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GIFT_DESK_EVENT_ID=wedding-2026-06-12
```

모든 노트북은 같은 `.env.local`과 같은 `VITE_GIFT_DESK_EVENT_ID`를 사용해야 같은 명부를 봅니다.

## 현장 체크

- 헤더에 `Firebase / 실시간 동기화 중`이 보이면 여러 기기 동기화 상태입니다.
- `Local / Firebase 설정 없음`이면 해당 노트북에만 저장됩니다.
- CSV 버튼으로 마감용 엑셀 파일을 받을 수 있습니다.
- 인쇄 버튼은 현재 명부를 마감 출력용으로 인쇄합니다.
