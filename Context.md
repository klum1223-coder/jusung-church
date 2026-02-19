# 🏛️ PROJECT: 주성교회(Jusung Church) 웹사이트 리뉴얼

## 1. 프로젝트 개요 (Overview)
- **저장소(Repo):** `https://github.com/klum1223-coder/jusung-church.git`
- **배포 주소:** (Vercel에서 생성된 도메인, 예: jusung-church.vercel.app)
- **목표:** 텍스트 중심의 매거진 스타일, 관리자 페이지가 포함된 교회 홈페이지.
- **핵심 가치:** 가독성, 여백의 미, 모바일 반응형, 쉬운 관리.

## 2. 기술 스택 (Tech Stack) - 🏗️ 중요!
- **프론트엔드:** [React / Next.js 등 확인 필요 - 파일 확장자가 .jsx나 .tsx면 Next.js임]
- **배포(Hosting):** **Vercel** (GitHub 연동 자동 배포)
- **백엔드/DB:** **Firebase** (데이터 저장 및 관리자 기능)
- **인증(Auth):** **Google Cloud Console** (구글 로그인 등 OAuth 연결)
- **코드 관리:** GitHub

## 3. 현재 문제점 (Current Blocker) - 🚨 Vercel 배포 에러
- **상황:** 깃허브에 코드를 푸시(Push)하면 Vercel에서 배포(Build)가 실패함.
- **예상 원인:** 1. Firebase/Google Cloud 관련 **환경 변수(Environment Variables)**가 Vercel 설정에 누락되었을 가능성 높음.
    2. 빌드 과정에서 의존성 패키지 충돌.
- **로그 확인 위치:** Vercel 대시보드 -> Project -> Deployments -> Failed 상태 클릭 -> 'Build Logs'

## 4. 해결해야 할 과제 (To-Do)
1.  **Vercel 배포 정상화:** 에러 로그를 분석하여 빌드 성공시키기.
2.  **환경 변수 점검:** `.env` 파일에 있는 Firebase API Key들이 Vercel 대시보드 [Settings] -> [Environment Variables]에 똑같이 등록되어 있는지 확인.
3.  **관리자 로그인 연동:** 배포된 환경에서도 구글 로그인이 정상 작동하도록 Google Cloud Console에서 '승인된 리디렉션 URI'에 Vercel 도메인 추가.

## 5. AI 에이전트 행동 수칙 (Instruction)
- **Inspector 에이전트:** 사용자가 제공할 'Vercel 빌드 로그'를 분석하여 환경 변수 누락인지 코드 오류인지 판별할 것.
- **Coder 에이전트:** `firebase.json` 설정이나 `next.config.js` 등 설정 파일의 오류를 수정할 것.

---
*Last Updated: 2026-02-16*