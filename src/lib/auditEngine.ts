import { AuditInput, AuditResult, Recommendation, ToolUsage } from './types';
import { PRICING_DATA } from './pricing';

export function calculateAudit(input: AuditInput): AuditResult {
  const recommendations: Recommendation[] = [];
  let totalSavings = 0;

  // Cross-tool analysis
  const toolIds = input.tools.map(t => t.toolId);
  const hasCopilot = toolIds.includes('copilot');
  const hasChatGpt = toolIds.includes('chatgpt');
  const hasCursor = toolIds.includes('cursor');
  const hasClaude = toolIds.includes('claude');

  // Check for coding overlap
  if (input.primaryUseCase === 'coding' && hasCopilot && (hasChatGpt || hasClaude) && !hasCursor) {
    // If they pay for Copilot and a general LLM for coding, Cursor replaces both
    const copilotSpend = input.tools.find(t => t.toolId === 'copilot')?.monthlySpend || 0;
    const llmSpend = input.tools.find(t => t.toolId === 'chatgpt' || t.toolId === 'claude')?.monthlySpend || 0;
    const combinedSpend = copilotSpend + llmSpend;
    
    const cursorProCost = input.teamSize * (PRICING_DATA.cursor.plans.pro.monthlyPrice || 20);
    
    if (combinedSpend > cursorProCost) {
      recommendations.push({
        toolId: 'cross-tool',
        currentPlan: 'Multiple Tools',
        currentSpend: combinedSpend,
        recommendation: 'Consolidate to Cursor',
        savingsPerMonth: combinedSpend - cursorProCost,
        reasoning: `You are paying $${combinedSpend}/mo for Copilot + a general LLM. Cursor Pro provides both best-in-class autocomplete and premium LLMs (Claude 3.5/GPT-4o) for $${cursorProCost}/mo total.`,
      });
      totalSavings += combinedSpend - cursorProCost;
    }
  }

  // Individual tool analysis
  for (const tool of input.tools) {
    const rec = evaluateTool(tool);
    if (rec) {
      recommendations.push(rec);
      totalSavings += rec.savingsPerMonth;
    }
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

function evaluateTool(tool: ToolUsage): Recommendation | null {
  const pricingData = PRICING_DATA[tool.toolId];
  if (!pricingData) return null;

  const planData = pricingData.plans[tool.plan];
  if (!planData || planData.monthlyPrice === null) return null; // Can't evaluate custom/API easily without usage data

  // 1. Check for unused seats or overpayment
  const expectedMinimumSpend = tool.seats * planData.monthlyPrice;
  if (tool.monthlySpend > expectedMinimumSpend) {
    return {
      toolId: tool.toolId,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendation: 'Audit unused seats',
      savingsPerMonth: tool.monthlySpend - expectedMinimumSpend,
      reasoning: `You report spending $${tool.monthlySpend}/mo for ${tool.seats} seats on the ${tool.plan} plan. Based on public pricing ($${planData.monthlyPrice}/user), you should be paying $${expectedMinimumSpend}. You may be paying for inactive users.`,
    };
  }

  // 2. Specific Tool Logic: Claude Team minimum seats
  if (tool.toolId === 'claude' && tool.plan === 'team') {
    if (tool.seats < 5) {
      const proCost = tool.seats * 20;
      return {
        toolId: tool.toolId,
        currentPlan: tool.plan,
        currentSpend: tool.monthlySpend,
        recommendation: 'Switch to Claude Pro',
        savingsPerMonth: tool.monthlySpend - proCost, // they are likely paying 150 min
        reasoning: `Claude Team has a 5-seat minimum ($150/mo). For ${tool.seats} users, individual Pro accounts cost $${proCost}/mo. Switch to save $${tool.monthlySpend - proCost}/mo.`,
      };
    }
  }

  // 3. Specific Tool Logic: ChatGPT Team vs Plus
  if (tool.toolId === 'chatgpt' && tool.plan === 'team') {
    if (tool.seats < 2) {
      const plusCost = tool.seats * 20;
      return {
        toolId: tool.toolId,
        currentPlan: tool.plan,
        currentSpend: tool.monthlySpend,
        recommendation: 'Downgrade to ChatGPT Plus',
        savingsPerMonth: tool.monthlySpend - plusCost,
        reasoning: `ChatGPT Team requires 2 seats minimum ($60/mo). For a single user, Plus provides the same models for $20/mo.`,
      };
    }
  }

  return null;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
