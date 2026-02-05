'use server'

import { createServerClient } from '@/lib/supabase/server'
import { sampleMemos } from '@/utils/seedData'
import { v4 as uuidv4 } from 'uuid'

// 목업 데이터 생성
export async function seedSampleData(): Promise<boolean> {
  try {
    const supabase = createServerClient()

    // 기존 데이터 확인
    const { data: existingData, error: checkError } = await supabase
      .from('memos')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('Error checking existing data:', checkError)
      throw new Error(`Failed to check existing data: ${checkError.message}`)
    }

    // 이미 데이터가 있으면 시딩하지 않음
    if (existingData && existingData.length > 0) {
      console.log('Data already exists, skipping seed')
      return false
    }

  // 샘플 데이터를 Supabase 형식으로 변환
  // UUID 형식으로 변환 (기존 '1', '2' 같은 ID를 UUID로 변환)
  const memosToInsert = sampleMemos.map(memo => ({
    id: uuidv4(), // 모든 ID를 새로운 UUID로 생성
    title: memo.title,
    content: memo.content,
    category: memo.category,
    tags: memo.tags,
    created_at: memo.createdAt,
    updated_at: memo.updatedAt,
  }))

  const { error } = await supabase
    .from('memos')
    // @ts-expect-error - Supabase 타입 정의 이슈로 인한 타입 에러
    .insert(memosToInsert)

  if (error) {
    console.error('Error seeding data:', error)
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to seed sample data: ${error.message}`)
  }

    console.log('Sample data seeded successfully!')
    return true
  } catch (error) {
    console.error('Unexpected error in seedSampleData:', error)
    throw error
  }
}
