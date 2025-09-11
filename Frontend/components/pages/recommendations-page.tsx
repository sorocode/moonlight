"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { welfareApi } from "@/lib/api";
import {
  FileText,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  FileCheck,
  Award,
} from "lucide-react";

export function RecommendationsPage() {
  const {
    userInfo,
    recommendations,
    setRecommendations,
    isLoadingRecommendations,
    setLoadingRecommendations,
    setCurrentPage,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!userInfo) {
      setError("사용자 정보가 없습니다. 다시 입력해주세요.");
      return;
    }

    setLoadingRecommendations(true);
    setError(null);

    try {
      const newRecommendations = await welfareApi.getRecommendations(userInfo);
      setRecommendations(newRecommendations);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "추천 정책을 불러오는데 실패했습니다."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    if ((!recommendations || recommendations.length === 0) && userInfo) {
      fetchRecommendations();
    }
  }, [userInfo]);

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
              <AlertDescription>
                사용자 정보가 없습니다. 먼저 정보를 입력해주세요.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => setCurrentPage("form")}
              className="w-full mt-4"
            >
              정보 입력하러 가기
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-6 border-b border-border">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold text-center text-foreground">
            {userInfo.name}님을 위한 추천 정책
          </h1>
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
                  <h3 className="font-medium text-card-foreground">
                    분석 완료
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userInfo.occupation} • {userInfo.age}세 • {userInfo.region}{" "}
                    • {userInfo.income}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchRecommendations}
                  disabled={isLoadingRecommendations}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isLoadingRecommendations ? "animate-spin" : ""
                    }`}
                  />
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
          {!isLoadingRecommendations &&
            recommendations &&
            recommendations.length > 0 && (
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <Card
                    key={index}
                    className="border-border hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base leading-tight text-balance">
                              {recommendation.사업명}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="text-xs flex-shrink-0 bg-primary/10 text-primary border-primary/20"
                            >
                              {recommendation.추천순위}순위
                            </Badge>
                          </div>
                          <CardDescription className="mt-2 text-pretty leading-relaxed">
                            {recommendation.설명}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* 주요조건 */}
                      <div>
                        <h4 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          주요 조건
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {recommendation.주요조건?.신청기한 && (
                            <div className="flex items-start gap-2 text-sm">
                              <Calendar className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">신청기한:</span>
                                <span className="text-muted-foreground ml-1">
                                  {recommendation.주요조건.신청기한}
                                </span>
                              </div>
                            </div>
                          )}
                          {recommendation.주요조건?.연령 && (
                            <div className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">연령:</span>
                                <span className="text-muted-foreground ml-1">
                                  {recommendation.주요조건.연령}
                                </span>
                              </div>
                            </div>
                          )}
                          {recommendation.주요조건?.거주 && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">거주:</span>
                                <span className="text-muted-foreground ml-1">
                                  {recommendation.주요조건.거주}
                                </span>
                              </div>
                            </div>
                          )}
                          {recommendation.주요조건?.소득 && (
                            <div className="flex items-start gap-2 text-sm">
                              <DollarSign className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">소득:</span>
                                <span className="text-muted-foreground ml-1">
                                  {recommendation.주요조건.소득}
                                </span>
                              </div>
                            </div>
                          )}
                          {recommendation.주요조건?.기타 && (
                            <div className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">기타:</span>
                                <span className="text-muted-foreground ml-1">
                                  {recommendation.주요조건.기타}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 신청정보 */}
                      <div>
                        <h4 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-primary" />
                          신청 정보
                        </h4>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">신청방법:</span>
                            <span className="text-muted-foreground ml-1">
                              {recommendation.신청정보?.신청방법}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">필요서류:</span>
                            <span className="text-muted-foreground ml-1">
                              {recommendation.신청정보?.필요서류}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => {
                          window.open("https://www.bokjiro.go.kr", "_blank");
                        }}
                      >
                        자세히 보기
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          {/* Empty State */}
          {!isLoadingRecommendations &&
            (!recommendations || recommendations.length === 0) &&
            !error && (
              <Card className="text-center py-8">
                <CardContent>
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-card-foreground mb-2">
                    추천 정책이 없습니다
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    현재 조건에 맞는 정책을 찾지 못했습니다.
                  </p>
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
                <CardTitle className="text-lg text-card-foreground">
                  더 궁금한 점이 있으신가요?
                </CardTitle>
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
  );
}
