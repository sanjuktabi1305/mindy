"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Frown, Meh, Smile } from "lucide-react";
import * as React from "react";
import type { Mood, MoodLog } from "@/lib/types";
import { format, subDays, startOfWeek } from "date-fns";
import { ChartTooltipContent } from "./ui/chart";

const MOOD_STORAGE_KEY = "mindful-chat-mood-logs";

const moodOptions: { mood: Mood; icon: React.ElementType; color: string }[] = [
  { mood: "sad", icon: Frown, color: "hsl(var(--primary))" },
  { mood: "neutral", icon: Meh, color: "hsl(var(--accent))" },
  { mood: "happy", icon: Smile, color: "hsl(var(--chart-2))" },
];

export default function MoodTracker() {
  const [moodLogs, setMoodLogs] = React.useState<MoodLog[]>([]);

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
    try {
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.warn("Could not save mood logs to localStorage.");
    }
  };
  
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayLog = moodLogs.find(log => log.date === todayStr);

  const chartData = React.useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const log = moodLogs.find((l) => l.date === dateStr);
      const moodValue = log ? (log.mood === "happy" ? 3 : log.mood === "neutral" ? 2 : 1) : 0;
      return {
        date: format(date, "EEE"),
        mood: moodValue,
        moodName: log?.mood,
      };
    });
  }, [moodLogs]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>
            Log your mood to track your emotional well-being over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-around">
          {moodOptions.map(({ mood, icon: Icon, color }) => (
            <Button
              key={mood}
              variant={todayLog?.mood === mood ? "secondary" : "ghost"}
              size="icon"
              className="h-16 w-16 rounded-full"
              style={todayLog?.mood === mood ? { backgroundColor: color, color: 'white' } : {}}
              onClick={() => handleMoodLog(mood)}
            >
              <Icon className="h-8 w-8" />
              <span className="sr-only">{mood}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Week in Moods</CardTitle>
          <CardDescription>A look at your mood fluctuations over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
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
                        return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <p className="font-bold capitalize">{payload[0].payload.moodName ?? 'Not logged'}</p>
                            </div>
                        )
                    }
                    return null;
                }}
              />
              <Bar dataKey="mood" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => {
                  const moodInfo = moodOptions.find(opt => opt.mood === entry.moodName);
                  return <div key={`cell-${index}`} style={{ backgroundColor: moodInfo?.color || "#eee" }} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
