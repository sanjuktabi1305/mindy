"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Frown, Meh, Smile, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import * as React from "react";
import type { Mood, MoodLog } from "@/lib/types";
import { format, subDays, startOfWeek, isToday, parseISO } from "date-fns";
import { SceneWrapper } from "./3d/scene-wrapper";
import { MoodVisualization } from "./3d/mood-visualization";
import { FloatingOrb } from "./3d/floating-orb";
import { motion, AnimatePresence } from "framer-motion";

const MOOD_STORAGE_KEY = "mindful-chat-mood-logs";

const moodOptions: { mood: Mood; icon: React.ElementType; color: string; label: string }[] = [
  { mood: "sad", icon: Frown, color: "hsl(var(--primary))", label: "Sad" },
  { mood: "neutral", icon: Meh, color: "hsl(var(--accent))", label: "Neutral" },
  { mood: "happy", icon: Smile, color: "hsl(var(--chart-2))", label: "Happy" },
];

export default function EnhancedMoodTracker() {
  const [moodLogs, setMoodLogs] = React.useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = React.useState<Mood | null>(null);
  const [showCelebration, setShowCelebration] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(MOOD_STORAGE_KEY);
      if (savedLogs) {
        setMoodLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.warn("Could not access localStorage for mood logs.");
    }
  }, []);

  const handleMoodLog = (mood: Mood) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const newLogs = moodLogs.filter((log) => log.date !== today);
    const updatedLogs: MoodLog[] = [...newLogs, { date: today, mood }];
    setMoodLogs(updatedLogs);
    setSelectedMood(mood);
    
    if (mood === 'happy') {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    try {
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.warn("Could not save mood logs to localStorage.");
    }
  };
  
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayLog = moodLogs.find(log => log.date === todayStr);

  const chartData = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const log = moodLogs.find((l) => l.date === dateStr);
      const moodValue = log ? (log.mood === "happy" ? 3 : log.mood === "neutral" ? 2 : 1) : 0;
      return {
        date: format(date, "EEE"),
        fullDate: dateStr,
        mood: moodValue,
        moodName: log?.mood,
        isToday: isToday(date),
      };
    });
  }, [moodLogs]);

  const monthlyData = React.useMemo(() => {
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const log = moodLogs.find((l) => l.date === dateStr);
      const moodValue = log ? (log.mood === "happy" ? 3 : log.mood === "neutral" ? 2 : 1) : 0;
      return {
        date: format(date, "MMM dd"),
        mood: moodValue,
        moodName: log?.mood,
      };
    });
    return last30Days;
  }, [moodLogs]);

  const moodStats = React.useMemo(() => {
    const last7Days = moodLogs.filter(log => {
      const logDate = parseISO(log.date);
      const weekAgo = subDays(new Date(), 7);
      return logDate >= weekAgo;
    });

    const moodCounts = last7Days.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);

    const totalLogs = last7Days.length;
    const averageMood = totalLogs > 0 
      ? last7Days.reduce((sum, log) => {
          return sum + (log.mood === 'happy' ? 3 : log.mood === 'neutral' ? 2 : 1);
        }, 0) / totalLogs
      : 0;

    return { moodCounts, totalLogs, averageMood };
  }, [moodLogs]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-6xl">🎉✨🌟</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5" />
              How are you feeling today?
            </CardTitle>
            <CardDescription>
              Log your mood to track your emotional well-being over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around mb-6">
              {moodOptions.map(({ mood, icon: Icon, color, label }) => (
                <motion.div
                  key={mood}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={todayLog?.mood === mood ? "secondary" : "ghost"}
                    size="icon"
                    className="h-16 w-16 rounded-full relative"
                    style={todayLog?.mood === mood ? { backgroundColor: color, color: 'white' } : {}}
                    onClick={() => handleMoodLog(mood)}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="sr-only">{label}</span>
                    {todayLog?.mood === mood && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-current"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {todayLog && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Badge variant="secondary" className="text-sm">
                  Today: {moodOptions.find(m => m.mood === todayLog.mood)?.label}
                </Badge>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <CardTitle>3D Mood Visualization</CardTitle>
            <CardDescription>
              Your current mood represented in 3D space
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <SceneWrapper>
              {todayLog ? (
                <MoodVisualization mood={todayLog.mood} intensity={1} />
              ) : (
                <>
                  <FloatingOrb position={[-2, 0, 0]} color="#FFD700" speed={0.5} />
                  <FloatingOrb position={[0, 0, 0]} color="#87CEEB" speed={0.7} />
                  <FloatingOrb position={[2, 0, 0]} color="#4682B4" speed={0.9} />
                </>
              )}
            </SceneWrapper>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Weekly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moodStats.averageMood.toFixed(1)}/3
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {moodStats.totalLogs} entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moodLogs.length > 0 ? Math.min(7, moodLogs.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Days tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Most Common
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.entries(moodStats.moodCounts).length > 0 
                ? Object.entries(moodStats.moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>
            Track your emotional patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">Last 30 Days</TabsTrigger>
            </TabsList>
            
            <TabsContent value="week" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => ["", "Sad", "Neutral", "Happy"][value]}
                    domain={[0, 3]}
                    ticks={[1,2,3]}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <p className="font-bold">
                                      {data.isToday ? 'Today' : data.date}
                                    </p>
                                    <p className="capitalize">
                                      {data.moodName ?? 'Not logged'}
                                    </p>
                                </div>
                            )
                        }
                        return null;
                    }}
                  />
                  <Bar 
                    dataKey="mood" 
                    radius={[4, 4, 0, 0]}
                    fill="hsl(var(--primary))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="month" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => ["", "Sad", "Neutral", "Happy"][value]}
                    domain={[0, 3]}
                    ticks={[1,2,3]}
                  />
                  <Tooltip
                    cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <p className="font-bold">{data.date}</p>
                                    <p className="capitalize">
                                      {data.moodName ?? 'Not logged'}
                                    </p>
                                </div>
                            )
                        }
                        return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}