// The audit input from user
export interface AuditInput {
  tools: ToolUsage[];
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  email?: string;
}

export interface ToolUsage {
  toolId: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

// The audit output
export interface AuditResult {
  auditId: string;
  input: AuditInput;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  timestamp: string;
  shareableUrl: string;
}

export interface Recommendation {
  toolId: string;
  currentPlan: string;
  currentSpend: number;
  recommendation: string;
  savingsPerMonth: number;
  reasoning: string;
}
