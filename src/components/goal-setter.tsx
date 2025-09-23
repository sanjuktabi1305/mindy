"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Goal } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";

const GOAL_STORAGE_KEY = "mindful-chat-goals";

export default function GoalSetter() {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [newGoal, setNewGoal] = React.useState("");

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
  
  const updateGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    try {
        localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(updatedGoals));
    } catch (error) {
        console.warn("Could not save goals to localStorage.");
    }
  }

  const handleAddGoal = () => {
    if (newGoal.trim() === "") return;
    const newGoals = [...goals, { id: Date.now(), text: newGoal, completed: false }];
    updateGoals(newGoals);
    setNewGoal("");
  };

  const toggleGoal = (id: number) => {
    const newGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    updateGoals(newGoals);
  };
  
  const deleteGoal = (id: number) => {
    const newGoals = goals.filter(goal => goal.id !== id);
    updateGoals(newGoals);
  }

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Your Goals</CardTitle>
          <CardDescription>
            Small steps can lead to big changes. Set some achievable goals for yourself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., Go for a 15-minute walk"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
            />
            <Button type="submit" onClick={handleAddGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>You've completed {completedGoals} of {totalGoals} goals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Checkbox
                  id={`goal-${goal.id}`}
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <label
                  htmlFor={`goal-${goal.id}`}
                  className={cn("flex-1 text-sm font-medium leading-none", goal.completed && "line-through text-muted-foreground")}
                >
                  {goal.text}
                </label>
                <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              You haven't set any goals yet. Add one above to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
