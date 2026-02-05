import { NextResponse } from 'next/server'
import { seedSampleData } from '@/app/actions/seed'

export async function GET() {
  try {
    const result = await seedSampleData()
    
    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: '샘플 데이터가 성공적으로 생성되었습니다.' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: '이미 데이터가 존재합니다.' 
      })
    }
  } catch (error) {
    console.error('Error seeding data:', error)
    const errorMessage = error instanceof Error ? error.message : '데이터 생성 중 오류가 발생했습니다.'
    console.error('Full error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
