export interface ValidationResult {
  idea: string;
  trueFans: TrueFans;
  community: Community;
  mvp: MinimalViableProduct;
  revenue: RevenueModel;
  verdict: Verdict;
}

export interface TrueFans {
  count: number;
  profile: string;
  painPoint: string;
  whereToFind: string[];
  willingness: string;
}

export interface Community {
  platform: string;
  rationale: string;
  existingCommunities: string[];
  buildStrategy: string;
}

export interface MinimalViableProduct {
  coreSolution: string;
  features: string[];
  buildTime: string;
  techStack: string[];
  skipFeatures: string[];
}

export interface RevenueModel {
  model: string;
  pricing: string;
  monthlyTarget: string;
  pathTo1000: string;
  alternatives: string[];
}

export interface Verdict {
  score: number; // 0-100
  label: 'Strong' | 'Viable' | 'Risky' | 'Avoid';
  summary: string;
  topRisk: string;
  nextStep: string;
}
