# Omni Trend Tracker (옴니 트렌드 트래커)

> **네이버 데이터랩 • 구글 트렌드 • 핀터레스트 트렌드 • 메타 인스타그램**의 4대 플랫폼 검색 쿼리량 및 트렌드를 단일 대시보드에서 통합 비교 분석하는 인텔리전스 시스템.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 🎯 주요 기능

1. **4대 채널 통합 검색 시계열 차트 (Unified Normalization Timeline)**
   - 네이버, 구글, 핀터레스트, 인스타그램의 지난 12개월 관심도 곡선을 동일한 0~100 스케일로 정규화하여 교차 비교.
2. **플랫폼별 세부 지표 분석**
   - **네이버 데이터랩**: 월간 추정 쿼리 건수(PC/MO 비중), 성별/연령대 탐색 비중.
   - **구글 트렌드 (pytrends)**: 국내외 검색 관심도 지수 및 주간/월간 모멘텀 증감률.
   - **핀터레스트 트렌드**: 라이프스타일/비주얼 무드보드 탐색 지수, 선행 시즈널 피크 구간 예측.
   - **메타 (인스타그램)**: 해시태그 누적 피드 수, 일일 신규 포스팅 및 바이럴 강도.
3. **크로스 플랫폼 연관 키워드 & 해시태그**
   - 4개 매체에서 함께 언급되는 연관 검색어와 상위 해시태그를 원클릭으로 취합.
4. **Northpoint Scandinavian Minimalist UI**
   - 웜 뉴트럴 캔버스(`#F8F8F6`)와 헤어라인 테두리, 부드러운 디퓨즈 섀도우를 갖춘 스위스/북유럽 감성의 B2B SaaS 대시보드.

---

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pytrends, Pydantic, HTTPX, Requests
- **Architecture**: Monorepo (`frontend/`, `backend/`)

---

## 🚀 로컬 실행 방법

### 1. 백엔드 실행 (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
# Backend API: http://localhost:8000
```

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
