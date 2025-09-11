import { type NextRequest, NextResponse } from "next/server"
import type { UserInfo, WelfareRecommendation } from "@/lib/store"

export async function POST(request: NextRequest) {
  try {
    const userInfo: UserInfo = await request.json()

    // Validate input
    if (!userInfo.name || !userInfo.occupation) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // TODO: Replace with actual OpenAI API call
    // This structure is ready for OpenAI integration
    const recommendations = await generateWelfareRecommendations(userInfo)

    return NextResponse.json({
      recommendations,
      message: "추천 정책을 성공적으로 조회했습니다.",
    })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json({ error: "추천 정책 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

async function generateWelfareRecommendations(userInfo: UserInfo): Promise<WelfareRecommendation[]> {
  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Enhanced mock data based on user info
  const baseRecommendations: WelfareRecommendation[] = [
    {
      id: "basic-living",
      title: "기초생활수급자 지원",
      description: "생계가 어려운 저소득층을 위한 기본적인 생활비 지원 제도입니다.",
      eligibility: ["소득인정액이 기준 중위소득 30% 이하", "부양의무자 기준 충족"],
      benefits: "생계급여, 의료급여, 주거급여, 교육급여 지원",
      applicationMethod: "거주지 읍면동 주민센터 방문 신청",
      category: "생계지원",
    },
    {
      id: "youth-job-support",
      title: "청년 구직활동 지원금",
      description: "구직 중인 청년들의 경제적 부담을 덜어주는 지원금입니다.",
      eligibility: ["만 18~34세 미취업 청년", "구직활동 참여 의무"],
      benefits: "월 50만원, 최대 6개월 지원",
      applicationMethod: "온라인 신청 후 면접 진행",
      category: "취업지원",
    },
    {
      id: "housing-support",
      title: "주거급여",
      description: "저소득층의 주거비 부담을 덜어주는 주거 지원 제도입니다.",
      eligibility: ["소득인정액이 기준 중위소득 47% 이하"],
      benefits: "임차급여 또는 수선유지급여 지원",
      applicationMethod: "거주지 읍면동 주민센터 신청",
      category: "주거지원",
    },
    {
      id: "student-support",
      title: "국가장학금",
      description: "경제적 어려움을 겪는 대학생을 위한 학비 지원 제도입니다.",
      eligibility: ["대학 재학생", "소득분위 8분위 이하"],
      benefits: "학기당 최대 260만원 지원",
      applicationMethod: "한국장학재단 온라인 신청",
      category: "교육지원",
    },
    {
      id: "elderly-support",
      title: "기초연금",
      description: "65세 이상 어르신의 안정적인 소득 보장을 위한 연금 제도입니다.",
      eligibility: ["만 65세 이상", "소득인정액 하위 70%"],
      benefits: "월 최대 32만원 지급",
      applicationMethod: "거주지 국민연금공단 지사 또는 주민센터 신청",
      category: "노인지원",
    },
    {
      id: "self-employed-support",
      title: "소상공인 지원금",
      description: "경영난을 겪는 소상공인을 위한 경영 안정 지원금입니다.",
      eligibility: ["소상공인 사업자", "매출 감소 증명"],
      benefits: "업종별 차등 지원 (50만원~300만원)",
      applicationMethod: "소상공인시장진흥공단 온라인 신청",
      category: "사업지원",
    },
    {
      id: "childcare-support",
      title: "아동수당",
      description: "만 8세 미만 아동의 건강한 성장을 위한 양육비 지원입니다.",
      eligibility: ["만 8세 미만 아동", "소득 무관"],
      benefits: "월 10만원 지급",
      applicationMethod: "거주지 읍면동 주민센터 신청",
      category: "육아지원",
    },
  ]

  // Filter recommendations based on user info
  const filteredRecommendations = baseRecommendations.filter((rec) => {
    // Income-based filtering
    if (userInfo.income <= 2000000) {
      return ["생계지원", "주거지원", "취업지원"].includes(rec.category)
    }

    // Occupation-based filtering
    if (userInfo.occupation === "학생") {
      return ["교육지원", "취업지원"].includes(rec.category)
    }

    if (userInfo.occupation === "자영업자") {
      return ["사업지원", "주거지원"].includes(rec.category)
    }

    if (userInfo.occupation === "무직") {
      return ["생계지원", "취업지원", "주거지원"].includes(rec.category)
    }

    if (userInfo.occupation === "주부") {
      return ["육아지원", "주거지원"].includes(rec.category)
    }

    // Default recommendations for other cases
    return ["주거지원", "취업지원"].includes(rec.category)
  })

  // Return at least 2 recommendations
  return filteredRecommendations.length >= 2 ? filteredRecommendations.slice(0, 4) : baseRecommendations.slice(0, 3)
}

/* 
Future OpenAI Integration Structure:

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateWelfareRecommendationsWithAI(userInfo: UserInfo): Promise<WelfareRecommendation[]> {
  const prompt = `
사용자 정보:
- 이름: ${userInfo.name}
- 성별: ${userInfo.gender === 'male' ? '남성' : userInfo.gender === 'female' ? '여성' : '기타'}
- 직업: ${userInfo.occupation}
- 월소득: ${userInfo.income}원

위 정보를 바탕으로 한국의 복지정책 중 가장 적합한 3-5개를 추천해주세요.
각 정책에 대해 다음 정보를 JSON 형태로 제공해주세요:
- title: 정책명
- description: 정책 설명
- eligibility: 자격 요건 (배열)
- benefits: 혜택 내용
- applicationMethod: 신청 방법
- category: 카테고리

응답은 반드시 JSON 배열 형태로만 제공해주세요.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "당신은 한국의 복지정책 전문가입니다. 사용자의 상황에 맞는 복지정책을 정확하고 유용하게 추천해주세요."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  })

  try {
    const recommendations = JSON.parse(completion.choices[0].message.content || '[]')
    return recommendations.map((rec: any, index: number) => ({
      id: `ai-${index}`,
      ...rec
    }))
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    // Fallback to mock data
    return generateWelfareRecommendations(userInfo)
  }
}
*/
