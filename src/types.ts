import { NutritionAnalysis } from './services/geminiService';

export interface IntakeEntry {
  id: string;
  timestamp: string;
  date: string;
  rawInput: string;
  imageUrl?: string;
  analysis: NutritionAnalysis;
}

export type Tab = 'home' | 'history' | 'analysis' | 'info';