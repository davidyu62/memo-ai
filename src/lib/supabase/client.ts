import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// 클라이언트 사이드에서 사용하는 Supabase 클라이언트
// 환경 변수는 런타임에만 체크 (빌드 시점에는 체크하지 않음)
export const supabase = (() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // 빌드 시점에는 에러를 던지지 않고, 런타임에만 체크
    if (typeof window !== 'undefined') {
      throw new Error('Missing Supabase environment variables')
    }
    // 빌드 시점에는 더미 클라이언트 반환 (실제로는 사용되지 않음)
    return createClient<Database>('', '')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
})()
