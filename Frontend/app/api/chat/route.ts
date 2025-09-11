import { type NextRequest, NextResponse } from "next/server";
import type { UserInfo, ChatMessage } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      userInfo,
      chatHistory,
    }: {
      message: string;
      userInfo: UserInfo | null;
      chatHistory: ChatMessage[];
    } = await request.json();

    // Validate input
    if (!message.trim()) {
      return NextResponse.json(
        { error: "메시지를 입력해주세요." },
        { status: 400 }
      );
    }

    // Generate contextual response
    const response = await generateChatResponseWithAI(
      message,
      userInfo,
      chatHistory
    );

    return NextResponse.json({
      response,
      message: "응답을 성공적으로 생성했습니다.",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "채팅 응답 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

async function generateChatResponse(
  message: string,
  userInfo: UserInfo | null,
  chatHistory: ChatMessage[]
): Promise<string> {
  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();

  // Context-aware responses based on user info and message content
  if (lowerMessage.includes("신청") || lowerMessage.includes("어떻게")) {
    return `${
      userInfo?.name ? userInfo.name + "님, " : ""
    }대부분의 복지정책은 거주지 읍면동 주민센터에서 신청하실 수 있습니다. 온라인 신청이 가능한 정책도 있으니, 구체적인 정책명을 알려주시면 더 자세한 신청 방법을 안내해드리겠습니다.`;
  }

  if (lowerMessage.includes("자격") || lowerMessage.includes("조건")) {
    return "복지정책의 자격 요건은 주로 소득 수준, 연령, 가구 구성 등을 기준으로 합니다. 구체적인 정책에 대해 문의해주시면 해당 정책의 자격 요건을 자세히 설명해드리겠습니다.";
  }

  if (lowerMessage.includes("소득") || lowerMessage.includes("돈")) {
    return "소득 기준은 정책마다 다릅니다. 기준 중위소득의 30%, 47%, 70% 등으로 구분되며, 가구원 수에 따라서도 달라집니다. 정확한 소득 기준은 복지로 홈페이지에서 확인하실 수 있습니다.";
  }

  if (lowerMessage.includes("서류") || lowerMessage.includes("준비")) {
    return "일반적으로 신분증, 가족관계증명서, 소득증명서류, 재산증명서류 등이 필요합니다. 정책에 따라 추가 서류가 필요할 수 있으니, 신청 전에 해당 기관에 문의하시는 것을 권장합니다.";
  }

  if (lowerMessage.includes("기간") || lowerMessage.includes("언제")) {
    return "복지정책 신청은 대부분 연중 가능하지만, 일부 정책은 신청 기간이 정해져 있습니다. 또한 심사 기간은 보통 14일~30일 정도 소요됩니다.";
  }

  if (lowerMessage.includes("안녕") || lowerMessage.includes("처음")) {
    return `안녕하세요! 복지정책 상담 챗봇입니다. ${
      userInfo?.name ? userInfo.name + "님의 " : ""
    }복지정책에 대한 궁금한 점을 언제든 물어보세요. 신청 방법, 자격 요건, 필요 서류 등 무엇이든 도움드리겠습니다.`;
  }

  // Default contextual responses
  const defaultResponses = [
    `${
      userInfo?.name ? userInfo.name + "님, " : ""
    }복지정책에 대해 더 구체적으로 질문해주시면 정확한 정보를 제공해드릴 수 있습니다.`,
    "궁금하신 복지정책의 이름이나 분야를 알려주시면 더 자세한 안내를 해드리겠습니다.",
    "복지로(bokjiro.go.kr) 홈페이지에서도 다양한 복지정보를 확인하실 수 있습니다. 추가 질문이 있으시면 언제든 말씀해주세요.",
    "신청 방법, 자격 요건, 지원 내용 등 구체적인 질문을 해주시면 더 도움이 되는 답변을 드릴 수 있습니다.",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateChatResponseWithAI(
  message: string,
  userInfo: UserInfo | null,
  chatHistory: ChatMessage[]
): Promise<string> {
  const systemPrompt = `
당신은 한국의 복지정책 전문 상담사입니다. 
사용자의 질문에 대해 정확하고 친절하게 답변해주세요.

사용자 정보:
${
  userInfo
    ? `
- 이름: ${userInfo.name}
- 성별: ${
        userInfo.gender === "male"
          ? "남성"
          : userInfo.gender === "female"
          ? "여성"
          : "기타"
      }
- 직업: ${userInfo.occupation}
- 월소득: ${userInfo.income}원
`
    : "- 정보 없음"
}

답변 가이드라인:
1. 친근하고 존댓말로 답변
2. 구체적이고 실용적인 정보 제공
3. 필요시 관련 기관이나 웹사이트 안내
4. 답변은 200자 이내로 간결하게
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...chatHistory.slice(-5).map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: "user", content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages as any,
    temperature: 0.7,
    max_tokens: 300,
  });

  return (
    completion.choices[0].message.content ||
    "죄송합니다. 응답을 생성할 수 없습니다."
  );
}
