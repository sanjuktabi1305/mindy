export type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export type Mood = "happy" | "neutral" | "sad";

export type MoodLog = {
  date: string; // YYYY-MM-DD
  mood: Mood;
};

export type Goal = {
  id: number;
  text: string;
  completed: boolean;
  category?: 'wellness' | 'personal' | 'social' | 'creative';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt?: string;
  completedAt?: string;
};

export type WellnessMetric = {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
};
