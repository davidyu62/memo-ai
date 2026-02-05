import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '메모 내용이 필요합니다.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // Google Generative AI 초기화
    const genAI = new GoogleGenerativeAI(apiKey)
    // gemini-2.5-flash-lite 모델 사용
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

    // 프롬프트 구성
    const prompt = `다음 메모를 간결하고 명확하게 요약해주세요. 핵심 내용만 2-3문장으로 정리해주세요. 한국어로 답변해주세요.\n\n메모 내용:\n${content}`

    // 요약 생성
    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('요약 생성 오류:', error)
    
    // 에러 타입에 따라 상세 메시지 반환
    let errorMessage = '요약 생성 중 오류가 발생했습니다.'
    
    if (error instanceof Error) {
      errorMessage = error.message
      // API 키 관련 오류
      if (error.message.includes('API_KEY') || error.message.includes('api key')) {
        errorMessage = 'Gemini API 키가 유효하지 않습니다. API 키를 확인해주세요.'
      }
      // 모델 관련 오류
      if (error.message.includes('model') || error.message.includes('Model')) {
        errorMessage = '모델을 찾을 수 없습니다. 모델 이름을 확인해주세요.'
      }
      // 할당량 관련 오류
      if (error.message.includes('quota') || error.message.includes('Quota')) {
        errorMessage = 'API 할당량을 초과했습니다. 잠시 후 다시 시도해주세요.'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
