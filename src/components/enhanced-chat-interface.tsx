"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getSupportiveResponse } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { Bot, Loader2, Send, User, Heart, Lightbulb, MessageCircle, Sparkles } from "lucide-react";
import * as React from "react";
import { Logo } from "./icons";
import { motion, AnimatePresence } from "framer-motion";
import { SceneWrapper } from "./3d/scene-wrapper";
import { FloatingOrb } from "./3d/floating-orb";

const quickResponses = [
  { text: "I'm feeling anxious", icon: "😰", category: "emotion" },
  { text: "I need motivation", icon: "💪", category: "support" },
  { text: "I'm grateful for...", icon: "🙏", category: "gratitude" },
  { text: "I accomplished...", icon: "🎉", category: "achievement" },
];

const supportivePrompts = [
  "How has your day been so far?",
  "What's one thing you're grateful for today?",
  "Is there anything on your mind you'd like to talk about?",
  "What's been bringing you joy lately?",
];

export default function EnhancedChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to listen and support you. How are you feeling today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await getSupportiveResponse({ userInput: textToSend });
      
      setIsTyping(false);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.supportiveResponse,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setIsTyping(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get a response. Please try again.",
      });
      setMessages((prev) => prev.slice(0, prev.length - 1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickResponse = (text: string) => {
    handleSend(text);
  };

  const suggestPrompt = () => {
    const randomPrompt = supportivePrompts[Math.floor(Math.random() * supportivePrompts.length)];
    setInput(randomPrompt);
  };

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex h-full flex-col">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <SceneWrapper>
          <FloatingOrb position={[-3, 2, -2]} color="#78A0D3" speed={0.3} />
          <FloatingOrb position={[3, -1, -2]} color="#D4AC0D" speed={0.5} />
          <FloatingOrb position={[0, 3, -3]} color="#78A0D3" speed={0.4} />
        </SceneWrapper>
      </div>

      {/* Chat Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Mindful Assistant</h3>
            <p className="text-sm text-muted-foreground">
              {isTyping ? "Typing..." : "Here to support you"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Supportive
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "flex items-start gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <Card
                  className={cn(
                    "max-w-xs md:max-w-md",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </CardContent>
                </Card>
                
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 justify-start"
            >
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Responses */}
      {messages.length <= 2 && (
        <div className="border-t bg-background/95 backdrop-blur-sm p-4">
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-2">Quick responses:</p>
            <div className="flex flex-wrap gap-2">
              {quickResponses.map((response, index) => (
                <motion.div
                  key={response.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickResponse(response.text)}
                    className="text-xs"
                    disabled={isLoading}
                  >
                    <span className="mr-1">{response.icon}</span>
                    {response.text}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur-sm p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="pr-20"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={suggestPrompt}
                  disabled={isLoading}
                >
                  <Lightbulb className="h-3 w-3" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-6 w-6"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI-powered support
          </span>
          <span>{input.length}/500</span>
        </div>
      </div>
    </div>
  );
}