# Omni Trend Tracker (옴니 트렌드 트래커)

> **네이버 데이터랩 • 구글 트렌드 • 메타 인스타그램**의 검색·광고 트렌드를 한 화면에서 비교하는 대시보드. 핀터레스트는 토큰을 넣고 켜야 쓸 수 있습니다.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 🎯 주요 기능

1. **통합 트렌드 대시보드**
   - 키워드 하나로 채널별 관심도를 0~100 지수로 맞춰 한 차트에 겹쳐 봅니다.
   - 채널별 카드에 지금 지수, 직전 기간 대비 변화, 연관 키워드를 보여 줍니다.
   - API 키가 없거나 조회에 실패한 채널은 **예시 데이터**로 표시하고, 화면에 예시라고 밝힙니다.
2. **채널별 데이터**

   | 채널 | 출처 | 단위 | 변화율 기준 | 필요한 설정 |
   |---|---|---|---|---|
   | 네이버 | 네이버 데이터랩 검색어 트렌드 API | 월 | 끝난 달 기준 전월 대비 | `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` |
   | 구글 | Google Trends (pytrends) | 주 | 끝난 주 기준 직전 주 대비 (진행 중인 주는 뺌) | 없음 |
   | 인스타그램 | Meta 광고 라이브러리 | 실시간 수집 | 국내 인스타그램 광고 수집량 | `META_ACCESS_TOKEN` (선택: `META_APP_ID`, `META_APP_SECRET`로 60일 토큰 자동 연장) |
   | 핀터레스트 | Pinterest API v5 Trends | 월 | 전월 대비 | `PINTEREST_ACCESS_TOKEN`, `ENABLED_PLATFORMS`에 `pinterest` 추가 |

   - 네이버 데이터랩은 **상대 지수**만 제공합니다. 실제 검색 건수, 성별·연령 비중은 통합 대시보드에 나오지 않습니다.
3. **정밀 분석 스튜디오**
   - **네이버 데이터랩:** 키워드 그룹 최대 5개, 기간·단위, 기기(PC/모바일)·성별·연령 필터를 골라 비교합니다.
   - **구글 트렌드:** 키워드 여러 개를 기간·지역·검색 유형(웹, 유튜브, 쇼핑 등)별로 비교하고, 최고점과 평균을 보여 줍니다.
   - **인스타그램:** 키워드나 브랜드별 광고 수, 주요 광고주, 집행 상태를 비교합니다.
4. **라이트 / 다크 모드**와 마케팅 인텔리전스 스위트(ACV, CAL, BEP Master) 공통 메뉴·푸터.
5. **건의하기:** 화면 아래 "Feedbacks & feature ideas"를 누르면 내용이 채워진 GitHub 이슈 작성 화면이 열립니다.

---

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pytrends, Pandas, Pydantic, HTTPX, Requests
- **Architecture**: Monorepo (`frontend/`, `backend/`)

---

## 🚀 로컬 실행 방법

### 1. 백엔드 실행 (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# 선택: backend/.env 에 위 표의 키를 넣으면 해당 채널이 실제 데이터로 바뀝니다.
python run.py
# Backend API: http://localhost:8000
```

테스트: `cd backend && python -m pytest -q`

### 2. 프론트엔드 실행 (Vite)
```bash
cd frontend
npm install
npm run dev
# Frontend Web: http://localhost:5174
```

---

## 📄 License
MIT License. Crafted in 2026 by Owen O. Magnus.
