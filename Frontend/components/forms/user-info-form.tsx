"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, type UserInfo } from "@/lib/store";
import {
  ArrowRight,
  User,
  Briefcase,
  DollarSign,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";

export function UserInfoForm() {
  const { setUserInfo, setCurrentPage } = useAppStore();
  const [formData, setFormData] = useState<UserInfo>({
    name: "",
    occupation: "",
    gender: "남성",
    income: "",
    age: 0,
    region: "",
  });
  const [errors, setErrors] = useState<Partial<UserInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const occupations = [
    "학생",
    "직장인",
    "자영업자",
    "프리랜서",
    "무직",
    "주부",
    "은퇴자",
    "기타",
  ];

  const regions = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ];

  const incomeRanges = [
    { value: "소득 없음", label: "소득 없음" },
    { value: "100만원 이하", label: "100만원 이하" },
    { value: "200만원 이하", label: "200만원 이하" },
    { value: "300만원 이하", label: "300만원 이하" },
    { value: "400만원 이하", label: "400만원 이하" },
    { value: "500만원 이하", label: "500만원 이하" },
    { value: "500만원 이상", label: "500만원 이상" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<UserInfo> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.occupation) {
      newErrors.occupation = "직업을 선택해주세요";
    }

    if (!formData.region) {
      newErrors.region = "거주지역을 선택해주세요";
    }

    if (!formData.age || formData.age < 1) {
      newErrors.age = "나이를 입력해주세요";
    }

    if (!formData.income) {
      newErrors.income = "소득 범위를 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Save user info to store
      setUserInfo(formData);

      // Navigate to recommendations page
      setCurrentPage("recommendations");
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-6 border-b border-border">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold text-center text-foreground">
            정보 입력
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            맞춤형 추천을 위해 기본 정보를 입력해주세요
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">이름</CardTitle>
                </div>
                <CardDescription>
                  개인 맞춤 서비스 제공을 위해 사용됩니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gender Selection */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">성별</CardTitle>
                </div>
                <CardDescription>
                  성별별 특화 정책 추천을 위해 필요합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>성별</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "남성" | "여성" | "기타") =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="남성">남성</SelectItem>
                      <SelectItem value="여성">여성</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Age Input */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">나이</CardTitle>
                </div>
                <CardDescription>
                  연령별 지원 정책을 찾아드립니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="age">나이</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    min="1"
                    max="120"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        age: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive">{errors.age}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Region Selection */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">거주지역</CardTitle>
                </div>
                <CardDescription>
                  지역별 특화 정책을 추천해드립니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>거주지역</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, region: value }))
                    }
                  >
                    <SelectTrigger
                      className={errors.region ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="거주지역을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-sm text-destructive">{errors.region}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Occupation Selection */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">직업</CardTitle>
                </div>
                <CardDescription>
                  직업별 지원 정책을 찾아드립니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="occupation">직업</Label>
                  <Select
                    value={formData.occupation}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, occupation: value }))
                    }
                  >
                    <SelectTrigger
                      className={errors.occupation ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="직업을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map((occupation) => (
                        <SelectItem key={occupation} value={occupation}>
                          {occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.occupation && (
                    <p className="text-sm text-destructive">
                      {errors.occupation}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Income Selection */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">월 소득</CardTitle>
                </div>
                <CardDescription>
                  소득 수준에 맞는 지원 정책을 추천해드립니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>월 소득 범위</Label>
                  <Select
                    value={formData.income}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, income: value }))
                    }
                  >
                    <SelectTrigger
                      className={errors.income ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="소득 범위를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.income && (
                    <p className="text-sm text-destructive">{errors.income}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="border-muted bg-muted/30">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-card-foreground">
                    개인정보 처리 안내
                  </p>
                  <ul className="space-y-1 text-xs leading-relaxed">
                    <li>
                      • 입력하신 정보는 복지정책 추천 목적으로만 사용됩니다
                    </li>
                    <li>• 개인정보는 서비스 이용 후 자동으로 삭제됩니다</li>
                    <li>• 제3자에게 정보를 제공하지 않습니다</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isSubmitting ? "처리 중..." : "추천받기"}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
