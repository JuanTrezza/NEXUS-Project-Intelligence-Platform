export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedDays: number;
  role: string;
  priority: 'Alta' | 'Media' | 'Baja' | string;
  completed?: boolean;
}

export interface Phase {
  phaseName: string;
  tasks: Task[];
}

export interface ProjectReport {
  projectName: string;
  predictedDelayRisk: number; // 0 to 100
  delayRiskLevel: 'Bajo' | 'Medio' | 'Alto' | string;
  riskExplanation: string;
  estimatedWeeks: number;
  phases: Phase[];
  aiRecommendations: string[];
}
