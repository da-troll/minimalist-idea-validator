import type { ValidationResult, TrueFans, Community, MinimalViableProduct, RevenueModel, Verdict } from './types';

function detectCategory(idea: string): string {
  const lower = idea.toLowerCase();
  if (/saas|software|app|tool|platform|dashboard/.test(lower)) return 'saas';
  if (/marketplace|connect|match|hire|freelan/.test(lower)) return 'marketplace';
  if (/course|learn|teach|education|skill/.test(lower)) return 'education';
  if (/content|newsletter|media|blog|podcast/.test(lower)) return 'content';
  if (/community|network|forum|social/.test(lower)) return 'community';
  if (/ecommerce|shop|sell|store|product/.test(lower)) return 'ecommerce';
  if (/consult|service|agency|help|support/.test(lower)) return 'service';
  return 'saas'; // default
}

function detectAudience(idea: string): string {
  const lower = idea.toLowerCase();
  if (/developer|engineer|coder|programmer|dev\b/.test(lower)) return 'developers';
  if (/designer|creative|ux|ui/.test(lower)) return 'designers';
  if (/founder|startup|entrepreneur/.test(lower)) return 'founders';
  if (/freelanc|solopreneu|independent/.test(lower)) return 'freelancers';
  if (/small business|smb|local business/.test(lower)) return 'small business owners';
  if (/market|sales|growth/.test(lower)) return 'marketers';
  if (/student|learn/.test(lower)) return 'students and learners';
  if (/creator|youtube|content/.test(lower)) return 'content creators';
  if (/remote|work from home/.test(lower)) return 'remote workers';
  return 'professionals';
}

function analyzeTrueFans(idea: string): TrueFans {
  const audience = detectAudience(idea);
  const category = detectCategory(idea);

  const painPointMap: Record<string, string> = {
    saas: 'spending too much time on manual, repetitive tasks that could be automated',
    marketplace: 'struggling to find quality connections and wasting time on mismatched opportunities',
    education: 'learning from generic content that doesn\'t address their specific situation',
    content: 'drowning in information noise and missing the signal that actually matters',
    community: 'feeling isolated and lacking peers who truly understand their challenges',
    ecommerce: 'overpaying for products or services that don\'t fit their exact needs',
    service: 'paying for bloated agencies when they need focused, expert help',
  };

  const whereToFindMap: Record<string, string[]> = {
    developers: ['GitHub discussions', 'Dev.to', 'Hacker News', 'Reddit r/webdev', 'Discord dev servers'],
    designers: ['Dribbble', 'Figma Community', 'Designer Hangout Slack', 'Twitter Design community'],
    founders: ['Indie Hackers', 'Y Combinator communities', 'Product Hunt', 'Twitter #buildinpublic'],
    freelancers: ['Upwork forums', 'Reddit r/freelance', 'Freelancers Union', 'LinkedIn groups'],
    'small business owners': ['Local chambers of commerce', 'Reddit r/smallbusiness', 'Facebook Groups', 'LinkedIn'],
    marketers: ['MarTech Alliance', 'GrowthHackers', 'Reddit r/marketing', 'Demand Curve community'],
    'students and learners': ['Reddit r/learnprogramming', 'Discord study servers', 'Twitter edutwitter'],
    'content creators': ['Creator Economy newsletter communities', 'YouTube Creator Academy', 'TikTok creators'],
    'remote workers': ['Remote OK forums', 'We Work Remotely community', 'Reddit r/digitalnomad'],
    professionals: ['LinkedIn', 'Industry-specific Slack communities', 'Niche subreddits', 'Trade conferences'],
  };

  return {
    count: 1000,
    profile: `${audience.charAt(0).toUpperCase() + audience.slice(1)} who are early adopters and power users — the kind who seek out new tools, share what works, and become vocal advocates`,
    painPoint: painPointMap[category] || painPointMap['saas'],
    whereToFind: whereToFindMap[audience] || whereToFindMap['professionals'],
    willingness: `If your tool saves them 2+ hours/week or makes them look significantly better at their job, they'll pay $20–50/month without much negotiation. Find 5 people who say "I need this yesterday" before building.`,
  };
}

function analyzeCommunity(idea: string): Community {
  const audience = detectAudience(idea);
  const category = detectCategory(idea);

  const platformMap: Record<string, string> = {
    developers: 'GitHub + Discord',
    designers: 'Twitter + Figma Community',
    founders: 'Twitter (X) + Indie Hackers',
    freelancers: 'LinkedIn + Reddit',
    'small business owners': 'Facebook Groups + LinkedIn',
    marketers: 'LinkedIn + Slack communities',
    'students and learners': 'Discord + Reddit',
    'content creators': 'Twitter + YouTube',
    'remote workers': 'Twitter + Reddit',
    professionals: 'LinkedIn + Slack',
  };

  const existingMap: Record<string, string[]> = {
    saas: ['Product Hunt', 'Indie Hackers', 'SaaS subreddits', 'BetaList'],
    marketplace: ['specific vertical forums', 'LinkedIn groups', 'industry Slack communities'],
    education: ['Learn-in-public Twitter', 'study Discord servers', 'Coursera/Udemy learner groups'],
    content: ['Newsletter communities', 'Substack reader groups', 'journalist networks'],
    community: ['existing adjacent communities', 'Facebook Groups', 'Mighty Networks'],
    ecommerce: ['niche Reddit communities', 'product review forums', 'brand Facebook groups'],
    service: ['professional associations', 'LinkedIn industry groups', 'local business networks'],
  };

  return {
    platform: platformMap[audience] || platformMap['professionals'],
    rationale: `Your audience already congregates here. Start where they are — don't try to move them to a new platform until you have strong pull.`,
    existingCommunities: existingMap[category] || existingMap['saas'],
    buildStrategy: `Join existing communities first. Contribute value for 30 days before mentioning your product. Document your build journey publicly (#buildinpublic). When you launch, you'll have warm contacts, not a cold audience.`,
  };
}

function analyzeMVP(idea: string): MinimalViableProduct {
  const category = detectCategory(idea);

  const coreMap: Record<string, string> = {
    saas: 'One workflow automation or insight that users can get value from in under 5 minutes of setup',
    marketplace: 'A simple listing + discovery mechanism with direct messaging between parties',
    education: 'A focused curriculum for one specific skill with measurable outcomes',
    content: 'A consistent publishing cadence with a distinctive editorial lens',
    community: 'A moderated space with 10–20 founding members who define the culture',
    ecommerce: 'A curated catalog of 10–20 products with frictionless checkout',
    service: 'A productized offer with clear scope, price, and delivery timeline',
  };

  const techMap: Record<string, string[]> = {
    saas: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel'],
    marketplace: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'Vercel'],
    education: ['Next.js', 'MDX', 'Tailwind CSS', 'Vercel'],
    content: ['Ghost CMS', 'Substack', 'or plain Next.js'],
    community: ['Discord', 'Circle.so', 'or Slack'],
    ecommerce: ['Shopify', 'or Next.js + Stripe'],
    service: ['Notion', 'Carrd', 'or simple landing page'],
  };

  const featuresMap: Record<string, string[]> = {
    saas: ['Core action/automation', 'Simple onboarding', 'Results dashboard', 'Export or share functionality'],
    marketplace: ['Profile creation', 'Search/filter', 'Direct messaging', 'Basic review system'],
    education: ['Structured lessons', 'Progress tracking', 'Community Q&A', 'Completion certificate'],
    content: ['Subscribe form', 'Archive of posts', 'RSS feed', 'Social sharing'],
    community: ['Member profiles', 'Discussion threads', 'Event calendar', 'Resource library'],
    ecommerce: ['Product catalog', 'Cart + checkout', 'Order confirmation', 'Email receipts'],
    service: ['Service description', 'Pricing page', 'Booking form', 'Case studies'],
  };

  const skipMap: Record<string, string[]> = {
    saas: ['Team collaboration', 'Advanced permissions', 'API access', 'White-labeling', 'Mobile app'],
    marketplace: ['Escrow payments', 'Dispute resolution', 'Advanced search algorithms', 'Recommendation engine'],
    education: ['Live video', 'Certificates API', 'Advanced gamification', 'Mobile apps'],
    content: ['Paywalled tiers', 'Podcast integration', 'Advanced analytics', 'Multi-author'],
    community: ['Custom domains', 'Native mobile app', 'Advanced moderation AI', 'Monetization tools'],
    ecommerce: ['Subscription bundles', 'Inventory management', 'Multi-currency', 'Loyalty programs'],
    service: ['CRM integration', 'Automated reporting', 'Client portal', 'Team scheduling'],
  };

  return {
    coreSolution: coreMap[category] || coreMap['saas'],
    features: featuresMap[category] || featuresMap['saas'],
    buildTime: '2–4 weeks for a solo founder working part-time',
    techStack: techMap[category] || techMap['saas'],
    skipFeatures: skipMap[category] || skipMap['saas'],
  };
}

function analyzeRevenue(idea: string): RevenueModel {
  const category = detectCategory(idea);
  const audience = detectAudience(idea);

  const isEnterpriseAudience = ['developers', 'founders', 'marketers'].includes(audience);
  const basePrice = isEnterpriseAudience ? '$29' : '$19';
  const highPrice = isEnterpriseAudience ? '$99' : '$49';

  const modelMap: Record<string, string> = {
    saas: 'Monthly SaaS subscription',
    marketplace: 'Transaction fee (10–20%) or SaaS seats',
    education: 'One-time course purchase + optional coaching upsell',
    content: 'Paid newsletter subscription',
    community: 'Monthly membership fee',
    ecommerce: 'Product margin (30–60%)',
    service: 'Productized service (fixed-scope, fixed-price)',
  };

  const pricingMap: Record<string, string> = {
    saas: `${basePrice}/mo solo · ${highPrice}/mo team — charge for value delivered, not features`,
    marketplace: `Free to list · 15% fee on successful transactions · ${highPrice}/mo featured placement`,
    education: `$197 core course · $497 with coaching · $97/mo community access`,
    content: `Free tier (3 posts/mo) · ${basePrice}/mo full access · ${highPrice}/mo + community`,
    community: `${basePrice}/mo basic · ${highPrice}/mo pro with access to founder office hours`,
    ecommerce: `Price anchored to quality perception — margins over volume at MVP stage`,
    service: `$997–$2,997 per engagement — value-priced, not hourly`,
  };

  return {
    model: modelMap[category] || modelMap['saas'],
    pricing: pricingMap[category] || pricingMap['saas'],
    monthlyTarget: `$10,000 MRR = your first real milestone. At ${basePrice}/mo, that's ~345 paying customers — absolutely achievable with 1,000 true fans.`,
    pathTo1000: `Month 1–3: 10 beta users (free/discounted). Get them to real outcomes. Document stories. Month 4–6: 50 paying users via referrals + content. Month 7–12: Scale to 200+ via paid channels + partnerships. You don't need viral growth — you need consistent compounding.`,
    alternatives: [
      'Lifetime deal launch on AppSumo ($97–$297 one-time) to fund development',
      'Annual plan discount (2 months free) to improve cash flow',
      'Consulting or done-for-you tier to learn what customers actually need',
    ],
  };
}

function scoreIdea(idea: string): Verdict {
  const lower = idea.toLowerCase();
  let score = 50; // base score

  // Positive signals
  if (/specific|niche|for\s+\w+s\b/.test(lower)) score += 10; // specificity
  if (/tool|app|software|platform/.test(lower)) score += 5; // tangible product
  if (/save|automat|faster|easier|cheaper/.test(lower)) score += 10; // clear value prop
  if (/developer|designer|founder|creator/.test(lower)) score += 8; // defined audience
  if (lower.length > 30) score += 5; // thought out
  if (lower.length > 80) score += 3; // well articulated

  // Negative signals
  if (/ai|gpt|chatgpt|openai/.test(lower)) score -= 5; // crowded space
  if (/blockchain|crypto|nft|web3/.test(lower)) score -= 15; // bad timing
  if (/social network|facebook|twitter clone/.test(lower)) score -= 20; // network effect trap
  if (/uber for|airbnb for|tinder for/.test(lower)) score -= 10; // overused framing
  if (/everyone|anyone|anyone can|all people/.test(lower)) score -= 15; // too broad

  score = Math.max(10, Math.min(95, score));

  let label: Verdict['label'];
  if (score >= 70) label = 'Strong';
  else if (score >= 55) label = 'Viable';
  else if (score >= 40) label = 'Risky';
  else label = 'Avoid';

  const summaryMap: Record<Verdict['label'], string> = {
    Strong: 'This idea has a clear audience, tangible value prop, and a viable path to $10K MRR. Focus on finding 5 people who desperately want this before writing a line of code.',
    Viable: 'Solid foundation, but needs sharper focus. Niche down further — the more specific your ICP, the faster you\'ll find traction.',
    Risky: 'The core concept is workable, but there are real risks here. Validate the problem exists before investing time in a solution.',
    Avoid: 'As described, this idea faces structural challenges that are hard to overcome. Consider pivoting the framing or niche before proceeding.',
  };

  const riskMap: Record<string, string> = {
    saas: 'Feature creep before finding product-market fit — build less, learn more',
    marketplace: 'The cold-start problem — you need supply AND demand simultaneously',
    education: 'Commoditization — generic courses compete on price; specific courses compete on outcomes',
    content: 'Audience building takes 12–18 months minimum; monetization is a lagging indicator',
    community: 'Low initial value without members; requires active curation to prevent ghost town',
    ecommerce: 'Margin compression and customer acquisition costs kill most e-commerce MVPs',
    service: 'Trading time for money doesn\'t scale; needs to productize quickly',
  };

  const category = detectCategory(idea);

  return {
    score,
    label,
    summary: summaryMap[label],
    topRisk: riskMap[category] || riskMap['saas'],
    nextStep: `Talk to 5 potential customers this week. Don\'t pitch — ask about their current workflow. "What\'s the most painful part of [problem area] for you right now?" One conversation = more signal than a month of building.`,
  };
}

export function analyzeIdea(idea: string): ValidationResult {
  return {
    idea,
    trueFans: analyzeTrueFans(idea),
    community: analyzeCommunity(idea),
    mvp: analyzeMVP(idea),
    revenue: analyzeRevenue(idea),
    verdict: scoreIdea(idea),
  };
}

export function generateShareableUrl(idea: string): string {
  const encoded = encodeURIComponent(idea);
  return `${window.location.href.split('?')[0]}?idea=${encoded}`;
}
