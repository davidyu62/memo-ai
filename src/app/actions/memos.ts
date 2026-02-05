'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { Memo, MemoFormData } from '@/types/memo'
import { v4 as uuidv4 } from 'uuid'

// Supabase에서 반환되는 데이터 타입
interface SupabaseMemoRow {
  id: string
  title: string
  content: string
  category: string
  tags: string[] | null
  created_at: string
  updated_at: string
}

// 모든 메모 가져오기
export async function getMemos(): Promise<Memo[]> {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching memos:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return []
    }

    // Supabase에서 가져온 데이터를 Memo 타입으로 변환
    return ((data as SupabaseMemoRow[]) || []).map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  } catch (error) {
    console.error('Unexpected error in getMemos:', error)
    return []
  }
}

// 메모 생성
export async function createMemo(formData: MemoFormData): Promise<Memo> {
  const supabase = createServerClient()
  
  const newMemo = {
    id: uuidv4(),
    title: formData.title,
    content: formData.content,
    category: formData.category,
    tags: formData.tags,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('memos')
    // @ts-expect-error - Supabase 타입 정의 이슈로 인한 타입 에러
    .insert([newMemo])
    .select()
    .single()

  if (error) {
    console.error('Error creating memo:', error)
    throw new Error('Failed to create memo')
  }

  revalidatePath('/')

  const row = data as SupabaseMemoRow
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 메모 업데이트
export async function updateMemo(
  id: string,
  formData: MemoFormData
): Promise<Memo> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('memos')
    // @ts-expect-error - Supabase 타입 정의 이슈로 인한 타입 에러
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating memo:', error)
    throw new Error('Failed to update memo')
  }

  revalidatePath('/')

  const row = data as SupabaseMemoRow
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 메모 삭제
export async function deleteMemo(id: string): Promise<void> {
  const supabase = createServerClient()
  
  const { error } = await supabase.from('memos').delete().eq('id', id)

  if (error) {
    console.error('Error deleting memo:', error)
    throw new Error('Failed to delete memo')
  }

  revalidatePath('/')
}

// 특정 메모 가져오기
export async function getMemoById(id: string): Promise<Memo | null> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  const row = data as SupabaseMemoRow
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
