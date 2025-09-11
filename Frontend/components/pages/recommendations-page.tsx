"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppStore } from "@/lib/store"
import { welfareApi } from "@/lib/api"
import {
  FileText,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  Heart,
  Home,
  GraduationCap,
  Briefcase,
  Users,
  Baby,
} from "lucide-react"

const categoryIcons = {
  생계지원: Heart,
  주거지원: Home,
  교육지원: GraduationCap,
  취업지원: Briefcase,
  사업지원: Briefcase,
  노인지원: Users,
  육아지원: Baby,
} as const

export function RecommendationsPage() {
  const {
    userInfo,
    recommendations,
    setRecommendations,
    isLoadingRecommendations,
    setLoadingRecommendations,
    setCurrentPage,
  } = useAppStore()

  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    if (!userInfo) {
      setError("사용자 정보가 없습니다. 다시 입력해주세요.")
      return
    }

    setLoadingRecommendations(true)
    setError(null)

    try {
      const newRecommendations = await welfareApi.getRecommendations(userInfo)
      setRecommendations(newRecommendations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "추천 정책을 불러오는데 실패했습니다.")
    } finally {
      setLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    if ((!recommendations || recommendations.length === 0) && userInfo) {
      fetchRecommendations()
    }
  }, [userInfo])

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || FileText
    return IconComponent
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      생계지원: "bg-red-100 text-red-700 border-red-200",
      주거지원: "bg-blue-100 text-blue-700 border-blue-200",
      교육지원: "bg-green-100 text-green-700 border-green-200",
      취업지원: "bg-purple-100 text-purple-700 border-purple-200",
      사업지원: "bg-orange-100 text-orange-700 border-orange-200",
      노인지원: "bg-gray-100 text-gray-700 border-gray-200",
      육아지원: "bg-pink-100 text-pink-700 border-pink-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="px-4 py-6 border-b border-border">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-xl font-semibold text-foreground">추천 결과</h1>
          </div>
        </header>
        <main className="px-4 py-8">
          <div className="max-w-md mx-auto">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>사용자 정보가 없습니다. 먼저 정보를 입력해주세요.</AlertDescription>
            </Alert>
            <Button onClick={() => setCurrentPage("form")} className="w-full mt-4">
              정보 입력하러 가기
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-6 border-b border-border">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold text-center text-foreground">{userInfo.name}님을 위한 추천 정책</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            입력하신 정보를 바탕으로 선별된 복지정책입니다
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* User Summary */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-card-foreground">분석 완료</h3>
                  <p className="text-sm text-muted-foreground">
                    {userInfo.occupation} • 월소득 {userInfo.income.toLocaleString()}원
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchRecommendations} disabled={isLoadingRecommendations}>
                  <RefreshCw className={`w-4 h-4 ${isLoadingRecommendations ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoadingRecommendations && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Recommendations List */}
          {!isLoadingRecommendations && recommendations && recommendations.length > 0 && (
            <div className="space-y-4">
              {recommendations.map((recommendation) => {
                const IconComponent = getCategoryIcon(recommendation.category)
                return (
                  <Card key={recommendation.id} className="border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base leading-tight text-balance">
                              {recommendation.title}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`text-xs flex-shrink-0 ${getCategoryColor(recommendation.category)}`}
                            >
                              {recommendation.category}
                            </Badge>
                          </div>
                          <CardDescription className="mt-2 text-pretty leading-relaxed">
                            {recommendation.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Benefits */}
                      <div>
                        <h4 className="text-sm font-medium text-card-foreground mb-2">지원 내용</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{recommendation.benefits}</p>
                      </div>

                      {/* Eligibility */}
                      <div>
                        <h4 className="text-sm font-medium text-card-foreground mb-2">자격 요건</h4>
                        <ul className="space-y-1">
                          {recommendation.eligibility?.map((requirement, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Application Method */}
                      <div>
                        <h4 className="text-sm font-medium text-card-foreground mb-2">신청 방법</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {recommendation.applicationMethod}
                        </p>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => {
                          // Open external link or provide more info
                          window.open("https://www.bokjiro.go.kr", "_blank")
                        }}
                      >
                        자세히 보기
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoadingRecommendations && (!recommendations || recommendations.length === 0) && !error && (
            <Card className="text-center py-8">
              <CardContent>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-card-foreground mb-2">추천 정책이 없습니다</h3>
                <p className="text-sm text-muted-foreground mb-4">현재 조건에 맞는 정책을 찾지 못했습니다.</p>
                <Button onClick={fetchRecommendations} variant="outline">
                  다시 검색하기
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Chat CTA */}
          {recommendations && recommendations.length > 0 && (
            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg text-card-foreground">더 궁금한 점이 있으신가요?</CardTitle>
                <CardDescription className="text-pretty">
                  AI 상담사와 대화하며 복지정책에 대해 더 자세히 알아보세요
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => setCurrentPage("chat")}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  size="lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  상담 시작하기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
