"use client"

import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { ArrowLeft, Home, MessageCircle, FileText, User } from "lucide-react"

export function MobileNavigation() {
  const { currentPage, setCurrentPage, userInfo } = useAppStore()

  const navigationItems = [
    {
      id: "welcome" as const,
      icon: Home,
      label: "홈",
      available: true,
    },
    {
      id: "form" as const,
      icon: User,
      label: "정보입력",
      available: true,
    },
    {
      id: "recommendations" as const,
      icon: FileText,
      label: "추천결과",
      available: !!userInfo,
    },
    {
      id: "chat" as const,
      icon: MessageCircle,
      label: "상담",
      available: !!userInfo,
    },
  ]

  const canGoBack = currentPage !== "welcome"

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {canGoBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentPage === "form") setCurrentPage("welcome")
                else if (currentPage === "recommendations") setCurrentPage("form")
                else if (currentPage === "chat") setCurrentPage("recommendations")
              }}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              이전
            </Button>
          )}

          <div className="flex gap-1 ml-auto">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => item.available && setCurrentPage(item.id)}
                disabled={!item.available}
                className="flex flex-col gap-1 h-auto py-2 px-3"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
