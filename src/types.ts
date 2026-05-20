export enum Biotype {
  ECTOMORPH = 'Ectomorfo',
  MESOMORPH = 'Mesomorfo',
  ENDOMORPH = 'Endomorfo'
}

export enum Objective {
  WEIGHT_LOSS = 'Perda de Peso',
  MUSCLE_GAIN = 'Ganho de Massa',
  HEALTHY_LIFESTYLE = 'Estilo de Vida Saudável'
}

export interface UserData {
  age: number;
  weight: number;
  height: number;
  objective: Objective;
  gender: 'M' | 'F';
}

export interface Macro {
  name: string;
  value: number;
  unit: string;
  color: string;
}

export interface Meal {
  time: string;
  name: string;
  foods: string[];
  calories: number;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
}

export interface DayWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface HealthPlan {
  biotype: string;
  biotypeDescription: string;
  imc: number;
  tmb: number;
  tdee: number;
  dailyCalories: number;
  waterTarget: number;
  macros: Macro[];
  meals: Meal[];
  weeklyWorkout: DayWorkout[];
  recommendations: string[];
  timestamp?: string;
}
