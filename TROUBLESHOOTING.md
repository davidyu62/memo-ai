# Supabase 연동 문제 해결 가이드

## 확인 체크리스트

### 1. 데이터베이스 테이블 생성 확인 ⚠️ 가장 중요!

**Supabase 대시보드에서 확인:**
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 좌측 사이드바에서 **Table Editor** 클릭
4. `memos` 테이블이 있는지 확인

**테이블이 없으면:**
1. 좌측 사이드바에서 **SQL Editor** 클릭
2. `supabase/migrations/001_create_memos_table.sql` 파일 내용 복사
3. SQL Editor에 붙여넣고 **Run** 클릭
4. 성공 메시지 확인

### 2. 환경 변수 확인

**터미널에서 확인:**
```bash
# .env.local 파일이 프로젝트 루트에 있는지 확인
cat .env.local
```

**확인 사항:**
- `NEXT_PUBLIC_SUPABASE_URL` 값이 올바른지
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값이 올바른지
- `SUPABASE_SERVICE_ROLE_KEY` 값이 올바른지

**환경 변수 로드 확인:**
- Next.js 개발 서버를 재시작했는지 확인
- `.env.local` 파일 수정 후 반드시 서버 재시작 필요

### 3. Row Level Security (RLS) 정책 확인

**Supabase 대시보드에서 확인:**
1. **Table Editor** → `memos` 테이블 선택
2. **Policies** 탭 클릭
3. "Allow all operations on memos" 정책이 있는지 확인

**정책이 없으면:**
SQL Editor에서 다음 실행:
```sql
CREATE POLICY "Allow all operations on memos"
  ON memos
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 4. 브라우저 콘솔 에러 확인

**개발자 도구에서 확인:**
1. 브라우저에서 F12 키 누르기
2. **Console** 탭 확인
3. 에러 메시지 확인

**주요 에러:**
- `relation "memos" does not exist` → 테이블이 없음
- `new row violates row-level security policy` → RLS 정책 문제
- `Missing Supabase environment variables` → 환경 변수 문제

### 5. 서버 로그 확인

**터미널에서 확인:**
- Next.js 개발 서버 터미널에서 에러 메시지 확인
- `Error fetching memos:` 같은 메시지 확인

## 빠른 해결 방법

### 방법 1: 테이블 생성 확인 및 생성

1. Supabase 대시보드 → SQL Editor
2. 다음 SQL 실행:

```sql
-- 테이블이 있는지 확인
SELECT * FROM memos LIMIT 1;
```

**에러가 나면** (테이블이 없음):
```sql
-- supabase/migrations/001_create_memos_table.sql 내용 실행
CREATE TABLE IF NOT EXISTS memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memos_category ON memos(category);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memos_updated_at
  BEFORE UPDATE ON memos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on memos"
  ON memos
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 방법 2: 환경 변수 재확인

`.env.local` 파일 확인:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hgmxpbyndxvltxlectmt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**서버 재시작:**
```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

### 방법 3: 테스트 쿼리 실행

Supabase SQL Editor에서:
```sql
-- 테이블 구조 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'memos';

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'memos';
```

## 일반적인 문제와 해결책

### 문제 1: "relation memos does not exist"
**원인:** 테이블이 생성되지 않음
**해결:** `supabase/migrations/001_create_memos_table.sql` 실행

### 문제 2: "new row violates row-level security policy"
**원인:** RLS 정책이 없거나 잘못 설정됨
**해결:** RLS 정책 생성 (위 SQL 참고)

### 문제 3: "Missing Supabase environment variables"
**원인:** 환경 변수가 로드되지 않음
**해결:** 
- `.env.local` 파일 확인
- 서버 재시작
- 변수 이름 확인 (NEXT_PUBLIC_ 접두사 필수)

### 문제 4: 데이터가 보이지 않음
**원인:** 데이터가 없음
**해결:** 
- Supabase Table Editor에서 데이터 확인
- 목업 데이터 생성 (`seedSampleData()` 호출)
