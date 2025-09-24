"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Brain, 
  Activity, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import * as React from "react";
import { SceneWrapper } from "./3d/scene-wrapper";
import { FloatingOrb } from "./3d/floating-orb";
import { ProgressRing } from "./3d/progress-ring";
import { motion } from "framer-motion";
import { format, subDays, isToday } from "date-fns";

interface WellnessMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

export default function WellnessDashboard() {
  const [wellnessData, setWellnessData] = React.useState<WellnessMetric[]>([
    {
      id: 'mood',
      name: 'Mood Score',
      value: 7.5,
      target: 8,
      unit: '/10',
      icon: Heart,
      color: '#F59E0B',
      trend: 'up'
    },
    {
      id: 'meditation',
      name: 'Meditation',
      value: 15,
      target: 20,
      unit: 'min',
      icon: Brain,
      color: '#8B5CF6',
      trend: 'up'
    },
    {
      id: 'goals',
      name: 'Goals Progress',
      value: 65,
      target: 100,
      unit: '%',
      icon: Target,
      color: '#10B981',
      trend: 'stable'
    },
    {
      id: 'streak',
      name: 'Daily Streak',
      value: 7,
      target: 30,
      unit: 'days',
      icon: Activity,
      color: '#EF4444',
      trend: 'up'
    }
  ]);

  const [weeklyStats, setWeeklyStats] = React.useState({
    totalSessions: 12,
    averageMood: 7.2,
    goalsCompleted: 8,
    meditationMinutes: 105
  });

  const overallWellnessScore = React.useMemo(() => {
    const totalScore = wellnessData.reduce((sum, metric) => {
      const percentage = (metric.value / metric.target) * 100;
      return sum + Math.min(percentage, 100);
    }, 0);
    return Math.round(totalScore / wellnessData.length);
  }, [wellnessData]);

  const achievements = [
    { id: 1, name: "First Steps", description: "Completed your first mood log", earned: true, icon: "🎯" },
    { id: 2, name: "Mindful Week", description: "7 days of consistent tracking", earned: true, icon: "🧘" },
    { id: 3, name: "Goal Getter", description: "Completed 5 goals", earned: true, icon: "✅" },
    { id: 4, name: "Meditation Master", description: "100 minutes of meditation", earned: true, icon: "🧠" },
    { id: 5, name: "Wellness Warrior", description: "30-day streak", earned: false, icon: "⚡" },
    { id: 6, name: "Zen Master", description: "500 minutes of meditation", earned: false, icon: "🌟" },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const nextAchievement = achievements.find(a => !a.earned);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header with 3D Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Wellness Overview
            </CardTitle>
            <CardDescription>
              Your mental health journey at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {overallWellnessScore}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Wellness Score</p>
                <Progress value={overallWellnessScore} className="mt-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {wellnessData.map((metric) => {
                  const Icon = metric.icon;
                  const percentage = (metric.value / metric.target) * 100;
                  
                  return (
                    <motion.div
                      key={metric.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" style={{ color: metric.color }} />
                        <span className="text-sm font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {metric.value}{metric.unit}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 
                            'text-gray-600'
                          }`}
                        >
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                        </Badge>
                      </div>
                      <Progress value={percentage} className="mt-2 h-1" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <CardTitle>3D Wellness Visualization</CardTitle>
            <CardDescription>
              Your wellness metrics in 3D space
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <SceneWrapper>
              <ProgressRing 
                progress={overallWellnessScore / 100} 
                radius={2} 
                thickness={0.2}
                color="#10B981"
                label={`${overallWellnessScore}%`}
              />
              
              {wellnessData.map((metric, index) => (
                <FloatingOrb
                  key={metric.id}
                  position={[
                    Math.cos((index / wellnessData.length) * Math.PI * 2) * 3,
                    Math.sin((index / wellnessData.length) * Math.PI * 2) * 3,
                    0
                  ]}
                  color={metric.color}
                  speed={0.3 + (metric.value / metric.target) * 0.5}
                  distort={0.2 + (metric.value / metric.target) * 0.3}
                />
              ))}
            </SceneWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyStats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Avg Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyStats.averageMood}/10</div>
                <p className="text-xs text-muted-foreground">Weekly average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyStats.goalsCompleted}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Meditation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyStats.meditationMinutes}m</div>
                <p className="text-xs text-muted-foreground">Total time</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Earned Achievements
                </CardTitle>
                <CardDescription>
                  {earnedAchievements.length} of {achievements.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earnedAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-yellow-900">{achievement.name}</h4>
                        <p className="text-sm text-yellow-700">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Next Achievement
                </CardTitle>
                <CardDescription>
                  Keep going to unlock more rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nextAchievement && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl opacity-50">{nextAchievement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-blue-900">{nextAchievement.name}</h4>
                        <p className="text-sm text-blue-700">{nextAchievement.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Positive Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Mood scores improving over the past week</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Consistent daily check-ins</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Meditation practice is building momentum</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Try increasing meditation to 20 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Set 2-3 small daily goals</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Consider evening reflection sessions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}