import { type NextRequest, NextResponse } from "next/server";
import type { UserInfo, WelfareRecommendation } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const userInfo: UserInfo = await request.json();

    if (!userInfo.name || !userInfo.occupation || !userInfo.age) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const recommendations = await generateWelfareRecommendations(userInfo);

    return NextResponse.json({
      recommendations,
      message: "추천 정책을 성공적으로 조회했습니다.",
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json(
      { error: "추천 정책 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function createRecommendationPrompt(userInfo: UserInfo) {
  const systemPrompt = `
    당신은 한국의 복지정책, 장학금, 지원사업의 상세 조건을 분석하는 AI 전문가입니다.
    현재 시점은 **2025년 9월**입니다. 이 시점을 기준으로 모든 추천이 이루어져야 합니다.
    사용자 정보를 바탕으로, **현재 신청 가능한** 지원사업 3개를 추천합니다.

    출력은 반드시 다음 규칙을 따르는 **하나의 JSON 객체**여야 합니다.
    - **JSON의 최상위 키는 반드시 "recommendations" 이어야 하며, 그 값은 3개의 추천 사업 객체를 담은 배열(Array)이어야 합니다.**

    각 추천 사업 객체는 '추천순위', '사업명', '설명', '주요조건', '신청정보' 키를 가져야 합니다.
    '주요조건'은 아래 예시처럼 신청기한, 연령, 거주, 소득 등 핵심 조건을 상세히 포함해야 합니다.
       (예시: "주요조건": { "신청기한": "2025년 9월 30일까지 (마감 임박)", "연령": "만 19세 ~ 39세", "거주": "신청일 기준 대전광역시에 1년 이상 계속 거주", "소득": "기준중위소득 150% 이하", "기타": "무주택자" })
    '신청정보'는 아래 예시처럼 신청방법과 사용자의 직업을 고려한 필요서류를 포함해야 합니다.
       (예시: "신청정보": { "신청방법": "온라인 신청 (한국장학재단 홈페이지)", "필요서류": "신분증 사본, 주민등록등본, 재학증명서 (상세 서류는 공고 확인 필수)" })

    JSON 외에 어떤 설명이나 텍스트도 추가해서는 안 됩니다.
  `;

  const userPrompt = `아래 사용자 정보에 맞는 지원사업을 추천해주세요:\n${JSON.stringify(
    userInfo,
    null,
    2
  )}`;

  return { systemPrompt, userPrompt };
}

async function generateWelfareRecommendations(
  userInfo: UserInfo
): Promise<WelfareRecommendation[]> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const { systemPrompt, userPrompt } = createRecommendationPrompt(userInfo);

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textOutput = data.choices[0].message.content;

        try {
          const parsedData = JSON.parse(textOutput);
          return parsedData.recommendations || [];
        } catch (parseError) {
          console.error("추천 결과가 JSON 형식이 아닙니다:", textOutput);
        }
      }
    } catch (error) {
      console.error("OpenAI API 호출 실패:", error);
    }
  }

  return getMockRecommendations(userInfo);
}

function getMockRecommendations(userInfo: UserInfo): WelfareRecommendation[] {
  const mockRecommendations: WelfareRecommendation[] = [
    {
      추천순위: 1,
      사업명: "청년 구직활동 지원금",
      설명: "구직 중인 청년들의 경제적 부담을 덜어주는 지원금입니다.",
      주요조건: {
        신청기한: "2025년 12월 31일까지",
        연령: "만 18세 ~ 34세",
        거주: `${userInfo.region}에 거주하는 미취업 청년`,
        소득: "기준중위소득 150% 이하",
        기타: "구직활동 참여 의무",
      },
      신청정보: {
        신청방법: "온라인 신청 후 면접 진행",
        필요서류: "신분증 사본, 주민등록등본, 구직활동 계획서",
      },
    },
    {
      추천순위: 2,
      사업명: "기초생활수급자 지원",
      설명: "생계가 어려운 저소득층을 위한 기본적인 생활비 지원 제도입니다.",
      주요조건: {
        신청기한: "연중 상시 신청 가능",
        연령: "연령 제한 없음",
        거주: `${userInfo.region} 거주자`,
        소득: "기준중위소득 30% 이하",
        기타: "부양의무자 기준 충족",
      },
      신청정보: {
        신청방법: "거주지 읍면동 주민센터 방문 신청",
        필요서류: "신분증, 소득증명서, 재산증명서, 부양의무자 관련 서류",
      },
    },
    {
      추천순위: 3,
      사업명: "주거급여",
      설명: "저소득층의 주거비 부담을 덜어주는 주거 지원 제도입니다.",
      주요조건: {
        신청기한: "연중 상시 신청 가능",
        연령: "연령 제한 없음",
        거주: `${userInfo.region} 거주자`,
        소득: "기준중위소득 47% 이하",
      },
      신청정보: {
        신청방법: "거주지 읍면동 주민센터 신청",
        필요서류: "신분증, 임대차계약서, 소득증명서",
      },
    },
  ];

  if (userInfo.occupation === "학생") {
    mockRecommendations.unshift({
      추천순위: 1,
      사업명: "국가장학금",
      설명: "경제적 어려움을 겪는 대학생을 위한 학비 지원 제도입니다.",
      주요조건: {
        신청기한: "2025년 11월 30일까지",
        연령: "대학 재학생",
        거주: "거주지 제한 없음",
        소득: "소득분위 8분위 이하",
      },
      신청정보: {
        신청방법: "한국장학재단 온라인 신청",
        필요서류: "재학증명서, 성적증명서, 가족관계증명서",
      },
    });
  }

  return mockRecommendations.slice(0, 3);
}
