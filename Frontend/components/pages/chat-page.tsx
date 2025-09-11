"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { welfareApi } from "@/lib/api";
import { Send, Bot, User, AlertCircle, Loader2 } from "lucide-react";

export function ChatPage() {
  const { userInfo, chatMessages, addChatMessage } = useAppStore();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add welcome message if no messages exist
  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        role: "assistant",
        content: `안녕하세요${
          userInfo?.name ? `, ${userInfo.name}님` : ""
        }! 복지정책 상담 챗봇입니다. 궁금한 점이 있으시면 언제든 물어보세요. 신청 방법, 자격 요건, 필요 서류 등 무엇이든 도움드리겠습니다.`,
      });
    }
  }, []);

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || isLoading) return;

    // Add user message
    addChatMessage({
      role: "user",
      content: message,
    });

    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Get AI response
      const response = await welfareApi.sendChatMessage(
        message,
        userInfo,
        chatMessages
      );

      // Add assistant response
      addChatMessage({
        role: "assistant",
        content: response,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "메시지 전송에 실패했습니다.";
      setError(errorMessage);

      // Add error message to chat
      addChatMessage({
        role: "assistant",
        content: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateInput?: Date | string) => {
    if (!dateInput) return ""; // dateInput이 없으면 빈 문자열 반환

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) return ""; // 유효하지 않은 Date일 경우

    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  const quickQuestions = [
    "신청 방법이 궁금해요",
    "필요한 서류는 무엇인가요?",
    "자격 요건을 확인하고 싶어요",
    "언제까지 신청해야 하나요?",
  ];

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 border-b border-border bg-card">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                복지정책 상담
              </h1>
              <p className="text-sm text-muted-foreground">
                AI 상담사가 도움을 드립니다
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 px-4 py-4">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                        : "bg-card border border-border rounded-2xl rounded-bl-md"
                    }`}
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary/10">
                        <User className="w-4 h-4 text-secondary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="w-4 h-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        답변을 생성하고 있습니다...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Questions */}
          {chatMessages.length <= 1 && !isLoading && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                자주 묻는 질문
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 text-left justify-start bg-transparent"
                    onClick={() => {
                      setInputMessage(question);
                      inputRef.current?.focus();
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 border-t border-border bg-card">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="궁금한 점을 입력해주세요..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Enter로 전송 • AI가 생성한 답변이므로 정확하지 않을 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
