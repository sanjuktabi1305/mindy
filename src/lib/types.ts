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
};
