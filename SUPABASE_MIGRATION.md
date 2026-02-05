# Supabase 마이그레이션 가이드

## 개요

LocalStorage 기반 메모 CRUD 기능을 Supabase로 마이그레이션했습니다.

## 설정 단계

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트 생성
2. 프로젝트 설정 → API에서 다음 정보 확인:
   - Project URL
   - anon/public key
   - service_role key (서버 사이드에서만 사용)

### 2. 데이터베이스 테이블 생성

Supabase 대시보드의 SQL Editor에서 다음 SQL을 실행하거나, 마이그레이션 파일을 사용하세요:

```sql
-- supabase/migrations/001_create_memos_table.sql 파일 내용 실행
```

또는 Supabase 대시보드에서:
1. SQL Editor 열기
2. `supabase/migrations/001_create_memos_table.sql` 파일 내용 복사하여 실행

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Gemini API Key
GEMINI_API_KEY=AIzaSyBQMdU1x4uGMniGBBODvGmvo5CjTO-XDKw

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hgmxpbyndxvltxlectmt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbXhwYnluZHh2bHR4bGVjdG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNjQwMTMsImV4cCI6MjA4NTg0MDAxM30.s7_b99eNm9rhuxwG4ZmYRQmbh5l70R8bY7x4aE_4HRw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbXhwYnluZHh2bHR4bGVjdG10Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI2NDAxMywiZXhwIjoyMDg1ODQwMDEzfQ.sTGNnVeje_lfLyoPChB7C87duQTikvJTyap4bVens9I
```

#### Supabase 환경 변수 확인 방법

1. **Supabase 대시보드 접속**
   - [Supabase Dashboard](https://app.supabase.com)에 로그인
   - 프로젝트 선택

2. **프로젝트 설정 → API 메뉴**
   - 좌측 사이드바에서 **Settings** (⚙️) 클릭
   - **API** 메뉴 선택

3. **환경 변수 값 확인**
   - **Project URL**: `Project URL` 섹션에서 확인
     - 예: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `Project API keys` 섹션의 `anon` `public` 키
     - `Reveal` 버튼 클릭하여 전체 키 확인
   - **service_role key**: 같은 섹션의 `service_role` 키
     - ⚠️ **주의**: 이 키는 서버 사이드에서만 사용하고 절대 클라이언트에 노출하지 마세요
     - `Reveal` 버튼 클릭하여 전체 키 확인

4. **환경 변수 예시**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. 목업 데이터 생성 (선택사항)

프로젝트 루트에서 다음 명령어로 샘플 데이터를 생성할 수 있습니다:

```typescript
// src/app/actions/seed.ts의 seedSampleData 함수를 호출
// 또는 Supabase 대시보드에서 직접 데이터 삽입
```

## 변경 사항

### 파일 구조

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts      # 클라이언트 사이드 Supabase 클라이언트
│       └── server.ts      # 서버 사이드 Supabase 클라이언트
├── app/
│   └── actions/
│       ├── memos.ts       # 메모 CRUD 서버 액션
│       └── seed.ts        # 목업 데이터 생성
└── hooks/
    └── useMemos.ts        # Supabase 연동으로 수정됨
```

### 주요 변경사항

1. **LocalStorage → Supabase**
   - `src/utils/localStorage.ts` 대신 `src/app/actions/memos.ts` 사용
   - 서버 액션을 통한 데이터베이스 연동

2. **비동기 처리**
   - 모든 CRUD 작업이 async/await로 변경
   - 에러 처리 추가

3. **타입 유지**
   - 기존 `Memo` 인터페이스 그대로 유지
   - 데이터베이스 스키마는 Memo 타입에 맞춰 설계

## 데이터베이스 스키마

```sql
CREATE TABLE memos (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API 엔드포인트

서버 액션을 통해 다음 기능을 제공합니다:

- `getMemos()` - 모든 메모 조회
- `createMemo(formData)` - 메모 생성
- `updateMemo(id, formData)` - 메모 수정
- `deleteMemo(id)` - 메모 삭제
- `getMemoById(id)` - 특정 메모 조회
- `seedSampleData()` - 목업 데이터 생성

## 보안

- Row Level Security (RLS) 활성화
- 개발 환경에서는 모든 작업 허용 정책 적용
- 프로덕션에서는 더 엄격한 정책 설정 권장

## 문제 해결

### 환경 변수 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 변수 이름이 정확한지 확인 (NEXT_PUBLIC_ 접두사 필수)

### 데이터베이스 연결 오류
- Supabase 프로젝트 URL과 키가 올바른지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 테이블이 없는 경우
- 마이그레이션 SQL을 실행했는지 확인
- Supabase 대시보드에서 테이블이 생성되었는지 확인
