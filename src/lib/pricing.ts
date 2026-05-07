export interface PlanData {
  seats: number | null; // min seats, null for custom
  monthlyPrice: number | null; // null for custom/api
  description: string;
}

export interface ToolPricing {
  name: string;
  plans: Record<string, PlanData>;
}

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    name: 'Cursor',
    plans: {
      hobby: { seats: 1, monthlyPrice: 0, description: 'Free' },
      pro: { seats: 1, monthlyPrice: 20, description: '$20/user/month' },
      business: { seats: 1, monthlyPrice: 40, description: '$40/user/month' },
      enterprise: { seats: null, monthlyPrice: null, description: 'Custom' },
    },
  },
  copilot: {
    name: 'GitHub Copilot',
    plans: {
      individual: { seats: 1, monthlyPrice: 10, description: '$10/user/month' },
      business: { seats: 1, monthlyPrice: 19, description: '$19/user/month' },
      enterprise: { seats: 1, monthlyPrice: 39, description: '$39/user/month' },
    },
  },
  claude: {
    name: 'Claude',
    plans: {
      free: { seats: 1, monthlyPrice: 0, description: 'Free' },
      pro: { seats: 1, monthlyPrice: 20, description: '$20/user/month' },
      team: { seats: 5, monthlyPrice: 30, description: '$30/user/month (min 5 seats)' },
      enterprise: { seats: null, monthlyPrice: null, description: 'Custom' },
      api: { seats: 1, monthlyPrice: null, description: 'Pay per token' },
    },
  },
  chatgpt: {
    name: 'ChatGPT',
    plans: {
      free: { seats: 1, monthlyPrice: 0, description: 'Free' },
      plus: { seats: 1, monthlyPrice: 20, description: '$20/user/month' },
      team: { seats: 2, monthlyPrice: 30, description: '$30/user/month' },
      enterprise: { seats: null, monthlyPrice: null, description: 'Custom' },
      api: { seats: 1, monthlyPrice: null, description: 'Pay per token' },
    },
  },
  anthropic_api: {
    name: 'Anthropic API',
    plans: {
      api: { seats: 1, monthlyPrice: null, description: 'Pay per token' },
    },
  },
  openai_api: {
    name: 'OpenAI API',
    plans: {
      api: { seats: 1, monthlyPrice: null, description: 'Pay per token' },
    },
  },
  gemini: {
    name: 'Gemini',
    plans: {
      free: { seats: 1, monthlyPrice: 0, description: 'Free' },
      advanced: { seats: 1, monthlyPrice: 20, description: '$20/user/month' },
      api: { seats: 1, monthlyPrice: null, description: 'Pay per token' },
    },
  },
  windsurf: {
    name: 'Windsurf',
    plans: {
      free: { seats: 1, monthlyPrice: 0, description: 'Free' },
      pro: { seats: 1, monthlyPrice: 15, description: '$15/user/month' },
      business: { seats: 1, monthlyPrice: 29, description: '$29/user/month' },
    },
  },
};
