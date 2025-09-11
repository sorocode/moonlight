import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  name: string;
  occupation: string;
  gender: "male" | "female" | "other";
  income: number;
}

export interface WelfareRecommendation {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string;
  applicationMethod: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AppState {
  // User information
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;

  // Recommendations
  recommendations: WelfareRecommendation[];
  setRecommendations: (recommendations: WelfareRecommendation[]) => void;
  isLoadingRecommendations: boolean;
  setLoadingRecommendations: (loading: boolean) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;

  // Navigation
  currentPage: "welcome" | "form" | "recommendations" | "chat";
  setCurrentPage: (
    page: "welcome" | "form" | "recommendations" | "chat"
  ) => void;

  // Reset all data
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User information
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),

      // Recommendations
      recommendations: [],
      setRecommendations: (recommendations) => set({ recommendations }),
      isLoadingRecommendations: false,
      setLoadingRecommendations: (loading) =>
        set({ isLoadingRecommendations: loading }),

      // Chat
      chatMessages: [],
      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }));
      },
      clearChat: () => set({ chatMessages: [] }),

      // Navigation
      currentPage: "welcome",
      setCurrentPage: (page) => set({ currentPage: page }),

      // Reset all data
      resetApp: () =>
        set({
          userInfo: null,
          recommendations: [],
          chatMessages: [],
          currentPage: "welcome",
          isLoadingRecommendations: false,
        }),
    }),
    {
      name: "welfare-app-storage",
      partialize: (state) => ({
        userInfo: state.userInfo,
        recommendations: state.recommendations,
        chatMessages: state.chatMessages,
        currentPage: state.currentPage,
      }),
    }
  )
);
