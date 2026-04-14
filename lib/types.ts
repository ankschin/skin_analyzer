export interface ConditionScore {
  score: number;
  description: string;
}

export interface RoutineStep {
  step: string;
  productType: string;
  keyIngredients: string[];
  avoid: string[];
}

export interface AnalysisResult {
  overallScore: number;
  skinType: "oily" | "dry" | "combination" | "normal";
  conditions: {
    acne: ConditionScore;
    darkSpots: ConditionScore;
    redness: ConditionScore;
    pores: ConditionScore;
    wrinkles: ConditionScore;
    texture: ConditionScore;
    hydration: ConditionScore;
  };
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  tips: string[];
}
