// Supabase 데이터베이스 타입 정의
export type Database = {
  public: {
    Tables: {
      memos: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
