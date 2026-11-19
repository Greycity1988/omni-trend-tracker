# Omni Trend Tracker (옴니 트렌드 트래커)

> **네이버 데이터랩 • 구글 트렌드**의 검색 관심도를 일·주·월 단위로 한 화면에서 비교하는 대시보드.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.165-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 🎯 주요 기능

1. **통합 트렌드 대시보드**
   - 키워드 하나로 네이버와 구글의 관심도를 0~100 지수로 맞춰 한 차트에 겹쳐 봅니다.
   - **일 · 주 · 월** 단위를 고를 수 있습니다. 모두 끝난 기간만 집계하고, 변화율은 직전 기간과 비교합니다.

     | 단위 | 기간 | 네이버 | 구글 |
     |---|---|---|---|
     | 일 | 최근 30일 (어제까지) | 일별 | 일별 |
     | 주 | 최근 52주 (월~일, 지난주까지) | 주별 | 주별 (일~토 주를 다음 월요일 주로 맞춤) |
     | 월 | 최근 12개월 (지난달까지) | 월별 | 주별 값을 달마다 평균 |

   - 채널별 카드에 지금 지수, 직전 기간 대비 변화, 연관 키워드를 보여 줍니다.
   - API 키가 없거나 조회에 실패한 채널은 **예시 데이터**로 표시하고, 화면에 예시라고 밝힙니다.
2. **채널별 데이터**

   | 채널 | 출처 | 필요한 설정 |
   |---|---|---|
   | 네이버 | 네이버 데이터랩 검색어 트렌드 API (하루 1,000회 무료) | `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` |
   | 구글 | Google Trends (pytrends) | 없음 |

   - 두 채널 모두 **상대 지수**입니다. 실제 검색 건수는 나오지 않습니다.
   - 구글은 짧은 시간에 많이 조회하면 잠시 막습니다(429). 그동안은 예시 데이터로 표시되고 잠시 뒤 다시 조회합니다. 성공한 조회는 같은 키워드·단위로 10분간 캐시합니다.
   - 인스타그램은 2026-11-19에 뺐습니다. Meta 광고 라이브러리 API는 EU 밖에서는 정치·사회 이슈 광고만 돌려줘서 국내 상업 광고 추이를 만들 수 없습니다.
3. **정밀 분석 스튜디오**
   - **네이버 데이터랩:** 키워드 그룹 최대 5개, 기간·단위, 기기(PC/모바일)·성별·연령 필터를 골라 비교합니다.
   - **구글 트렌드:** 키워드 여러 개를 기간·지역·검색 유형(웹, 유튜브, 쇼핑 등)별로 비교하고, 최고점과 평균을 보여 줍니다.
4. **라이트 / 다크 모드**와 마케팅 인텔리전스 스위트(ACV, CAL, BEP Master) 공통 메뉴·푸터.
5. **건의하기:** 화면 아래 "Feedbacks & feature ideas"를 누르면 내용이 채워진 GitHub 이슈 작성 화면이 열립니다.

---

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python 3.10+ (3.12에서 테스트), FastAPI, Uvicorn, Pytrends, Pandas, Pydantic, HTTPX, Requests
- **Architecture**: Monorepo (`frontend/`, `backend/`)

---

## 🚀 로컬 실행 방법

### 1. 백엔드 실행 (FastAPI)
```bash
cd backend
python3 -m venv .venv   # Python 3.10 이상 (macOS 기본 3.9는 안 됩니다)
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # 선택: 위 표의 키를 넣으면 해당 채널이 실제 데이터로 바뀝니다.
python run.py
# Backend API: http://localhost:8000
```

테스트: `cd backend && pip install pytest && python -m pytest -q`

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
