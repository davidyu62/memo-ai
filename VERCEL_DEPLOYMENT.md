# Vercel 배포 가이드

## 배포 전 확인 사항

### 1. 환경 변수 설정 (필수!)

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

**프로젝트 설정 → Environment Variables**

#### 필수 환경 변수:

```env
# Gemini API Key
GEMINI_API_KEY=AIzaSyBQMdU1x4uGMniGBBODvGmvo5CjTO-XDKw

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hgmxpbyndxvltxlectmt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbXhwYnluZHh2bHR4bGVjdG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNjQwMTMsImV4cCI6MjA4NTg0MDAxM30.s7_b99eNm9rhuxwG4ZmYRQmbh5l70R8bY7x4aE_4HRw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbXhwYnluZHh2bHR4bGVjdG10Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI2NDAxMywiZXhwIjoyMDg1ODQwMDEzfQ.sTGNnVeje_lfLyoPChB7C87duQTikvJTyap4bVens9I
```

**환경 변수 설정 방법:**
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 각 변수를 추가 (Production, Preview, Development 모두 선택)
4. Save 후 재배포

### 2. 빌드 설정 확인

현재 `package.json`의 빌드 스크립트:
```json
"build": "next build"
```

이 설정은 Vercel에서 자동으로 인식됩니다.

### 3. Supabase 데이터베이스 확인

- ✅ 테이블 생성 완료 (`memos` 테이블)
- ✅ RLS 정책 설정 완료
- ⚠️ 목업 데이터 생성 필요 (배포 후 `/api/seed` 엔드포인트 호출)

### 4. 배포 후 작업

배포가 완료되면:

1. **환경 변수 확인**
   - Vercel 대시보드에서 환경 변수가 제대로 설정되었는지 확인

2. **목업 데이터 생성**
   - 배포된 사이트에서 `https://your-app.vercel.app/api/seed` 접속
   - 또는 Supabase 대시보드에서 직접 데이터 입력

3. **기능 테스트**
   - 메모 CRUD 기능 테스트
   - AI 요약 기능 테스트

## 일반적인 빌드 에러

### 에러 1: 환경 변수 누락
**증상:** `Missing Supabase environment variables`
**해결:** Vercel 대시보드에서 환경 변수 설정

### 에러 2: TypeScript 타입 에러
**증상:** 빌드 중 타입 에러
**해결:** 로컬에서 `npm run build` 실행하여 확인

### 에러 3: 의존성 문제
**증상:** 패키지 설치 실패
**해결:** `package.json` 확인 및 `package-lock.json` 커밋 확인

## 배포 체크리스트

- [ ] Vercel 프로젝트 생성 및 GitHub 연결
- [ ] 환경 변수 설정 (GEMINI_API_KEY, Supabase 변수)
- [ ] 빌드 성공 확인
- [ ] 배포 완료 후 사이트 접속 테스트
- [ ] 목업 데이터 생성 (`/api/seed`)
- [ ] 메모 CRUD 기능 테스트
- [ ] AI 요약 기능 테스트
