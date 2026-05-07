import { AuditInput, AuditResult, Recommendation, ToolUsage } from './types';

export function calculateAudit(input: AuditInput): AuditResult {
  const recommendations: Recommendation[] = [];
  let totalSavings = 0;

  for (const tool of input.tools) {
    const rec = evaluateTool(tool, input);
    recommendations.push(rec);
    totalSavings += rec.savingsPerMonth;
  }

  return {
    auditId: generateId(),
    input,
    recommendations,
    totalMonthlySavings: totalSavings,
    totalAnnualSavings: totalSavings * 12,
    timestamp: new Date().toISOString(),
    shareableUrl: `/audit/${generateId()}`,
  };
}

function evaluateTool(tool: ToolUsage, input: AuditInput): Recommendation {
  // ACTUAL LOGIC with defensive reasoning
  // Example: Is Claude Team cheaper than 3x Claude Pro for 3 seats?
  // Example: Does Gemini API make sense for their use case at this volume?
  // etc.
  
  return {
    toolId: tool.toolId,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendation: 'Downgrade to Pro plan',
    savingsPerMonth: 10,
    reasoning: 'Team plan is $30/user/month, Pro is $20/user/month. For 2 users, Pro saves $20/month.',
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
