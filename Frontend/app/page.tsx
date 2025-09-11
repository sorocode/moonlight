"use client"

import { useAppStore } from "@/lib/store"
import { UserInfoForm } from "@/components/forms/user-info-form"
import { RecommendationsPage } from "@/components/pages/recommendations-page"
import { ChatPage } from "@/components/pages/chat-page"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, ArrowRight } from "lucide-react"

function WelcomePage() {
  const { setCurrentPage } = useAppStore()

  const features = [
    {
      icon: Heart,
      title: "맞춤형 추천",
      description: "개인 정보를 바탕으로 가장 적합한 복지정책을 추천해드립니다",
    },
    {
      icon: Shield,
      title: "안전한 서비스",
      description: "개인정보는 안전하게 보호되며 추천 목적으로만 사용됩니다",
    },
    {
      icon: Users,
      title: "전문 상담",
      description: "AI 챗봇을 통해 복지정책에 대한 궁금증을 해결할 수 있습니다",
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-6 border-b border-border">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center text-foreground">복지정책 추천 서비스</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">나에게 맞는 복지혜택을 찾아보세요</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground text-balance">당신을 위한 복지정책을 찾아드립니다</h2>
            <p className="text-muted-foreground text-pretty leading-relaxed">
              간단한 정보 입력만으로 받을 수 있는 다양한 복지혜택과 지원정책을 확인해보세요. AI가 분석하여 가장 적합한
              정책을 추천해드립니다.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-card-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg text-card-foreground">지금 시작해보세요</CardTitle>
              <CardDescription className="text-pretty">
                몇 가지 간단한 질문에 답하시면 맞춤형 복지정책을 추천해드립니다
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => setCurrentPage("form")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                정보 입력하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">개인정보는 추천 서비스 제공 목적으로만 사용되며</p>
            <p className="text-xs text-muted-foreground">서비스 이용 후 자동으로 삭제됩니다</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const { currentPage } = useAppStore()

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "welcome":
        return <WelcomePage />
      case "form":
        return <UserInfoForm />
      case "recommendations":
        return <RecommendationsPage />
      case "chat":
        return <ChatPage />
      default:
        return <WelcomePage />
    }
  }

  return (
    <>
      {renderCurrentPage()}
      <MobileNavigation />
    </>
  )
}
