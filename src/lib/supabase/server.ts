import { createClient } from '@supabase/supabase-js'
import { Memo } from '@/types/memo'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

// 서버 사이드에서 사용하는 클라이언트 (서비스 롤 키 사용)
export const createServerClient = () => {
  if (supabaseServiceKey) {
    return createClient<{
      memos: Memo
    }>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  
  // 서비스 키가 없으면 익명 키 사용 (클라이언트와 동일)
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient<{
    memos: Memo
  }>(supabaseUrl, supabaseAnonKey)
}
