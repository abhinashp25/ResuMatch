// Curated database of real companies with official career page links.
// Used to recommend companies to users based on their resume match score and job title.

export const COMPANIES = [

  // ─── Tier 1: Top-tier global companies (best fit for score 70+) ──────────

  {
    id: 'google',
    name: 'Google',
    logo: 'G',
    color: '#4285F4',
    bgColor: '#EEF4FF',
    industry: 'Technology',
    hq: 'Mountain View, USA',
    size: '180,000+',
    website: 'https://www.google.com',
    careers: 'https://careers.google.com',
    tier: 1,
    tags: ['Tech', 'Cloud', 'AI', 'Search'],
    focus: ['Algorithms', 'Data Structures', 'System Design', 'Python', 'Go'],
    process: '4–5 rounds: Coding → System Design → Behavioral → Googleyness',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'M',
    color: '#00A4EF',
    bgColor: '#E8F8FF',
    industry: 'Technology',
    hq: 'Redmond, USA',
    size: '220,000+',
    website: 'https://www.microsoft.com',
    careers: 'https://careers.microsoft.com',
    tier: 1,
    tags: ['Tech', 'Cloud', 'Azure', 'AI'],
    focus: ['C#', 'Azure', 'System Design', 'Algorithms', 'TypeScript'],
    process: '4 rounds: Coding → System Design → Behavioral → Hiring Manager',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'A',
    color: '#FF9900',
    bgColor: '#FFF8EE',
    industry: 'Technology',
    hq: 'Seattle, USA',
    size: '1,500,000+',
    website: 'https://www.amazon.com',
    careers: 'https://www.amazon.jobs',
    tier: 1,
    tags: ['Tech', 'AWS', 'Cloud', 'E-commerce'],
    focus: ['Leadership Principles', 'System Design', 'Java', 'Python', 'AWS'],
    process: '5–6 rounds: OA → Phone Screen → Virtual Onsite (coding + behavioral)',
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'f',
    color: '#0866FF',
    bgColor: '#EEF4FF',
    industry: 'Technology',
    hq: 'Menlo Park, USA',
    size: '70,000+',
    website: 'https://www.meta.com',
    careers: 'https://metacareers.com',
    tier: 1,
    tags: ['Tech', 'AI', 'Social', 'AR/VR'],
    focus: ['Algorithms', 'System Design', 'Python', 'C++', 'React'],
    process: '3–4 rounds: Coding → System Design → Behavioral → Product Sense',
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: '⌘',
    color: '#555555',
    bgColor: '#F5F5F5',
    industry: 'Technology',
    hq: 'Cupertino, USA',
    size: '160,000+',
    website: 'https://www.apple.com',
    careers: 'https://jobs.apple.com',
    tier: 1,
    tags: ['Tech', 'Hardware', 'iOS', 'macOS'],
    focus: ['Swift', 'Objective-C', 'System Design', 'Python', 'C++'],
    process: '4–6 rounds: Coding → Domain-Specific → System Design → Team Fit',
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    logo: 'D',
    color: '#86BC25',
    bgColor: '#F5FCEB',
    industry: 'Consulting',
    hq: 'New York, USA',
    size: '430,000+',
    website: 'https://www.deloitte.com',
    careers: 'https://apply.deloitte.com',
    tier: 1,
    tags: ['Consulting', 'Audit', 'Advisory', 'Cloud', 'Tech'],
    focus: ['Business Analysis', 'Cloud', 'AI', 'Cybersecurity', 'SAP'],
    process: '3 rounds: Aptitude → Case Study + Group Discussion → HR Interview',
  },
  {
    id: 'accenture',
    name: 'Accenture',
    logo: 'Ac',
    color: '#A100FF',
    bgColor: '#F6EEFF',
    industry: 'IT Consulting',
    hq: 'Dublin, Ireland',
    size: '740,000+',
    website: 'https://www.accenture.com',
    careers: 'https://www.accenture.com/in-en/careers',
    tier: 1,
    tags: ['Consulting', 'Tech', 'Cloud', 'AI'],
    focus: ['Cloud', 'Java', 'Python', 'SAP', 'Salesforce'],
    process: '3 rounds: Online Assessment → Technical Interview → HR Round',
  },
  {
    id: 'ibm',
    name: 'IBM',
    logo: 'IBM',
    color: '#006699',
    bgColor: '#EEF5FF',
    industry: 'Technology',
    hq: 'Armonk, USA',
    size: '280,000+',
    website: 'https://www.ibm.com',
    careers: 'https://www.ibm.com/employment/',
    tier: 1,
    tags: ['Tech', 'Cloud', 'AI', 'Blockchain'],
    focus: ['Java', 'Python', 'Cloud', 'AI/ML', 'Microservices'],
    process: '3–4 rounds: Aptitude → Technical → HR → Panel Round',
  },
  {
    id: 'oracle',
    name: 'Oracle',
    logo: 'O',
    color: '#C74634',
    bgColor: '#FFF0EE',
    industry: 'Technology',
    hq: 'Austin, USA',
    size: '160,000+',
    website: 'https://www.oracle.com',
    careers: 'https://www.oracle.com/careers/',
    tier: 1,
    tags: ['Tech', 'Database', 'Cloud', 'ERP', 'Java'],
    focus: ['Java', 'SQL', 'PL/SQL', 'Cloud', 'System Design'],
    process: '3–4 rounds: Coding → Technical Deep Dive → Managerial → HR',
  },
  {
    id: 'goldman',
    name: 'Goldman Sachs',
    logo: 'GS',
    color: '#5F9EA0',
    bgColor: '#EDF6F6',
    industry: 'Finance',
    hq: 'New York, USA',
    size: '48,000+',
    website: 'https://www.goldmansachs.com',
    careers: 'https://www.goldmansachs.com/careers/',
    tier: 1,
    tags: ['Finance', 'FinTech', 'Banking', 'Investment'],
    focus: ['Java', 'Python', 'Algorithms', 'System Design', 'Finance'],
    process: '5 rounds: HackerRank OA → 2 Technical → 2 Behavioral / Case rounds',
  },

  // ─── Tier 2: Strong IT services / mid-tier tech ───────────────────────────

  {
    id: 'tcs',
    name: 'TCS',
    logo: 'TCS',
    color: '#00ADEF',
    bgColor: '#EAF7FF',
    industry: 'IT Services',
    hq: 'Mumbai, India',
    size: '600,000+',
    website: 'https://www.tcs.com',
    careers: 'https://ibegin.tcs.com/iBegin/',
    tier: 2,
    tags: ['IT', 'Services', 'Consulting', 'India'],
    focus: ['Java', 'Python', 'SQL', 'Data Structures', 'Aptitude'],
    process: '3 rounds: TCS NQT / Ninja Test → Technical Interview → HR Round',
  },
  {
    id: 'infosys',
    name: 'Infosys',
    logo: 'Infy',
    color: '#007CC3',
    bgColor: '#EAF5FF',
    industry: 'IT Services',
    hq: 'Bengaluru, India',
    size: '330,000+',
    website: 'https://www.infosys.com',
    careers: 'https://career.infosys.com/joblist',
    tier: 2,
    tags: ['IT', 'Services', 'Consulting', 'India'],
    focus: ['Java', 'Python', 'SQL', 'Logical Reasoning', 'Communication'],
    process: '3 rounds: InfyTQ Aptitude → Technical Interview → HR Interview',
  },
  {
    id: 'wipro',
    name: 'Wipro',
    logo: 'W',
    color: '#341C68',
    bgColor: '#F0EEFF',
    industry: 'IT Services',
    hq: 'Bengaluru, India',
    size: '250,000+',
    website: 'https://www.wipro.com',
    careers: 'https://careers.wipro.com/opportunities/jobs',
    tier: 2,
    tags: ['IT', 'Services', 'Cloud', 'India'],
    focus: ['C', 'Java', 'Python', 'SQL', 'Communication'],
    process: '3 rounds: NLTH Online Test → Technical Interview → HR Interview',
  },
  {
    id: 'hcl',
    name: 'HCL Technologies',
    logo: 'HCL',
    color: '#0057A8',
    bgColor: '#EEF5FF',
    industry: 'IT Services',
    hq: 'Noida, India',
    size: '220,000+',
    website: 'https://www.hcltech.com',
    careers: 'https://www.hcltech.com/careers',
    tier: 2,
    tags: ['IT', 'Services', 'Cloud', 'IoT', 'India'],
    focus: ['Java', 'Python', 'C++', 'SQL', 'Networking'],
    process: '3–4 rounds: Aptitude Test → Technical → Project Round → HR',
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    logo: 'CTS',
    color: '#1998D5',
    bgColor: '#EAF7FF',
    industry: 'IT Services',
    hq: 'Teaneck, USA',
    size: '350,000+',
    website: 'https://www.cognizant.com',
    careers: 'https://careers.cognizant.com',
    tier: 2,
    tags: ['IT', 'Services', 'Consulting', 'Healthcare IT'],
    focus: ['Java', 'Python', '.NET', 'SQL', 'Business Analysis'],
    process: '3 rounds: Online Assessment → Technical Interview → HR Interview',
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    logo: 'Cap',
    color: '#0070AD',
    bgColor: '#EAF4FF',
    industry: 'IT Consulting',
    hq: 'Paris, France',
    size: '360,000+',
    website: 'https://www.capgemini.com',
    careers: 'https://www.capgemini.com/in-en/careers/',
    tier: 2,
    tags: ['Consulting', 'IT', 'Cloud', 'AI', 'Digital'],
    focus: ['Java', 'Python', 'Cloud', 'SAP', 'Pseudo-code'],
    process: '3 rounds: Pseudo-Code Test → Technical Interview → HR Interview',
  },
  {
    id: 'techmahindra',
    name: 'Tech Mahindra',
    logo: 'TM',
    color: '#CC0000',
    bgColor: '#FFF0F0',
    industry: 'IT Services',
    hq: 'Pune, India',
    size: '150,000+',
    website: 'https://www.techmahindra.com',
    careers: 'https://careers.techmahindra.com',
    tier: 2,
    tags: ['IT', 'Telecom', '5G', 'India'],
    focus: ['Java', 'Python', 'Telecom Protocols', 'Cloud', 'Networking'],
    process: '3 rounds: Aptitude + Coding → Technical Interview → HR Round',
  },
  {
    id: 'ltimindtree',
    name: 'LTIMindtree',
    logo: 'LTIM',
    color: '#007B40',
    bgColor: '#EDFBF3',
    industry: 'IT Services',
    hq: 'Mumbai, India',
    size: '85,000+',
    website: 'https://www.ltimindtree.com',
    careers: 'https://www.ltimindtree.com/careers/',
    tier: 2,
    tags: ['IT', 'Services', 'Cloud', 'AI', 'India'],
    focus: ['Java', 'Python', 'SQL', 'Algorithms', 'Cloud'],
    process: '3 rounds: Written Test → Technical Interview → HR Round',
  },
  {
    id: 'zoho',
    name: 'Zoho',
    logo: 'Z',
    color: '#E42527',
    bgColor: '#FFF0F0',
    industry: 'SaaS',
    hq: 'Chennai, India',
    size: '15,000+',
    website: 'https://www.zoho.com',
    careers: 'https://careers.zohocorp.com',
    tier: 2,
    tags: ['SaaS', 'CRM', 'Product', 'India'],
    focus: ['C', 'Java', 'Algorithms', 'Data Structures', 'Problem Solving'],
    process: '3–5 rounds: Coding Test → Technical Interviews (2–3) → HR',
  },
  {
    id: 'freshworks',
    name: 'Freshworks',
    logo: 'FW',
    color: '#FC5227',
    bgColor: '#FFF3EE',
    industry: 'SaaS',
    hq: 'San Mateo, USA',
    size: '7,000+',
    website: 'https://www.freshworks.com',
    careers: 'https://www.freshworks.com/company/careers/',
    tier: 2,
    tags: ['SaaS', 'CRM', 'Product', 'Startup'],
    focus: ['Ruby on Rails', 'React', 'PostgreSQL', 'System Design', 'Python'],
    process: '3–4 rounds: Coding Challenge → Technical (x2) → Hiring Manager',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    logo: 'Fk',
    color: '#1462A8',
    bgColor: '#EEF5FF',
    industry: 'E-Commerce',
    hq: 'Bengaluru, India',
    size: '30,000+',
    website: 'https://www.flipkartcareers.com',
    careers: 'https://www.flipkartcareers.com/#jobs',
    tier: 2,
    tags: ['E-Commerce', 'Tech', 'India', 'Logistics'],
    focus: ['Java', 'Python', 'System Design', 'Algorithms', 'Data Structures'],
    process: '4 rounds: Online Coding → Technical (x2) → Hiring Manager Round',
  },
];

/**
 * Match companies to a candidate based on their resume match score and job title.
 * Returns the most relevant companies, ordered by fit.
 *
 * @param {number} score   - Resume match score (0–100)
 * @param {string} jobTitle - Job title extracted from the resume analysis
 * @param {number} limit   - Maximum number of companies to return
 */
export function getMatchedCompanies(score, jobTitle = '', limit = 9) {
  const title = jobTitle.toLowerCase();

  const scoredList = COMPANIES.map(company => {
    let relevance = 0;

    // Tier fit based on match score
    if (score >= 70 && company.tier === 1) relevance += 12;
    else if (score >= 70 && company.tier === 2) relevance += 6;
    else if (score >= 40 && company.tier === 2) relevance += 12;
    else if (score >= 40 && company.tier === 1) relevance += 4; // stretch goal
    else if (score < 40 && company.tier === 2) relevance += 12;

    // Industry relevance based on job title keywords
    const companyText = [
      ...company.tags,
      ...company.focus,
      company.industry,
    ].map(t => t.toLowerCase()).join(' ');

    if (title.includes('data') && companyText.includes('ai')) relevance += 6;
    if (title.includes('cloud') && companyText.includes('cloud')) relevance += 6;
    if ((title.includes('java') || title.includes('backend')) && companyText.includes('java')) relevance += 5;
    if (title.includes('python') && companyText.includes('python')) relevance += 5;
    if (title.includes('frontend') || title.includes('react')) {
      if (companyText.includes('react') || companyText.includes('saas')) relevance += 5;
    }
    if (title.includes('consult') && company.industry.toLowerCase().includes('consult')) relevance += 8;
    if ((title.includes('finance') || title.includes('bank')) && company.tags.includes('Finance')) relevance += 8;
    if (title.includes('mobile') || title.includes('ios') || title.includes('android')) {
      if (['apple', 'google', 'meta'].includes(company.id)) relevance += 6;
    }

    // Small deterministic variation so results feel organic, not alphabetical
    relevance += (company.name.charCodeAt(0) % 4);

    return { ...company, relevance };
  });

  // Primary sort: relevance score. Secondary: tier (lower = better for high scorers).
  return scoredList
    .sort((a, b) => {
      if (b.relevance !== a.relevance) return b.relevance - a.relevance;
      return score >= 70 ? a.tier - b.tier : b.tier - a.tier;
    })
    .slice(0, limit)
    .map(({ relevance, ...company }) => company); // strip internal relevance field
}
