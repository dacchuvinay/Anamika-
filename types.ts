// FIX: Removed a self-import of `ActiveTab` and `Difficulty` which caused a declaration conflict.
export type ActiveTab = 'workouts' | 'calories' | 'assistant' | 'daily';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: number;
  name: string;
  sets: string;
  reps: string;
  description: string;
  imageUrl: string;
  videoUrl:string;
  imageUrlFemale?: string;
  videoUrlFemale?: string;
  muscleGroups: string[];
  equipment: string;
  formTips: string[];
  difficulty: Difficulty;
}

export interface FoodItem {
  id: number;
  name: string;
  calories: number;
}

export interface Quote {
  text: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DayPlan {
    day: string;
    focus: string;
    exerciseIds: number[];
    isRestDay?: boolean;
}

export interface WeeklySchedule {
    [key: number]: DayPlan;
}