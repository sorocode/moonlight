import axios from "axios"
import type { UserInfo, WelfareRecommendation, ChatMessage } from "./store"

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error("[API Request Error]", error)
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error("[API Response Error]", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const welfareApi = {
  // Get welfare recommendations based on user info
  getRecommendations: async (userInfo: UserInfo): Promise<WelfareRecommendation[]> => {
    try {
      const response = await api.post("/recommendations", userInfo)
      return response.data.recommendations
    } catch (error) {
      console.error("Failed to get recommendations:", error)
      throw new Error(handleApiError(error))
    }
  },

  // Send chat message and get AI response
  sendChatMessage: async (message: string, userInfo: UserInfo | null, chatHistory: ChatMessage[]): Promise<string> => {
    try {
      const response = await api.post("/chat", {
        message,
        userInfo,
        chatHistory: chatHistory.slice(-10), // Send last 10 messages for context
      })
      return response.data.response
    } catch (error) {
      console.error("Failed to send chat message:", error)
      throw new Error(handleApiError(error))
    }
  },
}

// Enhanced error handling with specific Korean messages
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Server returned an error response
    if (error.response?.data?.error) {
      return error.response.data.error
    }

    // Network or timeout errors
    if (error.code === "ECONNABORTED") {
      return "요청 시간이 초과되었습니다. 인터넷 연결을 확인하고 다시 시도해주세요."
    }

    if (error.code === "ERR_NETWORK") {
      return "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요."
    }

    // HTTP status code based errors
    switch (error.response?.status) {
      case 400:
        return "잘못된 요청입니다. 입력 정보를 확인해주세요."
      case 401:
        return "인증이 필요합니다."
      case 403:
        return "접근 권한이 없습니다."
      case 404:
        return "요청한 서비스를 찾을 수 없습니다."
      case 429:
        return "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요."
      case 500:
        return "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      case 502:
      case 503:
      case 504:
        return "서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요."
      default:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    }
  }

  // Non-axios errors
  return "알 수 없는 오류가 발생했습니다. 다시 시도해주세요."
}

// Utility function to check API health
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/health", { method: "GET" })
    return response.ok
  } catch {
    return false
  }
}
