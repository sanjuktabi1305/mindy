"use client";

import * as React from "react";
import {
  Bot,
  Goal,
  HeartHandshake,
  Menu,
  MessageSquare,
  Smile,
  Timer,
  BarChart3,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import InitialAssessment from "@/components/initial-assessment";
import EnhancedChatInterface from "@/components/enhanced-chat-interface";
import EnhancedMoodTracker from "@/components/enhanced-mood-tracker";
import EnhancedGoalSetter from "@/components/enhanced-goal-setter";
import ResourceDirectory from "@/components/resource-directory";
import MeditationTimer from "@/components/meditation-timer";
import WellnessDashboard from "@/components/wellness-dashboard";
import { Logo } from "@/components/icons";

type NavItem = {
  id: "dashboard" | "chat" | "mood" | "goals" | "meditation" | "resources";
  label: string;
  icon: React.ElementType;
  component: React.ElementType;
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    component: WellnessDashboard,
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    component: EnhancedChatInterface,
  },
  {
    id: "mood",
    label: "Mood Tracking",
    icon: Smile,
    component: EnhancedMoodTracker,
  },
  {
    id: "goals",
    label: "Goal Setting",
    icon: Goal,
    component: EnhancedGoalSetter,
  },
  {
    id: "meditation",
    label: "Meditation",
    icon: Timer,
    component: MeditationTimer,
  },
  {
    id: "resources",
    label: "Resources",
    icon: HeartHandshake,
    component: ResourceDirectory,
  },
];

export default function Home() {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = React.useState<NavItem["id"]>("dashboard");

  const ActiveComponent = navItems.find((item) => item.id === activeView)?.component;

  const Navigation = ({ isMobileSheet = false }) => (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeView === item.id ? "secondary" : "ghost"}
          className="justify-start gap-2"
          onClick={() => {
            setActiveView(item.id);
            if (isMobileSheet) {
              // Add a small delay to allow sheet to close if needed
              // setOpen(false); could be passed as a prop
            }
          }}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  return (
    <>
      <InitialAssessment />
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Mindful Chat</h1>
          </div>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Logo className="h-8 w-8 text-primary" />
                        <h1 className="text-xl font-bold tracking-tight">Mindful Chat</h1>
                    </div>
                </div>
                <Navigation isMobileSheet={true} />
              </SheetContent>
            </Sheet>
          )}
        </header>
        <main className="flex flex-1">
          {!isMobile && (
            <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
              <Navigation />
            </aside>
          )}
          <div className="flex flex-1 flex-col">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </main>
      </div>
    </>
  );
}
