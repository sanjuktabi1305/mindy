"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Goal } from "@/lib/types";
import { Plus, Trash2, Target, Trophy, Calendar, CheckCircle2, Circle } from "lucide-react";
import * as React from "react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { SceneWrapper } from "./3d/scene-wrapper";
import { ProgressRing } from "./3d/progress-ring";
import { FloatingOrb } from "./3d/floating-orb";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isAfter, isBefore, parseISO } from "date-fns";

const GOAL_STORAGE_KEY = "mindful-chat-goals";

interface EnhancedGoal extends Goal {
  category: 'wellness' | 'personal' | 'social' | 'creative';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

const goalCategories = [
  { value: 'wellness', label: 'Wellness', color: '#10B981', icon: '🧘' },
  { value: 'personal', label: 'Personal', color: '#3B82F6', icon: '🎯' },
  { value: 'social', label: 'Social', color: '#F59E0B', icon: '👥' },
  { value: 'creative', label: 'Creative', color: '#8B5CF6', icon: '🎨' },
];

const priorityLevels = [
  { value: 'low', label: 'Low', color: '#6B7280' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
];

export default function EnhancedGoalSetter() {
  const [goals, setGoals] = React.useState<EnhancedGoal[]>([]);
  const [newGoal, setNewGoal] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<EnhancedGoal['category']>('wellness');
  const [selectedPriority, setSelectedPriority] = React.useState<EnhancedGoal['priority']>('medium');
  const [dueDate, setDueDate] = React.useState("");
  const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');

  React.useEffect(() => {
    try {
      const savedGoals = localStorage.getItem(GOAL_STORAGE_KEY);
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.warn("Could not access localStorage for goals.");
    }
  }, []);
  
  const updateGoals = (updatedGoals: EnhancedGoal[]) => {
    setGoals(updatedGoals);
    try {
        localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(updatedGoals));
    } catch (error) {
        console.warn("Could not save goals to localStorage.");
    }
  }

  const handleAddGoal = () => {
    if (newGoal.trim() === "") return;
    
    const newGoalObj: EnhancedGoal = {
      id: Date.now(),
      text: newGoal,
      completed: false,
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    };
    
    const newGoals = [...goals, newGoalObj];
    updateGoals(newGoals);
    setNewGoal("");
    setDueDate("");
  };

  const toggleGoal = (id: number) => {
    const newGoals = goals.map((goal) =>
      goal.id === id 
        ? { 
            ...goal, 
            completed: !goal.completed,
            completedAt: !goal.completed ? new Date().toISOString() : undefined
          } 
        : goal
    );
    updateGoals(newGoals);
  };
  
  const deleteGoal = (id: number) => {
    const newGoals = goals.filter(goal => goal.id !== id);
    updateGoals(newGoals);
  }

  const filteredGoals = React.useMemo(() => {
    return goals.filter(goal => {
      if (filter === 'active') return !goal.completed;
      if (filter === 'completed') return goal.completed;
      return true;
    });
  }, [goals, filter]);

  const goalStats = React.useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const overdue = goals.filter(g => 
      !g.completed && 
      g.dueDate && 
      isAfter(new Date(), parseISO(g.dueDate))
    ).length;
    const progress = total > 0 ? completed / total : 0;

    const categoryStats = goalCategories.map(cat => ({
      ...cat,
      count: goals.filter(g => g.category === cat.value).length,
      completed: goals.filter(g => g.category === cat.value && g.completed).length,
    }));

    return { total, completed, overdue, progress, categoryStats };
  }, [goals]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set Your Goals
            </CardTitle>
            <CardDescription>
              Create meaningful goals with categories, priorities, and deadlines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="e.g., Meditate for 10 minutes daily"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedCategory} onValueChange={(value: EnhancedGoal['category']) => setSelectedCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={(value: EnhancedGoal['priority']) => setSelectedPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            
            <Button onClick={handleAddGoal} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <CardTitle>3D Progress Visualization</CardTitle>
            <CardDescription>
              Your goal completion progress in 3D
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <SceneWrapper>
              <ProgressRing 
                progress={goalStats.progress} 
                radius={1.5} 
                thickness={0.2}
                color="#78A0D3"
                label={`${Math.round(goalStats.progress * 100)}%`}
              />
              {goalStats.categoryStats.map((cat, index) => (
                <FloatingOrb
                  key={cat.value}
                  position={[
                    Math.cos((index / goalStats.categoryStats.length) * Math.PI * 2) * 3,
                    Math.sin((index / goalStats.categoryStats.length) * Math.PI * 2) * 3,
                    0
                  ]}
                  color={cat.color}
                  speed={0.5 + index * 0.2}
                  distort={0.1}
                />
              ))}
            </SceneWrapper>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Total Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{goalStats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-600" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{goalStats.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(goalStats.progress * 100)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>
            Manage and track your personal goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({goals.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({goals.filter(g => !g.completed).length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({goals.filter(g => g.completed).length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={filter} className="space-y-4 mt-6">
              <AnimatePresence>
                {filteredGoals.length > 0 ? (
                  filteredGoals.map((goal) => {
                    const category = goalCategories.find(c => c.value === goal.category);
                    const priority = priorityLevels.find(p => p.value === goal.priority);
                    const isOverdue = goal.dueDate && !goal.completed && isAfter(new Date(), parseISO(goal.dueDate));
                    
                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                          "flex items-center space-x-3 p-4 bg-muted/50 rounded-lg border",
                          goal.completed && "opacity-75",
                          isOverdue && "border-red-200 bg-red-50"
                        )}
                      >
                        <Checkbox
                          id={`goal-${goal.id}`}
                          checked={goal.completed}
                          onCheckedChange={() => toggleGoal(goal.id)}
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor={`goal-${goal.id}`}
                              className={cn(
                                "text-sm font-medium leading-none cursor-pointer",
                                goal.completed && "line-through text-muted-foreground"
                              )}
                            >
                              {goal.text}
                            </label>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              style={{ backgroundColor: category?.color + '20', color: category?.color }}
                            >
                              {category?.icon} {category?.label}
                            </Badge>
                            
                            <Badge 
                              variant="outline"
                              style={{ borderColor: priority?.color, color: priority?.color }}
                            >
                              {priority?.label}
                            </Badge>
                            
                            {goal.dueDate && (
                              <Badge variant={isOverdue ? "destructive" : "secondary"}>
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(parseISO(goal.dueDate), 'MMM dd')}
                              </Badge>
                            )}
                            
                            {goal.completed && goal.completedAt && (
                              <Badge variant="secondary" className="text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed {format(parseISO(goal.completedAt), 'MMM dd')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteGoal(goal.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Circle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {filter === 'all' 
                        ? "You haven't set any goals yet. Add one above to get started!"
                        : `No ${filter} goals found.`
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}