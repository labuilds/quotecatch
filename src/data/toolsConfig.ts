export type ToolType = 'calculator' | 'text-generator' | 'template';

export interface ToolInput {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select';
  placeholder?: string;
  description?: string;
  options?: string[];
}
export interface ToolConfig {
  slug: string;
  title: string;
  seoDescription: string;
  type: ToolType;
  resultLabel: string;
  inputs: ToolInput[];
  compute: (values: Record<string, string>) => string;
  iconName?: string;
  faqs?: { question: string; answer: string }[];
}

export const toolsConfig: ToolConfig[] = [
  {
    slug: 'shingle-waste-calculator',
    title: 'Precision Waste Factor & Supplementation Estimator',
    seoDescription: 'Professional waste factor calculator for roofing supplements, designed to reconcile EagleView SWF vs. carrier Xactimate estimates.',
    type: 'calculator',
    resultLabel: 'B2B Technical Waste Schedule',
    inputs: [
      { id: 'squares', label: 'Field Squares (Aerial/Manual)', type: 'number', placeholder: 'e.g. 30', description: 'Enter the net area squares before waste.' },
      { 
        id: 'complexity', 
        label: 'Roof Complexity', 
        type: 'select', 
        options: ['Simple (Gable)', 'Moderate (Hip)', 'Complex (Multiple Valleys)'],
        description: 'Complex roofs require more waste allocation for cuts and hips.'
      },
      { id: 'valleys', label: 'Number of Valleys', type: 'number', placeholder: 'e.g. 4', description: 'Total number of structural valleys requiring flashing.' }
    ],
    compute: (values) => {
      const squares = Number(values.squares) || 0;
      const valleys = Number(values.valleys) || 0;
      let baseWaste = 10;
      
      if (values.complexity === 'Moderate (Hip)') baseWaste = 12;
      if (values.complexity === 'Complex (Multiple Valleys)') baseWaste = 15;
      
      const valleyImpact = (valleys * 0.5);
      const totalWaste = baseWaste + valleyImpact;
      const totalSquares = squares * (1 + totalWaste / 100);
      
      return `${totalWaste}% (${totalSquares.toFixed(2)} Total Squares)`;
    },
    faqs: [
      { 
        question: "How do I justify a 15% waste factor to State Farm adjusters?", 
        answer: "Use this tool to generate an itemized complexity report. Cite the EagleView Suggested Waste Factor (SWF) as an objective third-party benchmark. If the carrier applies a flat 10% on a complex hip roof, supplement by documenting manufacturer-mandated starter/ridge courses that are physically independent of field waste." 
      },
      { 
        question: "Why does my manual waste calculation differ from Xactimate's default?", 
        answer: "Xactimate often uses a 'minimized' waste algorithm that ignores specific hip/ridge profile depths. This tool provides a 'Net vs Gross' comparison, allowing you to prove the physical reality of shingle exposure requirements to a desk adjuster during the supplement process." 
      },
      { 
        question: "What is the impact of complexity multipliers on insurance supplements?", 
        answer: "Roofs with 9/12+ pitches or 10+ facets require significantly more technical cuts. Documenting the specific facet count and slope transition linear footage is the #1 way to win a waste-factor appeal and protect your project's net profit margin." 
      }
    ]
  },
  {
    slug: 'storm-door-knocking-script',
    title: 'Post-Storm Neighborhood Sales System',
    seoDescription: 'High-conversion B2B sales script for canvassing teams and sales reps targeting hail-hit ZIP codes.',
    type: 'text-generator',
    resultLabel: 'Custom Sales Pitch script',
    inputs: [
      { id: 'repName', label: 'Sales Rep Name', type: 'text', placeholder: 'e.g. John', description: 'Your name or the name of the rep at the door.' },
      { id: 'neighborhood', label: 'Neighborhood Name', type: 'text', placeholder: 'e.g. Oak Creek', description: 'Used to build immediate local familiarity.' },
      { id: 'stormDate', label: 'Date of Storm', type: 'text', placeholder: 'e.g. last Tuesday', description: 'Reminds the homeowner of the specific hail event.' }
    ],
    compute: (values) => {
      return `Hey there! My name is ${values.repName || '[Name]'} and I'm with QuoteCatch Roofing. 

I was just finishing up an inspection for your neighbor over at the end of ${values.neighborhood || '[Neighborhood]'} because of that nasty hail that came through ${values.stormDate || '[Storm Date]'}. 

Since I'm already in the area with my ladder, I'm doing complimentary 15-minute structural health checks for the rest of the block today. Most of your neighbors are finding that their insurance covers a full replacement if we find the right type of impact. 

Would it be a total inconvenience if I took a quick look at your shingles while the sun is still up?`;
    },
    faqs: [
      { 
        question: "What are the peak operational hours for a post-storm door knocking team?", 
        answer: "For maximum lead ROI, schedule your canvassers for 'The Golden Window' (4:00 PM – 7:30 PM) on weekdays. This timing ensures the highest 'homeowner-on-site' rate, significantly reducing your cost-per-lead compared to morning shifts." 
      },
      { 
        question: "How can I train my sales reps to use the SLAP formula effectively?", 
        answer: "Train reps to lead with Social proof (mentioning a nearby neighbor) and then immediately offer a low-friction inspection. The goal is to move from the 'annoying salesman' category to the 'helpful local expert' category within the first 15 seconds." 
      },
      { 
        question: "How should my team handle a 'no' during door knocking sessions?", 
        answer: "Reframe a 'no' as a request for lower stakes. Have reps offer a quick '5-minute gutter wellness check' from the ground. This often opens the door to a full roof inspection once the homeowner sees a tangible, non-threatening professional at work." 
      }
    ]
  },
  {
    slug: 'email-follow-up-template',
    title: 'Multi-Touch Sales Pipeline Follow-Up',
    seoDescription: 'Professional follow-up templates designed to move roofing leads through the sales cycle from estimate to signed contract.',
    type: 'template',
    resultLabel: 'Outbound Sales Content',
    inputs: [
      { id: 'clientName', label: 'Homeowner Name', type: 'text', placeholder: 'e.g. Mrs. Smith', description: 'The person you previously provided an estimate for.' },
      { id: 'jobType', label: 'Type of Job', type: 'select', options: ['Roof Replacement', 'Roof Repair', 'Gutter Install'], description: 'Matches the content to their specific project type.' },
      { id: 'companyName', label: 'Your Company Name', type: 'text', placeholder: 'e.g. Reliable Roofing', description: 'Your business branding for the email signature.' }
    ],
    compute: (values) => {
      return `Subject: Quick question about your ${values.jobType || 'roofing'} project

Hi ${values.clientName || 'there'},

It was great connecting with you about your ${values.jobType || 'project'}. I know you have a lot on your plate right now, but I wanted to make sure you had all the information you needed regarding our recent estimate.

At ${values.companyName || 'our company'}, we pride ourselves on being the most transparent contractors in the business. If you have any questions about the materials or the timeline we discussed, just hit reply or give me a call at this number.

Looking forward to potentially working with you!

Best regards,
${values.companyName || 'The Team'}
`;
    },
    faqs: [
      { 
        question: "What is the industry benchmark for roofing estimate follow-up timing?", 
        answer: "Top-performing roofing companies send the first follow-up within 24–48 hours of estimate delivery. This ensures your bid remains top-of-mind before the homeowner receives competing quotes from other local contractors." 
      },
      { 
        question: "How can I optimize follow-up subject lines for higher open rates?", 
        answer: "Use direct, client-specific subject lines like 'Update on your [Street Name] roof' or 'Question about your estimate.' Professionalism in the subject line increases your 'pro status' and separates you from automated spam outreach." 
      },
      { 
        question: "How many touchpoints should be in a roofing sales follow-up sequence?", 
        answer: "A standard high-conversion sequence includes 4 touchpoints over 10 days: a personal email, a check-in phone call, a second email with a 'social proof' case study, and a final 'break-up' email to clear your pipeline." 
      }
    ]
  },
  {
    slug: 'metal-roofing-cost-calculator',
    title: 'Metal System Spec & Cost Estimator',
    seoDescription: 'Technical estimation tool for metal roofing projects, factoring in gauge thickness and profile complexity.',
    type: 'calculator',
    resultLabel: 'System Estimate Total',
    inputs: [
      { id: 'area', label: 'Roof Area (Squares)', type: 'number', placeholder: 'e.g. 25' },
      { id: 'gauge', label: 'Metal Gauge', type: 'select', options: ['24 Gauge (Premium)', '26 Gauge (Standard)', '29 Gauge (Economy)'] },
      { id: 'complexity', label: 'Complexity multiplier', type: 'select', options: ['Simple (1.0)', 'Average (1.2)', 'Difficult (1.5)'] }
    ],
    compute: (values) => {
      const area = Number(values.area) || 0;
      let pricePerSquare = 800;
      if (values.gauge === '24 Gauge (Premium)') pricePerSquare = 1200;
      if (values.gauge === '26 Gauge (Standard)') pricePerSquare = 950;
      
      let mult = 1.0;
      if (values.complexity === 'Average (1.2)') mult = 1.2;
      if (values.complexity === 'Difficult (1.5)') mult = 1.5;
      
      const total = area * pricePerSquare * mult;
      return `$${total.toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How do I estimate waste for Standing Seam vs. Exposed Fastener panels?", 
        answer: "Exposed fastener panels (R-panels) typically have a 5–7% waste factor because they can be easily lapped and reused. Standing seam requires a 10–12% waste factor due to the non-reversible nature of the proprietary locking systems and precision flashing requirements." 
      },
      { 
        question: "What is the industry standard for estimating metal roofing trim linear footage?", 
        answer: "Rule of thumb is to order 1.1x the total perimeter for drip edge and rake trim. For valleys and ridges, use a 1.15 multiplier to account for miter cuts and overlaps at junctions, which are the most common source of metal-roof 'shortages'." 
      },
      { 
        question: "How do I calculate the required fastener count per square for metal panels?", 
        answer: "For standard AG/R-panels, use 80 fasteners per 100 sq. ft. For high-wind zones, increase to 120 fasteners per square. Fasteners should be ordered in bulk bags (typically 250 count) to protect against job-site loss and ensuring a uniform seal." 
      }
    ]
  },
  {
    slug: 'shingle-bundle-calculator',
    title: 'Squares to Bundles (Precision Order Tool)',
    seoDescription: 'Contractor conversion tool to translate roof squares (including waste) into exact bundle counts for ordering.',
    type: 'calculator',
    resultLabel: 'Required Bundle Order',
    inputs: [
      { id: 'area', label: 'Roof Area (Squares)', type: 'number', placeholder: 'e.g. 20' },
      { id: 'waste', label: 'Waste Percentage', type: 'number', placeholder: 'e.g. 10' }
    ],
    compute: (values) => {
      const area = Number(values.area) || 0;
      const waste = Number(values.waste) || 10;
      const totalSquares = area * (1 + waste / 100);
      const bundles = Math.ceil(totalSquares * 3);
      return `${bundles} Bundles (${totalSquares.toFixed(1)} Total Squares)`;
    },
    faqs: [
      { 
        question: "When is a 6-nail fastening pattern legally required by the IRC?", 
        answer: "A 6-nail pattern is mandatory in 'High Wind' zones where the design wind speed exceeds 110 mph. Using 6 nails instead of 4 increases the shingles' wind-uplift rating (often to 130 mph), protecting your company from storm-related liability claims." 
      },
      { 
        question: "How does 'High-Nailing' impact my workmanship warranty?", 
        answer: "Nailing above the designated strip ('High-Nailing') is the leading cause of shingle blow-offs and automatically voids the manufacturer's warranty. Enforcing a strict 'Nail in the Zone' policy for your crews is the best way to prevent insurance disputes." 
      },
      { 
        question: "What is the material cost-to-risk benefit of using 3,000 nails vs. 2,000 per project?", 
        answer: "The cost difference for an extra thousand nails is less than $30. For a roofing business, this is the cheapest 'insurance policy' available. A 6-nail pattern drastically reduces callbacks for wind damage, which can cost $500+ in labor alone." 
      }
    ]
  },
  {
    slug: 'roof-pitch-multiplier-calculator',
    title: 'Pitch Multiplier & Aerial Report Reconciler',
    seoDescription: 'Professional tool for reconciling manual pitch measurements with EagleView/SkyMeasure reports to ensure accurate surface area multipliers in supplements.',
    type: 'calculator',
    resultLabel: 'Reconciled SAM Multiplier',
    inputs: [
      { id: 'rise', label: 'Rise (Vertical inches)', type: 'number', placeholder: 'e.g. 6' },
      { id: 'run', label: 'Run (Fixed at 12)', type: 'number', placeholder: '12', description: 'Horizontal distance is usually 12 inches for pitch.' }
    ],
    compute: (values) => {
      const rise = Number(values.rise) || 0;
      const run = 12;
      const multiplier = Math.sqrt(Math.pow(rise, 2) + Math.pow(run, 2)) / run;
      return multiplier.toFixed(4);
    },
    faqs: [
      { 
        question: "How do I reconcile an EagleView pitch discrepancy in a supplement?", 
        answer: "If your manual pitch gauge shows 10/12 but the aerial report lists 8/12, use this tool to calculate the SAM delta. Submit a time-stamped photo of your pitch gauge on a rafter to prove the structural reality and justify the increased material count." 
      },
      { 
        question: "What is the 'Effective SAM' used for insurance supplements?", 
        answer: "Insurance carriers often use flat-view multipliers that ignore the hypotenuse. This tool provides the exact decimal multiplier (e.g., 1.202 for 8/12) needed to justify your premium square count for high-complexity residential reroofs." 
      },
      { 
        question: "Why should my sales team always field-verify aerial pitch reports?", 
        answer: "Aerial AI can be throw off by tree shadows and eave overhangs. Catching a 'Two-Pitch' error before the start date protects your margins from under-ordering and prevents project delays during the installation phase." 
      }
    ]
  },
  {
    slug: 'commercial-tpo-estimator',
    title: 'Commercial TPO & NDL Warranty Spec Estimator',
    seoDescription: 'High-level commercial estimation tool for single-ply TPO systems, factoring in NDL warranty standards and mil-thickness.',
    type: 'calculator',
    resultLabel: 'TPO Project Scope Estimate',
    inputs: [
      { id: 'sqft', label: 'Total Square Footage', type: 'number', placeholder: 'e.g. 10000' },
      { id: 'insulation', label: 'Insulation Type', type: 'select', options: ['None', '1.5" Iso', '3.0" Iso', 'Tapered System'] }
    ],
    compute: (values) => {
      const sqft = Number(values.sqft) || 0;
      let basePrice = 6.50; // per sqft
      if (values.insulation === '1.5" Iso') basePrice += 1.50;
      if (values.insulation === '3.0" Iso') basePrice += 2.80;
      if (values.insulation === 'Tapered System') basePrice += 4.50;
      
      const total = sqft * basePrice;
      return `$${total.toLocaleString()}`;
    },
    faqs: [
      { 
        question: "Why is 60-mil TPO the industry standard for 20-year commercial NDL warranties?", 
        answer: "Most major manufacturers require a minimum of 60-mil thickness to qualify for a 'No Dollar Limit' (NDL) warranty. While 45-mil is cheaper, the 60-mil membrane offers superior puncture resistance and UV stability, which drastically reduces your long-term maintenance liability." 
      },
      { 
        question: "What are the labor cost implications of 'Fully Adhered' vs. 'Mechanically Fastened' TPO?", 
        answer: "Fully adhered systems require ~30% more labor and significant adhesive costs ($1.50+ sq/ft). However, they eliminate 'membrane flutter' and offer the highest wind-uplift ratings. Use 'Mechanically Fastened' for budget-conscious box retail and 'Fully Adhered' for premium office space." 
      },
      { 
        question: "How much extra membrane should I order for parapet walls and 6-inch seams?", 
        answer: "Always add 15-20% to the field square footage for TPO projects. This covers the mandatory 6-inch seam overlaps, 12-inch parapet wall flashing, and curb detailing. Underestimating these 'details' is the #1 reason commercial roofing bids lose margin." 
      }
    ]
  },
  {
    slug: 'pro-roofing-proposal-generator',
    title: 'Professional Roofing Scope & Proposal Builder',
    seoDescription: 'Generate comprehensive project scopes including itemized materials and warranty language for professional client presentations.',
    type: 'template',
    resultLabel: 'Generated Project Scope',
    inputs: [
      { id: 'customer', label: 'Customer Name', type: 'text', placeholder: 'John Doe' },
      { id: 'material', label: 'Selected Material', type: 'select', options: ['Asphalt Shingles', 'Standing Seam Metal', 'Stone Coated Steel'] },
      { id: 'warranty', label: 'Warranty Years', type: 'number', placeholder: '50' }
    ],
    compute: (values) => {
      return `PROPOSAL FOR: ${values.customer || 'Valued Customer'}
      
Based on our inspection, we recommend a full replacement using ${values.material || 'Premium Roofing Materials'}. 

Our installation includes:
- Full tear-off of existing layers
- High-performance synthetic underlayment
- Ice & Water shield in all valleys and penetrations
- Proper attic ventilation synchronization

This system comes with our industry-leading ${values.warranty || 'lifetime'} year workmanship warranty. We are ready to schedule your start date as early as next week.`;
    },
    faqs: [
      { 
        question: "What are the 'Closing Triggers' I should include in my roofing proposals?", 
        answer: "Use 'Scarcity' and 'Trust' triggers. Mention your next available start date (to drive urgency) and clearly display your Platinum/Master Elite status. High-res photos of the specific damage on their roof (rather than stock photos) are the single highest converting element in a proposal." 
      },
      { 
        question: "How should I structure my workmanship warranty to outperform local competitors?", 
        answer: "Offer a '5-Year No-Leak' guarantee as standard, but offer a 10-year or 25-year upgrade as part of a premium material package. This allows you to upsell higher-margin shingles while providing higher perceived value than 'tail-light' contractors." 
      },
      { 
        question: "How can a detailed scope of work prevent profit-eating 'scope creep'?", 
        answer: "By itemizing everything—from the number of pipe boots replaced to the linear footage of ice and water shield—you eliminate 'he-said, she-said' disputes. If the client asks for extra work during the job, the detailed scope makes it easy to issue a change order for more revenue." 
      }
    ]
  },
  {
    slug: 'gutter-length-calculator',
    title: 'Gutter Linear Footage & Miter Estimator',
    seoDescription: 'Calculate total linear footage for gutters and downspouts. Factor in miter counts and capacity requirements for 5" vs 6" K-style systems.',
    type: 'calculator',
    resultLabel: 'Linear Footage & Downspout Count',
    inputs: [
      { id: 'eaveLength', label: 'Total Eave Length (ft)', type: 'number', placeholder: '150' },
      { id: 'stories', label: 'Number of Stories', type: 'select', options: ['1 Story', '2 Stories', '3 Stories'] },
      { id: 'miters', label: 'Number of Corners (Miters)', type: 'number', placeholder: '4' }
    ],
    compute: (values) => {
      const ft = Number(values.eaveLength) || 0;
      const stories = values.stories === '1 Story' ? 1 : values.stories === '2 Stories' ? 2 : 3;
      const miters = Number(values.miters) || 0;
      const downspouts = Math.ceil(ft / 25);
      const dsLength = downspouts * (stories * 12);
      return `${ft} ft Gutter, ${downspouts} Downspouts (~${dsLength} ft total)`;
    },
    informationalText: 'Determine the exact linear footage for your gutter runs. A proper takeoff includes miter counts for every corner and downspout drops. Most residential installs use 5-inch K-style, but high-volume roofs require 6-inch capacity to prevent overflow callbacks.',
    faqs: [
      { 
        question: "What is the 'Rule of Thumb' for downspout spacing on high-volume residential roofs?", 
{ 
        question: "When is a 6-inch gutter mandatory for a residential contract?", 
        answer: "If the roof pitch is 8/12 or steeper, or if the roof surface area feeding into a single run exceeds 1,500 sq. ft., 5-inch gutters will likely overshoot during heavy downpours. Specifying 6-inch gutters in your bid demonstrates technical superiority and prevents future warranty calls for foundation erosion." 
      }
    ]
  },
  {
    slug: 'roof-ventilation-calculator',
    title: 'NFA Balancing & Venting Machine',
    seoDescription: 'Professional NFA calculation tool for balancing intake and exhaust. Ensure 50/50 airflow to prevent code failure and shingle blistering.',
    type: 'calculator',
    resultLabel: 'Required Net Free Area (Total)',
    inputs: [
      { id: 'atticSqft', label: 'Attic Floor Area (sq ft)', type: 'number', placeholder: '1500' },
      { id: 'isVaporBarrier', label: 'Vapor Barrier Present?', type: 'select', options: ['No (1:150)', 'Yes (1:300)'] }
    ],
    compute: (values) => {
      const area = Number(values.atticSqft) || 0;
      const ratio = values.isVaporBarrier === 'Yes (1:300)' ? 300 : 150;
      const nfaRequired = (area / ratio) * 144;
      return `${nfaRequired.toFixed(0)} sq inches NFA (Balanced: ${(nfaRequired / 2).toFixed(0)} Intake / ${(nfaRequired / 2).toFixed(0)} Exhaust)`;
    },
    faqs: [
      { 
        question: "Why should I strictly enforce a 50/50 NFA balance between intake and exhaust?", 
        answer: "Balanced ventilation prevents 'Negative Pressure.' If exhaust exceeds intake, the system will pull conditioned air from the house or moisture from the crawlspace into the attic, leading to mold growth and potentially voiding the shingle manufacturer's warranty." 
      },
      { 
        question: "How do I calculate NFA for 'Soffit-to-Ridge' systems?", 
        answer: "Calculate total ridge length and attic floor area. Use this tool to find the required NFA, then ensure your soffit intake exceeds or matches the ridge exhaust. A 1:150 ratio is the standard IRC requirement for roofs without a dedicated vapor barrier." 
      }
    ]
  },
  {
    slug: 'referral-system-builder',
    title: 'Professional Referral Pipeline & Loyalty System',
    seoDescription: 'Strategic referral tracking system for roofing contractors to increase organic lead volume through professional networking.',
    type: 'template',
    resultLabel: 'Referral Program Structure',
    inputs: [
      { id: 'reward', label: 'Referral Fee ($)', type: 'number', placeholder: '250' },
      { id: 'partnerType', label: 'Partner Type', type: 'select', options: ['Neighbor', 'Realtor', 'Insurance Agent'] }
    ],
    compute: (values) => {
      return `ROOFING REFERRAL PARTNER PLAN:
      
Target Partner: ${values.partnerType || 'Strategic Contact'}
Reward Structure: $${values.reward || '250'} per signed contract.

Key Messaging: "At our company, we don't spend money on billboards; we invest in our community. When you help a neighbor protect their home with a professional roof, we want to thank you with a direct reward."`;
    },
    faqs: [
      { 
        question: "How can I build a high-volume referral network with local Realtors?", 
        answer: "Position your company as the 'Closing Saver.' Offer Realtors priority 24-hour inspections for homes under contract. When you identify a roof issue and provide a fast, reliable estimate that keeps a deal moving, you become their go-to contractor for every future listing." 
      },
      { 
        question: "What is the optimal referral bonus for a $20,000 roofing contract?", 
        answer: "Standard referral fees range from $250 to $500. This is significantly lower than the $1,500+ you would spend on Google Ads to acquire the same customer. Treat your referral partners as your most cost-effective sales force." 
      }
    ]
  },
  {
    slug: 'insurance-appeal-rebuttal-generator',
    title: 'Insurance Claim Rebuttal & Appraisal Demand',
    seoDescription: 'Generate technical evidence-based rebuttals for insurance claim denials, citing IRC code and manufacturer installation specs.',
    type: 'text-generator',
    resultLabel: 'Professional Rebuttal Content',
    inputs: [
      { id: 'denialReason', label: 'Carrier Denial Reason', type: 'text', placeholder: 'Cosmetic damage only' },
      { id: 'codeSection', label: 'Relevant Code/Spec', type: 'text', placeholder: 'R905.2.1 (IRC)' }
    ],
    compute: (values) => {
      return `FORMAL TECHNICAL REBUTTAL:
      
Regarding the denial based on "${values.denialReason || 'Cosmetic issue'}", we formally cite ${values.codeSection || 'manufacturer installation requirements'}. 

The observed shingle bruising constitutes a functional 'Mat Fracture' which voids the manufacturer's waterproofing warranty. We look forward to meeting your adjuster at the property to ensure the homeowner receives the full coverage they are entitled to under their policy.`;
    },
    faqs: [
      { 
        question: "How do I cite manufacturer installation specs (Mat Fracture) in a rebuttal?", 
        answer: "Focus on shingle mat integrity. If a carrier denies 'bruising' as cosmetic, generate a rebuttal citing GAF or Owens Corning specs that prove mat fracture reduces the roof's waterproofing performance—invalidating the denial under the policy's duty to repair." 
      },
      { 
        question: "What is the specific language for an 'Appraisal Clause' escalation?", 
        answer: "When a carrier hits a technical deadlock, invoke the Appraisal Clause. The script generated by this tool uses the standard language: 'We hereby demand Appraisal under the terms of the policy to determine the amount of loss,' forcing a neutral umpire to resolve the dispute." 
      }
    ]
  },
  {
    slug: 'roofing-lead-reactivation-script',
    title: 'Aged Lead Reactivation & Price Protection Tool',
    seoDescription: 'Strategic sales scripts designed to re-engage cold leads by leveraging material price increases and limited-time system upgrades.',
    type: 'text-generator',
    resultLabel: 'Reactivation Outreach',
    inputs: [
      { id: 'client', label: 'Lead Name', type: 'text' },
      { id: 'timeAgo', label: 'Months Since Quote', type: 'number', placeholder: '6' }
    ],
    compute: (values) => {
      return `Hey ${values.client || 'there'}, it's been about ${values.timeAgo || 'a few'} months since we walked your roof. I know projects often get pushed to the back burner, but I wanted to reach out because material prices are scheduled for another 8% increase at the end of the month. 

I'd love to see if we can still honor that old quote before the new pricing kicks in. Do you have 2 minutes for a quick update on where your project stands?`;
    },
    faqs: [
      { 
        question: "How can I leverage material price increases to reactivate cold roofing leads?", 
        answer: "Lead with the data. Informing aged leads that shingles prices are scheduled for an 8%–12% hike next month creates genuine urgency. Professional contractors use this 'Price Protection' window to close leads that have been stagnant for 6+ months." 
      },
      { 
        question: "What is the industry benchmark for aged lead conversion in roofing?", 
        answer: "A well-executed reactivation campaign should see a 5%–10% conversion rate of cold estimates. Focus on lowering the barrier to entry by offering financing options or a no-cost 'secondary inspection' to identify any new storm damage that occurred since your first visit." 
      },
      { 
        question: "How should my sales team handle a lead that went to a 'Tail-Light' contractor?", 
        answer: "Position your company as the 'Project Correction' expert. Ask if they’ve received a copy of the permit yet or if the contractor provided a workmanship warranty. Often, homeowners realize the risk of the cheaper bid and pivot back to a licensed professional." 
      }
    ]
  },
  {
    slug: 'vinyl-siding-cost-calculator',
    title: 'Vinyl System Gauge & Profile Estimator',
    seoDescription: 'Professional estimation tool for vinyl siding projects, factoring in material gauge thickness and profile premiums.',
    type: 'calculator',
    resultLabel: 'Siding System Estimate',
    inputs: [
      { id: 'sqft', label: 'Wall Square Footage', type: 'number', placeholder: 'e.g. 2000' },
      { id: 'quality', label: 'Siding Quality', type: 'select', options: ['Standard (.040)', 'Premium (.044)', 'Insulated Vinyl'] }
    ],
    compute: (values) => {
      const sqft = Number(values.sqft) || 0;
      let price = 5.50; // standard install
      if (values.quality === 'Premium (.044)') price = 7.50;
      if (values.quality === 'Insulated Vinyl') price = 11.00;
      const total = sqft * price;
      return `$${total.toLocaleString()}`;
    },
    faqs: [
      { 
        question: "Why does '.044 Gauge' vinyl siding command a 30% price premium?", 
        answer: "Thicker gauge siding offers superior impact resistance and won't 'oil-can' (warp) as easily in high-heat environments. Positioning .044 gauge as 'The Commercial Standard' allows you to upsell homeowners who want a lifetime siding solution rather than a budget fix." 
      },
      { 
        question: "How do I price 'Insulated Vinyl' siding for maximum profit?", 
        answer: "Don't sell siding; sell 'Thermal Protection.' Insulated vinyl can increase the building's overall R-value by 2.0 to 3.0. Pitching the energy savings and R-value improvement justifies the $11–$15 per sq. ft. price point for a premium, high-margin install." 
      }
    ]
  },
  {
    slug: 'vinyl-siding-waste-calculator',
    title: 'Vinyl Siding Square & Waste Estimator',
    seoDescription: 'Calculate the number of siding squares needed for your project. Factor in overlap, trim waste, and gable-end cuts for accurate material ordering.',
    type: 'calculator',
    resultLabel: 'Required Siding Squares',
    inputs: [
      { id: 'wallArea', label: 'Total Wall Surface (sq ft)', type: 'number', placeholder: '2000' },
      { id: 'complexity', label: 'Wall Profile', type: 'select', options: ['Simple (10% Waste)', 'Average (12% Waste)', 'Difficult (15% Waste)'] }
    ],
    compute: (values) => {
      const area = Number(values.wallArea) || 0;
      let waste = 1.10;
      if (values.complexity === 'Average (12% Waste)') waste = 1.12;
      if (values.complexity === 'Difficult (15% Waste)') waste = 1.15;
      const squares = (area * waste) / 100;
      return `${squares.toFixed(2)} Squares`;
    },
    informationalText: 'Calculate total siding squares with realistic waste factors. Standard horizontal panels require a 10% waste factor, but complex gable ends and J-channel details can push your material takeoff to 15% to avoid "short-box" project delays.',
    faqs: [
      { 
        question: "Why is 'Gable Waste' significantly higher than standard field wall waste?", 
        answer: "When cutting horizontal siding for a gable end, you create unusable triangles at every course. While a standard flat wall only needs 5–7% waste for overlap and end-cuts, a roof with multiple gables and dormers requires a minimum of 12–15% waste to ensure you have enough material to complete the finish-trim." 
      },
      { 
        question: "Is a 'Siding Square' measured differently than a 'Roofing Square'?", 
        answer: "No, the unit is the same (100 square feet). However, siding is often sold 'per box,' which typically covers 2 squares. Always verify the manufacturer's packaging specs, as some premium vertical or cedar-shake-imitation panels are sold in 1-square or even 0.5-square boxes." 
      }
    ]
  },
  {
    slug: 'cedar-shake-roof-calculator',
    title: 'Cedar Shake Square & Exposure Estimator',
    seoDescription: 'Technical estimation tool for cedar shake roofing. Calculate squares based on 7.5" and 10" exposures and grade-specific coverage.',
    type: 'calculator',
    resultLabel: 'Total Cedar Squares (Projected)',
    inputs: [
      { id: 'sqft', label: 'Roof Surface (sq ft)', type: 'number', placeholder: '2500' },
      { id: 'exposure', label: 'Weather Exposure', type: 'select', options: ['7.5" (Standard)', '10" (Maximum)'] },
      { id: 'grade', label: 'Shake Grade', type: 'select', options: ['No. 1 Blue Label', 'No. 2 Red Label'] }
    ],
    compute: (values) => {
      const area = Number(values.sqft) || 0;
      let multiplier = 1.0;
      if (values.exposure === '10" (Maximum)') multiplier = 0.8; // needs less material
      const total = (area / 100) * multiplier;
      return `${total.toFixed(2)} Squares`;
    },
    informationalText: 'Calculate cedar shake squares based on your specified weather exposure. Grade-1 Blue Label shakes at a 7.5-inch exposure provide the standard 100 sq ft coverage, but altering exposure for aesthetics or snow-load will shift your total bundle count.',
    faqs: [
      { 
        question: "How does 'Weather Exposure' directly impact my cedar shake square count?", 
        answer: "The 'exposure' is the amount of the shake that remains visible after installation. A standard 7.5-inch exposure provides the highest moisture protection but requires more material. Increasing to 10-inch exposure reduces material costs but is only recommended for steeper pitches (8/12+) and may impact the longevity of the underlying felt system." 
      },
      { 
        question: "Why is the 'Double Starter' course mandatory for professional cedar shake bids?", 
        answer: "The first course at the eave must have a double layer of shakes to prevent moisture from wicking up into the roof deck. If you omit the extra 'Starter Squares' in your estimate, you are significantly under-ordering and creating a massive liability for leaks at the bottom of the system." 
      }
    ]
  },
  {
    slug: 'roof-cleaning-cost-estimator',
    title: 'Soft Wash & Roof Cleaning Profitability Tool',
    seoDescription: 'Calculate roof cleaning rates per square. Factor in soft-wash chemical costs and steep-slope labor surcharges for high-margin service additions.',
    type: 'calculator',
    resultLabel: 'Projected Cleaning Revenue',
    inputs: [
      { id: 'sq', label: 'Roof Squares', type: 'number', placeholder: '25' },
      { id: 'method', label: 'Cleaning Method', type: 'select', options: ['Soft Wash (Premium)', 'Blower / Sweep (Low)'] },
      { id: 'moss', label: 'Moss/Algae Level', type: 'select', options: ['Light', 'Medium', 'Heavy (Surcharge)'] }
    ],
    compute: (values) => {
      const sq = Number(values.sq) || 0;
      let rate = 35;
      if (values.method === 'Soft Wash (Premium)') rate = 65;
      if (values.moss === 'Heavy (Surcharge)') rate += 20;
      const total = sq * rate;
      return `$${total.toLocaleString()}`;
    },
    informationalText: 'Estimate your per-square rates for professional roof cleaning. Whether it\'s blower cleaning or low-pressure soft washing, factoring in chemical burden and tech labor is the only way to treat cleaning as a profit center rather than a "favor" for the client.',
    faqs: [
      { 
        question: "What is the 'Going Rate' for a professional soft-wash per square in 2024?", 
        answer: "Standard rates range from $30/sq for basic blower cleaning to $65–$95/sq for full soft-wash chemical treatments. For steep-slope roofs (8/12+) that require harness work, always apply a 20% 'Accessibility Surcharge' to protect your technician labor margins." 
      },
      { 
        question: "How do I technically explain 'Gloeocapsa Magma' to a homeowner to justify a $500–$1,000 cleaning?", 
        answer: "Don't sell 'cleanliness'; sell 'longevity.' Explain that the black streaks (Gloeocapsa Magma) are a bacteria that feeds on the limestone filler in their asphalt shingles. If left untreated, it leads to premature granule loss and shingle 'curling.' Position the cleaning as a $600 maintenance service that protects a $20,000 asset." 
      }
    ]
  },
  {
    slug: 'skylight-install-calculator',
    title: 'Skylight Spec & Curb-Mount Estimator',
    seoDescription: 'Calculate installation costs for Velux and custom skylights. Factor in curb-mounting labor, deck-mount flashing kits, and structural frame-out surcharges.',
    type: 'calculator',
    resultLabel: 'Projected Install Bid',
    inputs: [
      { id: 'size', label: 'Skylight Size', type: 'select', options: ['Small (22x22)', 'Medium (22x46)', 'Large (46x46)'] },
      { id: 'mount', label: 'Mounting Type', type: 'select', options: ['Deck-Mount', 'Curb-Mount (Low Slope)'] },
      { id: 'internal', label: 'Interior Light Tunnel?', type: 'select', options: ['No (Direct)', 'Yes (Drywall Finish)'] }
    ],
    compute: (values) => {
      let base = 800;
      if (values.size === 'Medium (22x46)') base = 1200;
      if (values.size === 'Large (46x46)') base = 1800;
      if (values.mount === 'Curb-Mount (Low Slope)') base += 400;
      if (values.internal === 'Yes (Drywall Finish)') base += 1500;
      return `$${base.toLocaleString()}`;
    },
    informationalText: 'Determine your bid for skylight installs by choosing between curb-mount and deck-mount systems. Curb-mounts require site-built wooden frames for low-slope roofs, while deck-mounts use integrated flashing kits. Always factor in structural header framing and internal drywall finishing to protect your project margin.',
    faqs: [
      { 
        question: "When is a 'Curb-Mount' mandatory for a professional reroofing project?", 
        answer: "Curb-mounts are essential for flat or low-slope roofs (under 3:12 pitch) to ensure proper water shedding and flashing integration. Trying to use a deck-mount skylight on a low-slope roof is a major code violation and a guaranteed callback for leaks at the sill." 
      },
      { 
        question: "How do I factor 'Interior Drywall Burden' into a competitive skylight bid?", 
        answer: "Don't just quote the roof work. If the home has an attic, you must frame a 'light tunnel' and finish it with drywall, tape, and paint. This interior labor often costs 2–3x more than the roof-side install. If you aren't line-iteming this burden, your skylight profit will vanish before the paint is dry." 
      }
    ]
  },
  {
    slug: 'solar-roof-capacity-calculator',
    title: 'Solar Dead-Load & Truss Capacity Analyzer',
    seoDescription: 'Analyze roof load capacity for solar arrays. Factor in existing roofing PSF (asphalt vs tile) and point-load distribution for structural safety.',
    type: 'calculator',
    resultLabel: 'Total Dead Load (PSF)',
    inputs: [
      { id: 'material', label: 'Current Roof Material', type: 'select', options: ['Asphalt Shingle (15 PSF)', 'Clay Tile (27 PSF)', 'Concrete Tile (32 PSF)'] },
      { id: 'arraySize', label: 'Solar Array (kW)', type: 'number', placeholder: '6' }
    ],
    compute: (values) => {
      let base = 15;
      if (values.material?.includes('Clay')) base = 27;
      if (values.material?.includes('Concrete')) base = 32;
      const solarAdd = 4; // average PSF for solar hardware
      const total = base + solarAdd;
      return `${total} PSF (Total Structural Load)`;
    },
    informationalText: 'Analyze the structural impact of solar arrays by calculating the total Dead Load. Most arrays add 3-4 PSF, which when combined with heavy tile (27 PSF) or snow loads, can push trusses to their limit. Use this to determine if a structural engineer\'s PE stamp is required for the permit.',
    faqs: [
      { 
        question: "How does 'Point-Load' affect asphalt shingle compression under solar racks?", 
        answer: "Solar weight isn't evenly distributed; it's concentrated at the mounting 'L-feet.' On a hot day, this point-load can crush the shingle mat and lead to 'thermal pumping' leaks. Always spec premium flashing kits (like Quick Mount PV) to bridge the point-load across the rafter and preserve the shingle's integrity." 
      },
      { 
        question: "What is the 'PE Stamp' threshold for residential solar arrays in high-snow zones?", 
        answer: "Most jurisdictions require a structural engineer's seal (PE Stamp) if the cumulative dead load exceeds standard code limits (typically 20–30 PSF). If you're mounting solar on an existing tile roof in a snow region, the 'Live Load' + 'Dead Load' often exceeds truss capacity, necessitating structural sistering before the install can proceed." 
      }
    ]
  },
  {
    slug: 'labor-cost-with-overtime-calculator',
    title: 'Fully-Burdened Labor & OT Profit Shield',
    seoDescription: 'Calculate fully-burdened labor rates including Work Comp, FICA, and overtime. Protect your profit margins from labor-cost leakage.',
    type: 'calculator',
    resultLabel: 'Fully-Burdened Cost Per Hour',
    inputs: [
      { id: 'hourly', label: 'Crew Hourly Pay ($)', type: 'number', placeholder: '25' },
      { id: 'burden', label: 'Tax & Insurance Burden (%)', type: 'number', placeholder: '25' },
      { id: 'otHours', label: 'Overtime Hours Expected', type: 'number', placeholder: '10' }
    ],
    compute: (values) => {
      const pay = Number(values.hourly) || 0;
      const burden = 1 + (Number(values.burden) || 0) / 100;
      const ot = Number(values.otHours) || 0;
      const regularPay = 40 * pay * burden;
      const otPay = ot * (pay * 1.5) * burden;
      const total = (regularPay + otPay) / (40 + ot);
      return `$${total.toFixed(2)} / Man-Hour`;
    },
    informationalText: 'Stop losing money on labor by calculating your true "Fully-Burdened" rate. This includes base pay plus Work Comp, PR taxes, and overtime premiums. If you bid based on a flat hourly wage, your net profit is being eaten by hidden payroll leakage.',
    faqs: [
      { 
        question: "Why is my 'Bid Rate' often 30% higher than the crew's actual hourly pay?", 
        answer: "You must factor in 'The Burden.' This is the non-negotiable cost of FICA, FUTA, SUTA, and high-risk Worker's Comp (which is often $15–$25 per $100 of roofing payroll). Ignoring the burden is the most common reason small roofing companies go out of business even while staying busy." 
      },
      { 
        question: "How do I prevent 'OT Creep' from destroying my project margins?", 
        answer: "High-complexity reroofs (8/12+ pitch) always take 20% longer than a standard 4/12 ranch. If your estimate doesn't account for this slowdown, you'll end up paying 1.5x labor rates for the last two days of the project—hours that come directly out of your net profit. Always bake 'Complexity OT' into your per-square labor bid." 
      }
    ]
  },
  {
    slug: 'tile-roof-repair-estimator',
    title: 'Tile Repair & Underlayment Failure Estimator',
    seoDescription: 'Estimate tile roof repair costs based on breakage counts and field underlayment failure. Factor in "Minimum Call-Out" fees for specialty clay/concrete work.',
    type: 'calculator',
    resultLabel: 'Recommended Repair Quote',
    inputs: [
      { id: 'tiles', label: 'Number of Broken Tiles', type: 'number', placeholder: '5' },
      { id: 'age', label: 'Age of Roof (Years)', type: 'number', placeholder: '20' },
      { id: 'minimum', label: 'Call-Out Minimum ($)', type: 'number', placeholder: '500' }
    ],
    compute: (values) => {
      const tiles = Number(values.tiles) || 0;
      const age = Number(values.age) || 0;
      const min = Number(values.minimum) || 500;
      let repair = tiles * 75; // high labor per tile
      if (age > 20) repair += 1000; // factor in field failure
      return `$${Math.max(repair, min).toLocaleString()}`;
    },
    informationalText: 'Price tile repairs accurately by accounting for double-handled labor and underlayment failure. Leaks on a 20-year-old tile roof are rarely just about a "broken tile"; they are usually signs of underlayment "cook-out" that requires a partial lift-and-lay to solve.',
    faqs: [
      { 
        question: "How do I diagnose 'Underlayment Cook-Out' on a concrete tile roof?", 
        answer: "If the home has active leaks but you see no broken tiles, the underlying organic felt has reached its thermal limit. In sun-drenched regions, 30# felt becomes brittle and fails after 18–22 years regardless of the tiles' condition. You must sell a 'Lift-and-Lay' service with synthetic underlayment to fix the root cause." 
      },
      { 
        question: "Why is a 'Minimum Call-Out' fee mandatory for professional tile repairs?", 
        answer: "Tile repair is high-liability specialty work. Every time a tech walks a tile roof, they risk breaking surrounding tiles. A $500 minimum ensures you cover the skilled labor, the material-matching hunt, and the liability of 'Walking the Ridge' to find the actual leak source." 
      }
    ]
  },
  {
    slug: 'snow-guard-layout-calculator',
    title: 'Snow Guard Spacing & Liability Optimizer',
    seoDescription: 'Calculate snow guard spacing and row counts based on roof pitch and snow-load. Protect eave-side assets and mitigate sliding-ice liability.',
    type: 'calculator',
    resultLabel: 'Required Guard Rows & Spacing',
    inputs: [
      { id: 'pitch', label: 'Roof Pitch', type: 'select', options: ['4:12', '6:12', '8:12', '12:12'] },
      { id: 'width', label: 'Building Width (ft)', type: 'number', placeholder: '50' }
    ],
    compute: (values) => {
      const width = Number(values.width) || 0;
      let guards = Math.ceil(width / 2); // 2ft spacing standard
      let rows = 1;
      if (values.pitch === '8:12') rows = 2;
      if (values.pitch === '12:12') rows = 3;
      return `${guards * rows} Guards (${rows} Rows of ${guards})`;
    },
    informationalText: 'Design a snow retention system that protects eave-side assets from "sliding-ice avalanches." Spacing is driven by roof pitch and local snow-load data. Proper distribution prevents "structural point-overloading" and mitigates the liability of property damage or injury from sliding sheets.',
    faqs: [
      { 
        question: "Why should I never install snow guards 'Only Over the Door'?", 
        answer: "Isolated guards over a doorway create a massive structural 'Point-Load' that can rip the snow guard off or buckle the metal panel. Snow retention must be distributed across the entire run to hold the snow blanket evenly, preventing the 'Sliding Sheet' effect that shears off accessories." 
      },
      { 
        question: "How do I reconcile snow guard spacing specs with different metal panel profiles?", 
        answer: "Check the manufacturer's technical manual (e.g., SnoBlox or S-5!) for your specific rib height (1.5\" vs 2\"). Clamp-on guards for standing seam have much higher shear-strength than adhesive-mounts. Using adhesive guards on a 12:12 pitch without checking the 'Rib Load' is a major liability risk for your business." 
      }
    ]
  },
  {
    slug: 'fascia-soffit-cost-generator',
    title: 'Fascia & Soffit Component Estimator',
    seoDescription: 'Estimate linear footage and material pricing for fascia and soffit systems, including PVC and aluminum wrap premiums.',
    type: 'calculator',
    resultLabel: 'Fascia/Soffit System Total',
    inputs: [
      { id: 'linearFeet', label: 'Total Linear Feet', type: 'number', placeholder: '150' },
      { id: 'material', label: 'Material', type: 'select', options: ['Aluminum Wrap', 'Primed Pine', 'High-End PVC (Azek)'] }
    ],
    compute: (values) => {
      const feet = Number(values.linearFeet) || 0;
      let pricePerFoot = 12;
      if (values.material === 'High-End PVC (Azek)') pricePerFoot = 24;
      if (values.material === 'Aluminum Wrap') pricePerFoot = 18;
      
      return `$${(feet * pricePerFoot).toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How should I price custom aluminum fascia wrapping for 2026 projects?", 
        answer: "Set your linear foot rate at $18–$25 for custom bending. This includes the cost of rotted wood removal and the skilled labor required to use a metal brake. It's a high-visibility upgrade that significantly increases the 'Curb Appeal' of your final roof job." 
      },
      { 
        question: "What is the sales advantage of pitching PVC (Azek) fascia over wood?", 
        answer: "Position PVC as 'The Last Fascia You'll Ever Buy.' By eliminating rot and the need for regular painting, you provide long-term value that homeowners are willing to pay a 100% premium for, while yours crews save time by not having to prime or paint on site." 
      },
      { 
        question: "How can rotted fascia damage my roofing profit margins?", 
        answer: "Ignoring fascia issues leads to 'unforeseen conditions' during the install. If you don't scope rotted fascia upfront, you'll end up with structural delays or a pissed-off customer when you ask for a sudden $1,500 change order on Day 2." 
      }
    ]
  },
  {
    slug: 'subcontractor-agreement-generator',
    title: 'Roofing Subcontractor Scope & Agreement Builder',
    seoDescription: 'Generate professional project scope documents and payment agreements for roofing installation crews.',
    type: 'template',
    resultLabel: 'Generated Sub Agreement',
    inputs: [
      { id: 'subName', label: 'Subcontractor Name', type: 'text' },
      { id: 'projectAddress', label: 'Project Address', type: 'text' },
      { id: 'payRate', label: 'Pay Rate ($ per square)', type: 'number', placeholder: '75' }
    ],
    compute: (values) => {
      return `SUBCONTRACTOR WORK AGREEMENT
      
This agreement is entered into by and between the Primary Contractor and ${values.subName || '[SUB NAME]'} for the project located at ${values.projectAddress || '[ADDRESS]'}.

SCOPE OF WORK:
Subcontractor agrees to perform a full tear-off and installation of new roofing materials as per the main project specifications. Subcontractor is responsible for site cleanliness and disposal of all debris into the provided dumpster.

PAYMENT TERMS:
Primary Contractor agrees to pay Subcontractor at the rate of $${values.payRate || '75'} per square of installed and inspected roofing area. Payment will be released within 48 hours of final inspection and homeowner sign-off.

LIABILITY:
Subcontractor must maintain active General Liability and Workers Compensation insurance.`;
    },
    faqs: [
      { 
        question: "What are the mandatory clauses for a roofing subcontractor agreement?", 
        answer: "Ensure your agreement includes an 'Indemnification Clause' and a mandatory 'Cleanup Standard.' This legally protects your company from the sub's errors and ensures your brand reputation isn't tarnished by nails left in the homeowner's driveway." 
      },
      { 
        question: "How should I structure 'Add-On' payments for subs on steep roofs?", 
        answer: "Adopt a transparent tier system: $+10/square for over 8/12 pitch, and $+25/square for over 12/12. Standardizing these add-ons for your subs ensures you can accurately price your homeowner estimates without eroding your net margin." 
      },
      { 
        question: "Why is proof of Workers' Comp non-negotiable for my subcontractors?", 
        answer: "If a sub's worker is injured and the sub doesn't have insurance, your own workers' comp carrier will likely have to pay the claim. This can lead to a massive spike in your X-Mod (Experience Modifier) rating, costing your business thousands in future premiums." 
      }
    ]
  },
  {
    slug: 'chimney-flashing-cost-estimator',
    title: 'Chimney Counter-Flashing & Cricket Estimator',
    seoDescription: 'Technical estimation tool for specialized chimney masonry flashing and custom-bent metal crickets.',
    type: 'calculator',
    resultLabel: 'Flashing System Estimate',
    inputs: [
      { id: 'size', label: 'Chimney Size', type: 'select', options: ['Small (2x2)', 'Medium (3x3)', 'Large (4x4+)'] },
      { id: 'material', label: 'Flashing Material', type: 'select', options: ['Galvanized Steel', 'Aluminum', 'Premium Copper'] }
    ],
    compute: (values) => {
      let base = 450;
      if (values.size === 'Medium (3x3)') base = 650;
      if (values.size === 'Large (4x4+)') base = 900;
      
      if (values.material === 'Premium Copper') base *= 2.5;
      if (values.material === 'Aluminum') base *= 1.2;
      
      return `$${Math.ceil(base).toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How should I explain the ROI of copper chimney flashing to a homeowner?", 
        answer: "Frame it as a 'Once-in-a-Lifetime' solution. While copper is 2x the price of steel, its 50+ year lifespan and aesthetic patina add significant property value. For high-end slate or metal roofs, copper is the only material that matches the roof's durability." 
      },
      { 
        question: "What are the common liability risks of the 'Recaulking' chimney leaks?", 
        answer: "Caulking is a temporary fix that often hides underlying flashing failure. Professional companies should never offer 'caulk repairs' without a disclaimer; always recommend a full step-flashing replacement to eliminate the risk of a leak callback." 
      },
      { 
        question: "How much should I charge for a custom-bent cricket behind a wide chimney?", 
        answer: "Any chimney wider than 30 inches needs a cricket. Charge a flat $450–$750 for this custom-bent metalwork. It's a mandatory code requirement that prevents water pooling and ensures your company is performing 'to-code' professional installations." 
      }
    ]
  },
  {
    slug: 'slate-roof-weight-calculator',
    title: 'Slate Structural Load & Rafter Integrity Tool',
    seoDescription: 'Structural tool for calculating the total load of natural slate roofing to verify rafter spacing and building integrity.',
    type: 'calculator',
    resultLabel: 'Total System Weight (Tons)',
    inputs: [
      { id: 'squares', label: 'Total Squares', type: 'number', placeholder: 'e.g. 20' },
      { id: 'thickness', label: 'Slate Thickness', type: 'select', options: ['1/4"', '3/8"', '1/2"', '3/4"'] }
    ],
    compute: (values) => {
      const squares = Number(values.squares) || 0;
      let lbsPerSquare = 800; // 1/4"
      if (values.thickness === '3/8"') lbsPerSquare = 1200;
      if (values.thickness === '1/2"') lbsPerSquare = 1600;
      if (values.thickness === '3/4"') lbsPerSquare = 2500;
      
      const totalLbs = squares * lbsPerSquare;
      const tons = totalLbs / 2000;
      return `${tons.toFixed(2)} Tons (${totalLbs.toLocaleString()} lbs)`;
    },
    faqs: [
      { 
        question: "How can I protect my business from liability on slate roof load assessments?", 
        answer: "Always require a signed report from a structural engineer if you are switching a home from asphalt to slate. This documented evaluation protects you from future claims related to foundation settling or truss failure caused by the massive weight increase." 
      },
      { 
        question: "What are the 'Critical rafter' spacing requirements for professional slate?", 
        answer: "Slate requires rafters spaced no more than 16 inches on center. If you encounter a home with 24-inch spacing, you must factor in the cost of sistering the rafters to ensure structural integrity—this is a high-margin upsell that ensures a legal, safe installation." 
      },
      { 
        question: "Should my company charge for a 'Structural Pre-Check' when bidding slate?", 
        answer: "Yes; position the $250 pre-check as a mark of your technical professionalism. It demonstrates you aren't a 'shingle slinger' and that you care about the long-term safety of the client's home, which helps justify a premium project bid." 
      }
    ]
  },
  {
    slug: 'roof-deck-replacement-calculator',
    title: 'Roof Decking (Sheathing) & Rot Factor Tool',
    seoDescription: 'Professional estimator for roof deck replacement, factoring in OSB vs. CDX Plywood and technical install labor.',
    type: 'calculator',
    resultLabel: 'Sheathing Order Schedule',
    inputs: [
      { id: 'sheets', label: 'Number of 4x8 Sheets', type: 'number', placeholder: '10' },
      { id: 'material', label: 'Material Type', type: 'select', options: ['7/16" OSB', '1/2" CDX Plywood', '5/8" CDX Plywood'] }
    ],
    compute: (values) => {
      const sheets = Number(values.sheets) || 0;
      let pricePerSheet = 35;
      if (values.material === '1/2" CDX Plywood') pricePerSheet = 55;
      if (values.material === '5/8" CDX Plywood') pricePerSheet = 75;
      
      const total = sheets * (pricePerSheet + 65); // $65 labor per sheet
      return `$${total.toLocaleString()} (${sheets} sheets + install labor)`;
    },
    faqs: [
      { 
        question: "What is the sales advantage of pitching CDX Plywood over OSB?", 
        answer: "In high-value bids, position CDX Plywood as the 'Moisture Resistant Standard.' It recovers better from accidental leaks and has superior nail-holding power, allowing you to charge a premium over competitors using standard OSB, while reducing your call-back risk." 
      },
      { 
{
    slug: 'hoa-roofing-approval-generator',
    title: 'HOA Technical Approval & Variance Kit',
    seoDescription: 'Generate professional HOA approval documents including material technical data, fire-rating specs, and manufacturer compliance sheets.',
    type: 'template',
    resultLabel: 'HOA Technical Submission',
    inputs: [
      { id: 'hoaName', label: 'HOA Board / ARC', type: 'text', placeholder: 'Windsor Estates ARC' },
      { id: 'material', label: 'Proposed Material', type: 'text', placeholder: 'CertainTeed Landmark Pro' },
      { id: 'fire', label: 'Fire Rating', type: 'select', options: ['Class A (Standard)', 'Class B', 'Class C'] }
    ],
    compute: (values) => {
      return `To the Architecture Review Committee at ${values.hoaName || '[HOA NAME]'},
      
I am formally submitting this technical request for exterior modification. We propose the installation of ${values.material || 'a high-definition laminate shingle'} which carries an industry-leading ${values.fire || 'Class A'} fire rating and a 110MPH wind-uplift certification.

This project will utilize high-profile ridge caps to maintain neighborhood aesthetic harmony while meeting 2024 International Residential Code (IRC) ventilation standards. Enclosed are the manufacturer's ASTM compliance sheets and color swatch samples for your final verification.`;
    },
    informationalText: 'Help your clients bypass HOA delays by providing a "Technical Approval Kit." Including fire-rating certifications and ASTM compliance sheets makes your bid look like the most professional and lower-risk option for the board.',
    faqs: [
      { 
        question: "How can I help my clients win HOA approval for premium roofing materials?", 
        answer: "Stop sending simple quotes; send a 'Spec Package.' This includes high-res material brochures, fire-rating certifications, and local address references where you've installed the same material. This professional documentation separates you from 'trunk-slammers' and closes HOA-restricted leads much faster." 
      },
      { 
        question: "Should my roofing company charge more for HOA-managed projects?", 
        answer: "Yes; the administrative burden of ARC approvals and strict site hours (usually 8 AM – 5 PM) often adds 10%–15% to your operational overhead. You must bake this 'Management Burden' into your bid to protect your net profit margins." 
      }
    ]
  },
  {
    slug: 'roof-ridge-vent-calculator',
    title: 'Ridge Vent Exhaust & NFA Balancing Tool',
    seoDescription: 'Calculate mandatory linear footage for ridge vents to achieve balanced NFA (Net Free Area) with soffit intake for code compliance.',
    type: 'calculator',
    resultLabel: 'Required Ridge Vent Pieces',
    inputs: [
      { id: 'ridgeFeet', label: 'Total Ridge Length (ft)', type: 'number', placeholder: '80' },
      { id: 'soffitNFA', label: 'Existing Soffit NFA', type: 'number', placeholder: '300' }
    ],
    compute: (values) => {
      const feet = Number(values.ridgeFeet) || 0;
      const pieces = Math.ceil(feet / 4); // 4ft standard
      return `${pieces} Pieces (4ft each)`;
    },
    informationalText: 'Calculate mandatory linear footage for ridge vents based on eave-side intake. Balanced ventilation requires an equal distribution of NFA to prevent moisture buildup and shingle "cook-out." Failing to balance NFA is the most common reason for manufacturer warranty denials.',
    faqs: [
      { 
        question: "How can I explain the 'Siphon Effect' of ridge vents to justify a premium upgrade?", 
        answer: "Explain that ridge vents use the Bernoulli principle to naturally pull hot air out of the attic. This continuous cycle prevents the 'Heat Trap' that causes premature granule loss. Position it as a mandatory system protection, not an optional accessory." 
      },
      { 
        question: "Why is balancing intake and exhaust mandatory for manufacturer warranties?", 
        answer: "GAF and CertainTeed require balanced NFA (50/50 intake-to-exhaust) to validate 'Lifetime' warranties. If you install a ridge vent without sufficient soffit intake, the attic will pull air from the home's interior, creating massive moisture issues and potentially voiding the material warranty." 
      }
    ]
  },
  {
    slug: 'ice-dam-prevention-checklist',
    title: 'Thermal Bypass & Ice Dam Mitigation Analyzer',
    seoDescription: 'Professional checklist for identifying and mitigating ice dam risks through ventilation and insulation technical assessments.',
    type: 'template',
    resultLabel: 'Winterization Scope Report',
    inputs: [
      { id: 'bypass', label: 'Thermal Bypass Found?', type: 'select', options: ['No', 'Yes (Chimney/Can Lights)'] },
      { id: 'insulation', label: 'Current R-Value', type: 'number', placeholder: '25' }
    ],
    compute: (values) => {
      return `ICE DAM MITIGATION PLAN:
- [ ] THERMAL BYPASS: ${values.bypass === 'Yes (Chimney/Can Lights)' ? 'CRITICAL: Seal chimney chase and light boxes' : 'Maintain existing seals'}
- [ ] INSULATION: Target R-49 (Current: R-${values.insulation || '?'})
- [ ] VENTILATION: Verify baffles aren't blocked by new blow-in
- [ ] WATERPROOFING: Ensure Ice & Water shield extends 2' past the interior wall line.`;
    },
    informationalText: 'Identify "Thermal Bypasses" that cause ice dams by heating the roof deck. Use this as an upsell tool for blown-in insulation and air-sealing services. Most ice dams are ventilation or insulation failures, not roofing failures.',
    faqs: [
      { 
        question: "How can I explain the 'root cause' of ice dams to justify an insulation upsell?", 
        answer: "Frame it as a 'System Failure.' Explain that ice dams result from heat loss through the ceiling, not just cold weather. By upselling air-sealing and R-49 insulation, you provide a permanent solution that protects the shingles and eliminates the risk of interior water damage." 
      },
      { 
        question: "What is the IRC code requirement for Ice & Water shield extension?", 
        answer: "International Residential Code (IRC) mandates that the self-adhered membrane must extend at least 2 feet past the interior 'warm' wall line (not the eave edge). Adhering to this standard protects your business from liability during official building inspections." 
      }
    ]
  },
  {
    slug: 'metal-roof-screw-calculator',
    title: 'Fastener Schedule & Gasket Integrity Estimator',
    seoDescription: 'Calculate mandatory fastener patterns and component counts for exposed-fastener metal roofing systems (AG-Panels).',
    type: 'calculator',
    resultLabel: 'Required Hardware Schedule',
    inputs: [
      { id: 'squares', label: 'Total Squares', type: 'number', placeholder: '20' },
      { id: 'spacing', label: 'Fastener Spacing (Inches)', type: 'number', placeholder: '24' }
    ],
    compute: (values) => {
      const sq = Number(values.squares) || 0;
      const screws = sq * 90; // avg rule for AG panels
      return `${screws.toLocaleString()} Screws (EPDM Recommended)`;
    },
    informationalText: 'Determine your fastener count for exposed-fastener systems. Standard spacing is 24 inches on center, but high-wind zones may require tighter patterns. Always specify EPDM-washer screws to prevent the "pinhole" leaks common with cheap neoprene gaskets.',
    faqs: [
      { 
        question: "What is the profit potential of 'Re-Screwing' aged metal roofs?", 
        answer: "Re-screwing is a high-margin maintenance service ($2.50–$4.00 per LF). As original neoprene washers degrade after 12–15 years, offering a full fastener replacement can double the roof's life and generate lucrative 'fill-in' jobs for your crew without the liability of a full tear-off." 
      },
      { 
        question: "Why should I only use EPDM-washer screws for metal roofing projects?", 
        answer: "Cheap neoprene washers dry out and crack in under 10 years, creating thousands of potential leak points. Specifying premium EPDM washers allows you to offer a 20-year workmanship warranty on the seal, setting your company apart from budget-rate competitors." 
      }
    ]
  },
  {
    slug: 'roof-coating-estimate-tool',
    title: 'Commercial Coating Mil-Spec & Warranty Estimator',
    seoDescription: 'Commercial tool for estimating liquid-applied silicone or acrylic roof coating systems and project profitability.',
    type: 'calculator',
      },
      { 
        question: "What is the average profit margin for a silicone roof coating project?", 
        answer: "Professional coatings typically carry 50%–60% margins. Since the labor is primarily power-washing and liquid application, you can achieve high daily revenue per crew member compared to traditional heavy tear-off projects." 
      },
      { 
        question: "How should I position the ROI of 'Cool Roof' coatings to property managers?", 
        answer: "Focus on the 10-year tax depreciation and immediate energy savings. Reflective silicone can lower a commercial building's cooling costs by 20%, often paying for the entire coating project within 3–5 years." 
      }
    ]
  },
  {
    slug: 'stone-coated-steel-calculator',
    title: 'Stone-Coated Steel (Decra) System Spec & Waste Calculator',
    seoDescription: 'Technical material estimator for stone-coated steel panels, including battens and profile-specific waste factors.',
    type: 'calculator',
    resultLabel: 'B2B Material Schedule',
    inputs: [
      { id: 'squares', label: 'Total Squares', type: 'number', placeholder: '20' },
      { id: 'profile', label: 'Panel Profile', type: 'select', options: ['Villa Tile', 'Shake Profile', 'Shingle Profile'] }
    ],
    compute: (values) => {
      const squares = Number(values.squares) || 0;
      const panelsPerSquare = 22; // Average for 14"x50" panels
      const totalPanels = Math.ceil(squares * panelsPerSquare * 1.07); // 7% waste
      
      return `${totalPanels} Panels (includes 7% waste factor)`;
    },
    faqs: [
      { 
        question: "Why is stone-coated steel a high-margin alternative to clay tiles?", 
        answer: "It provides the 'Spanish Villa' aesthetic at 1/8th the weight. This eliminates the need for expensive structural rafter reinforcements, allowing you to close high-end aesthetic leads that can't afford the structural work required for true clay." 
      },
      { 
        question: "What is the technical benefit of a Batten-System installation?", 
        answer: "Installing over battens creates a 'Below-Deck' venting channel. This natural airspace significantly improves the thermal performance of the home and protects the steel panels from moisture traps, allowing you to justify your premium project pricing." 
      },
      { 
        question: "How can I prevent crew members from denting stone-coated panels?", 
        answer: "Enforce a 'Step in the Lows' safety training. Walking on the high-profile ridges will cause permanent cosmetic denting. Using specialized foam-filled walking pads is a professional standard that protects the product and your profit margin from replacement costs." 
      }
    ]
  },
  {
    slug: 'roofing-warranty-claim-generator',
    title: 'Manufacturer Defect Warranty Argument Generator',
    seoDescription: 'Generate technical evidence-based appeals for shingle manufacturer warranty claims, focusing on material defects.',
    type: 'text-generator',
    resultLabel: 'Warranty Argument Content',
    inputs: [
      { id: 'mnfr', label: 'Manufacturer Name', type: 'text', placeholder: 'GAF / Owens Corning' },
      { id: 'installDate', label: 'Installation Date', type: 'text' },
      { id: 'issue', label: 'Observed Issue', type: 'select', options: ['Excessive Granule Loss', 'Thermal Cracking', 'Curling / De-lamination'] }
    ],
    compute: (values) => {
      return `ATTN: Warranty Claims Department at ${values.mnfr || '[MANUFACTURER]'},

This letter serves as a formal notice of a warranty claim for the roofing materials installed on my property on ${values.installDate || '[DATE]'}. 

A certified roofing professional has inspected the system and identified ${values.issue || 'material defects'} that are not indicative of standard wear and tear. We believe this to be a manufacturer's defect covered under the limited lifetime warranty. 

Please provide the necessary claim packet and instructions for submitting physical samples and photographic evidence for your lab analysis.`;
    },
    faqs: [
      { 
        question: "How can my company handle a shingle warranty claim for a client?", 
        answer: "Charge a 'Claim Management Fee' ($350–$500). Navigating the GAF or OC warranty packet, performing the shingle-pull for lab analysis, and providing technical photos is a professional service that most homeowners can't do themselves—position it as an 'Expert Advocate' service." 
      },
      { 
        question: "What is the difference between an 'Installation Error' and a 'Material Defect'?", 
        answer: "Manufacturers won't pay for high-nailing or lack of venting. Being able to technically identify a delamination defect before the manufacturer's rep arrives protects your reputation and ensures you don't waste time on claims that will be denied for 'Installer Error.'" 
      },
      { 
        question: "How do pro-rated warranties affect my replacement margins?", 
        answer: "If a claim only covers 20% of the material cost, the homeowner still has to pay you for 100% of the labor. Frame the manufacturer's payout as a 'Down Payment' on a proper replacement to ensure your full company profit is protected." 
      }
    ]
  },
  {
    slug: 'roofing-financing-calculator',
    title: 'Project Financing & Monthly Payment Sales Tool',
    seoDescription: 'Sales tool for calculating monthly payments and financing ROI to increase project ticket sizes.',
    type: 'calculator',
    resultLabel: 'Monthly Payment Quote',
    inputs: [
      { id: 'amount', label: 'Loan Amount ($)', type: 'number', placeholder: '15000' },
      { id: 'apr', label: 'Interest Rate (APR %)', type: 'number', placeholder: '7.99' },
      { id: 'term', label: 'Term (Months)', type: 'select', options: ['36 Months', '60 Months', '84 Months', '120 Months'] }
    ],
    compute: (values) => {
      const p = Number(values.amount) || 0;
      const r = (Number(values.apr) || 0) / 100 / 12;
      const n = parseInt(values.term) || 60;
      
      if (r === 0) return `$${(p/n).toFixed(2)}`;
      const monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return `$${monthly.toFixed(2)}`;
    },
    faqs: [
      { 
        question: "How can offering 'Approval-in-Minutes' financing increase my closing rate?", 
        answer: "Financing removes the 'Price Barrier.' By pitching a $199/month payment instead of a $20,000 lump sum, you shift the conversation from 'Can I afford this?' to 'Which material do I want?' Companies offering financing typically see a 30%–50% increase in average ticket size." 
      },
      { 
        question: "What is the advantage of using specialized roofing lenders like GoodLeap?", 
        answer: "Specialized lenders understand the urgency of roof leaks. They offer 'No Interest, No Payment' (NINA) loans that allow the homeowner to get the roof now and wait for their insurance check to arrive, ensuring your company can start work immediately." 
      },
      { 
        question: "Should I include financing as the 'Default Choice' in my bids?", 
        answer: "Yes. Every bid should include a 'Monthly Option' side-by-side with the cash price. High-end homeowners often prefer the liquidity of financing, even if they have the cash—allowing you to upsell to premium designer shingles or metal more easily." 
      }
    ]
  },
  {
    slug: 'roof-snow-load-calculator',
    title: 'Roof Structural Snow Load & Safety Threshold Tool',
    seoDescription: 'Determine the total structural weight of snow on a roof field to assess rafter load and collapse thresholds.',
    type: 'calculator',
    resultLabel: 'Load Bearing Assessment',
    inputs: [
      { id: 'sqft', label: 'Roof Square Footage', type: 'number', placeholder: '2000' },
      { id: 'depth', label: 'Snow Depth (Inches)', type: 'number', placeholder: '12' },
      { id: 'type', label: 'Snow Type', type: 'select', options: ['Fresh Powder (Light)', 'Packed Snow (Medium)', 'Slush/Ice (Heavy)'] }
    ],
    compute: (values) => {
      const sqft = Number(values.sqft) || 0;
      const depth = Number(values.depth) || 0;
      let lbsPerInch = 0.5; // Powder
      if (values.type === 'Packed Snow (Medium)') lbsPerInch = 1.5;
      if (values.type === 'Slush/Ice (Heavy)') lbsPerInch = 4.0;
      
      const totalWeight = sqft * depth * lbsPerInch;
      return `${totalWeight.toLocaleString()} lbs (~${(totalWeight/2000).toFixed(1)} Tons)`;
    },
    faqs: [
      { 
        question: "What are the structural engineering limits for snow load on modern roofs?", 
        answer: "Most 16' on-center rafters are engineered for 30–40 psf (pounds per square foot). Knowing these limits allows you to position yourself as a technical expert when discussing the 'Saturated Snow Weight' that leads to catastrophic structural failure and emergency tarping jobs." 
      },
      { 
        question: "How can I price emergency roof snow removal safely?", 
        answer: "Charge by the man-hour with a 4-hour minimum. Factoring in harness time and the liability of shingle damage in freezing temps ensures your business is protected while offering a high-demand, high-margin winter service." 
      },
      { 
        question: "Does metal roofing require the same snow load engineering as shingles?", 
        answer: "Technically yes, but the faster shedding of metal reduces the time the structure is under stress. However, you must warn clients about 'Shock Loading' where a massive avalanche of snow drops suddenly—recommending staggered snow guards as a mandatory structural protection." 
      }
    ]
  },
  {
    slug: 'shingle-roof-age-estimator',
    title: 'Technical Roof Lifecycle Assessment & Vulnerability Report',
    seoDescription: 'Business tool for assessing shingle embrittlement, mat fracture, and granule loss to project system failure dates.',
    type: 'calculator',
    resultLabel: 'Lifecycle Project Assessment',
    inputs: [
      { id: 'granules', label: 'Granule Loss', type: 'select', options: ['None', 'Light', 'Severe (Bald spots)'] },
      { id: 'curling', label: 'Shingle Curling', type: 'select', options: ['Flat', 'Slight edges', 'Significant curling'] },
      { id: 'leaks', label: 'Have you had leaks?', type: 'select', options: ['No', '1 minor leak', 'Multiple leaks'] }
    ],
    compute: (values) => {
      let score = 25; // Potential lifespan
      if (values.granules === 'Light') score -= 5;
      if (values.granules === 'Severe (Bald spots)') score -= 15;
      if (values.curling === 'Slight edges') score -= 5;
      if (values.curling === 'Significant curling') score -= 12;
      if (values.leaks === '1 minor leak') score -= 3;
      if (values.leaks === 'Multiple leaks') score -= 10;
      
      const life = Math.max(score, 0);
      return life > 5 ? `${life} Years` : 'Critical: Immediate replacement needed';
    },
    faqs: [
      { 
        question: "How can my sales team use 'Cupping' and 'Clawing' to close aged leads?", 
        answer: "Technical education closes deals. Explain that curling edges (cupping) or centers popping (clawing) are irreversible signs of asphalt embrittlement. Showing the homeowner that their shingles have lost their 'Flexural Strength' makes a full replacement look like a necessary structural fix rather than an option." 
      },
      { 
        question: "What is the 'Manufacturing Date Code' on a shingle and how do I find it?", 
        answer: "Look at the back of a shingle pull for a printed alphanumeric string. Identifying the exact year of manufacture allows you to prove to the homeowner (and insurance) that the roof has exceeded its 20-year performance window, justifying a full replacement bid." 
      },
      { 
        question: "Is it worth trying to repair 'Bald Spots' on an aged shingle roof?", 
        answer: "Absolutely not. Granule loss leaves the asphalt mat exposed to UV, which destroys the shingle in months. Frame this as 'Exposed Vital Organs' of the roof to explain why a small repair won't stop the inevitable degradation of the entire system." 
      }
    ]
  },
  {
    slug: 'sms-review-request-generator',
    title: 'Post-Project SMS Review & Social Proof System',
    seoDescription: 'Automated outreach tool for capturing 5-star Google and Facebook reviews immediately following job completion.',
    type: 'text-generator',
    resultLabel: 'Review Request Script',
    inputs: [
      { id: 'clientName', label: 'Homeowner Name', type: 'text' }
    ],
    compute: (values) => {
      return `Hi ${values.clientName || 'there'}, thanks for choosing us for your roof! We're a local business and your feedback helps us grow. Would you mind leaving us a quick 5-star review here? [Link]`;
    },
    faqs: [
      { 
        question: "What is the 'Golden Window' to send an SMS review request and why?", 
        answer: "Send the text within 1 hour of the crew leaving the site. The homeowner's emotional satisfaction is at its peak right after the visual 'wow' factor of the transformation and the clean yard. High-speed review capture is the #1 way to dominate local SEO rankings." 
      },
      { 
        question: "How should I incentivize my roofing crews to collect 5-star reviews?", 
        answer: "Offer a $25–$50 'Review Bonus' for every review that mentions a crew member by name. This gamifies the process, ensures the job site is left immaculate, and provides your business with social proof that drives new organic leads." 
      },
      { 
        question: "Is it better to send a Google link or a Facebook link for roofing reviews?", 
        answer: "Google is priority #1. Google reviews directly impact your 'Map Pack' ranking and GMB visibility, which is where 70% of local roofing searches happen. Only pivot to Facebook if you are running heavy social media lead-gen campaigns." 
      }
    ]
  },
  {
    slug: 'roof-drainage-scupper-calculator',
    title: 'Commercial Drainage Scupper & IBC Code Sizing Tool',
    seoDescription: 'Technical sizing tool for parapet scuppers based on drainage area, rainfall intensity, and IBC code requirements.',
    type: 'calculator',
    resultLabel: 'Required Scupper Spec',
    inputs: [
      { id: 'area', label: 'Drainage Area (Sqft)', type: 'number', placeholder: '5000' },
      { id: 'rainfall', label: 'Rain Intensity (Inches/Hr)', type: 'number', placeholder: '4' }
    ],
    compute: (values) => {
      const area = Number(values.area) || 0;
      const rain = Number(values.rainfall) || 4;
      const totalFlow = (area * rain) / 96; // Simplify flow calculation
      const width = Math.ceil(totalFlow / 8) + 4; // Add baseline width
      return `${width}" wide x 6" high scupper`;
    },
    faqs: [
      { 
        question: "What is the IBC code requirement for primary vs. secondary scuppers?", 
        answer: "The International Building Code (IBC) requires secondary (overflow) scuppers to be sized at least as large as the primary drains and located 2 inches higher. Failing to meet this standard on a commercial reroof is a major structural liability if a primary drain ever clogs." 
      },
      { 
        question: "How can I avoid perimeter leaks around scupper installations?", 
        answer: "Always use a high-quality flashing membrane and ensure the scupper is 'set in a bed of mastic.' Professional custom-bent metal scuppers with wide flanges provide the best 'tie-in' to your main roof field, significantly reducing the risk of a high-consequence failure at the parapet wall." 
      },
      { 
        question: "How should I price scupper replacement on a flat-roofing project?", 
        answer: "Charge $250–$450 per scupper. This includes the custom metalwork and the high-skilled labor required to tie the scupper into the existing TPO or EPDM system. Don't include this in your general square count; it's a specialty technical detail that warrants a separate line item." 
      }
    ]
  },
  {
    slug: 'attic-fan-savings-calculator',
    title: 'Active Ventilation ROI & Thermal Transfer Analyzer',
    seoDescription: 'Calculate the energy impact of active solar ventilation vs. passive systems based on attic thermal transfer.',
    type: 'calculator',
    resultLabel: 'Thermal Efficiency Estimate',
    inputs: [
      { id: 'acBill', label: 'Current AC Bill ($)', type: 'number', placeholder: '300' },
      { id: 'insulation', label: 'Attic Insulation Level', type: 'select', options: ['Low (R-19)', 'Avg (R-38)', 'High (R-49+)'] }
    ],
    compute: (values) => {
      const bill = Number(values.acBill) || 0;
      let savingsPct = 0.15; // 15% savings with poor insulation
      if (values.insulation === 'Avg (R-38)') savingsPct = 0.10;
      if (values.insulation === 'High (R-49+)') savingsPct = 0.05;
      
      const savings = bill * savingsPct;
      return `$${savings.toFixed(2)} / Month during summer`;
    },
    faqs: [
      { 
        question: "What is the 'Negative Pressure' risk of powered attic fans?", 
        answer: "If the attic isn't air-sealed, a powered fan can pull conditioned (cooled) air from the living space into the attic. This forces the homeowner's AC to work harder—effectively neutralizing the savings. Educating your client on this allows you to sell a more comprehensive air-sealing and passive venting package." 
      },
      { 
        question: "Why is Passive Ventilation often superior to solar attic fans?", 
        answer: "Passive ventilation (soffit + ridge) has zero mechanical failure points. For a roofing company, this means fewer warranty callbacks related to non-functional solar motors or leaking fan housings. It's a 'Set It and Forget It' solution that delivers reliable performance for the life of the shingles." 
      },
      { 
        question: "How should I explain R-value vs. Attic temperatures during a sales pitch?", 
        answer: "Thermal transfer is the real enemy. Even a cool attic (via a fan) won't stop heat loss if the insulation is compressed or insufficient. Positioning your company as an 'Attic Health' expert who understands both venting and R-values allows you to justify a much higher project ticket." 
      }
    ]
  },
  {
    slug: 'hail-damage-probability-tool',
    title: 'Mat Fracture & Impact Probability Inspection Tool',
    seoDescription: 'Professional diagnostic tool for determining the risk of shingle mat fractures based on hailstone mechanical force.',
    type: 'template',
    resultLabel: 'Impact Risk Analysis',
    inputs: [
      { id: 'size', label: 'Hailstone Size', type: 'select', options: ['Pea (0.25")', 'Nickel (0.88")', 'Quarter (1.00")', 'Golf Ball (1.75")', 'Baseball (2.75"+)'] },
      { id: 'age', label: 'Roof Age (Years)', type: 'number', placeholder: '10' }
    ],
    compute: (values) => {
      const age = Number(values.age) || 0;
      let risk = 'Low';
      if (values.size === 'Quarter (1.00")' && age > 10) risk = 'Moderate';
      if (values.size === 'Golf Ball (1.75")') risk = 'High';
      if (values.size === 'Baseball (2.75"+)') risk = 'Critical (Immediate Inspection)';
      
      return `${risk} Risk - ${risk === 'Low' ? 'Surface bruising unlikely.' : 'Structural damage to shingles likely.'}`;
    },
    faqs: [
      { 
        question: "What constitutes 'Functional Damage' in an insurance hail claim?", 
        answer: "In the roofing industry, functional damage is defined as a reduction in the roof's lifespan or its ability to shed water. Identifying fractures in the shingle mat or significant granule bruising allows you to prove to an adjuster that a full replacement is required despite no active leaks." 
      },
      { 
        question: "How should I document a 'Hail Impact' to ensure claim approval?", 
        answer: "Use high-res macros of individual bruises and mark a 10’x10’ 'test square' on each roof face. Counting the impacts per square provides the objective data insurance carriers need to approve a full replacement, protecting your client and securing your contract." 
      },
      { 
        question: "Why should my company avoid using the term 'Bruising' on older roofs?", 
        answer: "On aged, brittle roofs, hail often causes 'fractures' rather than just bruising. Focus your documentation on 'Mat Fracture' and 'Thermal Splitting' caused by the impact—these terms are more scientifically accurate for insurance purposes and harder for an adjuster to dismiss." 
      }
    ]
  },
  {
    slug: 'roofing-permit-fee-estimator',
    title: 'Municipal Permit Fee & Compliance Budget Tool',
    seoDescription: 'Project budget tool for estimating city/county permit fees based on contract value and project classification.',
    type: 'calculator',
    resultLabel: 'Estimated Compliance Fee',
    inputs: [
      { id: 'contractValue', label: 'Total Contract Value ($)', type: 'number', placeholder: '15000' },
      { id: 'type', label: 'Project Type', type: 'select', options: ['Residential', 'Commercial'] }
    ],
    compute: (values) => {
      const val = Number(values.contractValue) || 0;
      const baseFee = values.type === 'Commercial' ? 250 : 100;
      const incremental = (val / 1000) * 12; // $12 per $1k val
      return `$${Math.ceil(baseFee + incremental).toLocaleString()}`;
    },
    faqs: [
      { 
        question: "Why should my roofing company always handle the permit process?", 
        answer: "Pulling the permit is a professional 'Shield.' It proves you are licensed and bonded. If you allow a homeowner to pull an 'Owner-Builder' permit, they assume all liability for injuries on the site—which can lead to massive legal headaches for your business if anything goes wrong." 
      },
      { 
        question: "How can I explain permit fees as a non-negotiable project cost?", 
        answer: "Explain that the fee covers the 'Final Inspection.' This inspection provides the homeowner with a third-party certificate from the city/county verifying that your work meets code. It’s an insurance policy for the client that justifies the $300–$700 permit line-item in your bid." 
      },
      { 
        question: "What happens if I skip the permit for a residential reroof?", 
        answer: "Skipping permits leads to work-stop orders and massive fines ($1,000+). More importantly, if the homeowner tries to sell the house later, a title search will reveal the unpermitted work, potentially requiring you to return and 'certify' the roof at your own expense." 
      }
    ]
  },
  {
    slug: 'cool-roof-roi-calculator',
    title: 'Title 24 Compliance & Reflective ROI Analyzer',
    seoDescription: 'Technical ROI tool for SRI (Solar Reflectance Index) systems, factoring in energy credits and cooling equipment stress reduction.',
    type: 'calculator',
    resultLabel: 'Energy Payback Period',
    inputs: [
      { id: 'premium', label: 'Cool Roof Premium Cost ($)', type: 'number', placeholder: '2000' },
      { id: 'savings', label: 'Annual Energy Savings ($)', type: 'number', placeholder: '400' }
    ],
    compute: (values) => {
      const cost = Number(values.premium) || 2000;
      const savings = Number(values.savings) || 400;
      const years = cost / savings;
      return `${years.toFixed(1)} Years to break even`;
    },
    faqs: [
      { 
        question: "What is California Title 24 and why does it matter for cool roofs?", 
        answer: "Title 24 requires specific SRI (Solar Reflectance Index) values for residential and commercial roofs in CA. Mastering these technical requirements allows you to position yourself as a compliance expert for both new builds and major reroofing projects in that market." 
      },
      { 
        question: "How should I market the ROI of high-reflectance systems on commercial bids?", 
        answer: "Focus on the 'Lifecycle Savings.' A cool roof can reduce HVAC equipment wear by 15%, leading to longer building lifespans and lower maintenance costs. Presenting this to building owners shifts the project from a 'Pure Expense' to a 'Capital Investment with ROI.'" 
      },
      { 
        question: "Should my company offer reflectivity testing for existing flat roofs?", 
        answer: "Yes; use a simple hand-held SRI meter to show how much heat an old black roof is absorbing. This visual data is a powerful closing tool that justifies the premium for a new premium white coating or single-ply system." 
      }
    ]
  },
  {
    slug: 'roofing-safety-gear-cost',
    title: 'OSHA Compliance & Fall Protection Budget Tool',
    seoDescription: 'Business operational tool for budgeting OSHA-certified fall protection systems, including harnesses and permanent anchors.',
    type: 'calculator',
    resultLabel: 'OSHA Gear Budget',
    inputs: [
      { id: 'workers', label: 'Number of Workers', type: 'number', placeholder: '4' },
      { id: 'anchors', label: 'Number of Permanent Anchors', type: 'number', placeholder: '2' }
    ],
    compute: (values) => {
      const workers = Number(values.workers) || 0;
      const anchors = Number(values.anchors) || 0;
      const kitPrice = 250; // Harness, lanyard, rope
      const anchorPrice = 45;
      
      const total = (workers * kitPrice) + (anchors * anchorPrice);
      return `$${total.toLocaleString()} for full OSHA compliance gear.`;
    },
    faqs: [
      { 
        question: "What is OSHA 1926.501 and how does it affect my roofing margins?", 
        answer: "OSHA requires fall protection for work at 6 feet or more. Implementing this correctly isn't just about safety; it's about protecting your 'X-Mod' insurance rating. One OSHA fine or injury claim can double your premiums, wiping out years of project profit." 
      },
      { 
        question: "How should I budget for crew safety gear on high-volume projects?", 
        answer: "Factor a 'Safety Surcharge' into your per-square labor rates. High-quality permanent anchors and harnesses are a cost of doing business. Showing the homeowner that you invest in certified safety equipment justifies your premium pricing over 'under-the-table' crews." 
      },
      { 
        question: "Do permanent roof anchors add value to a residential roof replacement?", 
        answer: "Yes. Position them as a 'Lifetime Service Point.' They allow for safe future maintenance, gutter cleaning, and satellite installs. Framing a permanent anchor as a 'Professional Service Standard' demonstrates your company's superior attention to code and safety." 
      }
    ]
  },
  {
    slug: 'roofing-profitability-burden-calculator',
    title: 'Roofing Business Profitability & Burden Shield',
    seoDescription: 'High-level financial tool for roofing owners to calculate true net profit by factoring in overhead burden, commission leakage, and material slippage.',
    type: 'calculator',
    resultLabel: 'True Net Profit (Projected)',
    inputs: [
      { id: 'contractTotal', label: 'Total Contract Value ($)', type: 'number', placeholder: '15000' },
      { id: 'laborMaterial', label: 'Direct Costs (Labor + Mat)', type: 'number', placeholder: '9000' },
      { id: 'commission', label: 'Sales Commission (%)', type: 'number', placeholder: '10' },
      { id: 'overhead', label: 'Overhead Burden (%)', type: 'number', placeholder: '15', description: 'Internal ops, insurance, office, fuel.' }
    ],
    compute: (values) => {
      const total = Number(values.contractTotal) || 0;
      const direct = Number(values.laborMaterial) || 0;
      const commPct = Number(values.commission) || 0;
      const overheadPct = Number(values.overhead) || 0;
      
      const commAmount = total * (commPct / 100);
      const overheadAmount = total * (overheadPct / 100);
      const netProfit = total - direct - commAmount - overheadAmount;
      const margin = (netProfit / total) * 100;
      
      return `$${netProfit.toLocaleString()} (${margin.toFixed(1)}% Net Margin)`;
    },
    faqs: [
      { 
        question: "What is 'Overhead Burden' and why should I include it in every roofing bid?", 
        answer: "Overhead burden includes your non-job costs: office rent, insurance premiums (GL/WorkComp), administrative salaries, and fuel. Most contractors fail because they only track Labor and Materials. Facturing in a 15–20% burden ensures you aren't just 'trading dollars' but actually building business equity." 
      },
      { 
        question: "How do I calculate 'Commission Leakage' in my sales pipeline?", 
        answer: "Commission leakage occurs when sales reps over-promise or fail to account for supplemental material costs. By using a 'Net Profit' commission model (rather than a 'Gross Sale' model), you align your sales team's incentives with the company's bottom-line health." 
      },
      { 
        question: "What is a healthy net profit margin for a residential roofing company?", 
        answer: "Target a 20–30% gross margin and a 10–15% net profit margin. In a volume-based business, a 10% net profit is the 'Safe Zone.' If your net margin is consistently below 5%, your overhead burden is likely too high or your per-square labor rates are outdated for the current market." 
      }
    ]
  },
  {
    slug: 'emergency-tarp-pricing-tool',
    title: 'Emergency Tarping & Hazard Surcharge Tool',
    seoDescription: 'Calculate high-margin rates for emergency tarping services, including hazard pay multipliers and insurance-approved material line items.',
    type: 'calculator',
    resultLabel: 'Recommended Emergency Service Bid',
    inputs: [
      { id: 'tarpArea', label: 'Tarp Area (Sqft)', type: 'number', placeholder: '500' },
      { id: 'hazard', label: 'Hazard Level', type: 'select', options: ['Standard (Eave)', 'High (Ridge/Steep)', 'Extreme (Night/Storm)'] }
    ],
    compute: (values) => {
      const area = Number(values.tarpArea) || 0;
      let rate = 1.50; // per sqft
      if (values.hazard === 'High (Ridge/Steep)') rate = 2.75;
      if (values.hazard === 'Extreme (Night/Storm)') rate = 4.50;
      
      const total = area * rate;
      return `$${total.toLocaleString()} (Hazard Surcharge Included)`;
    },
    faqs: [
      { 
        question: "How do I justify an 'Extreme Hazard' surcharge to a desk adjuster?", 
        answer: "Document the site conditions with time-stamped video. If your crew is tarping a roof in 40MPH winds at 11 PM, the liability risk and specialty gear (harnesses, high-lumen lighting) warrant a 3x multiplier. Citing the 'Emergency Mitigation' requirements of the policy ensures the carrier covers these additional safety costs." 
      },
      { 
        question: "What are the standard Xactimate codes for emergency roof tarping?", 
        answer: "Use code ROF-TARP for the basic installation, but remember to supplement for 'High-Rise' or 'Steep Slope' surcharges if applicable. Proper documentation of the 'Time and Materials' (T&M) used for temporary repairs is the fastest way to get your emergency invoices paid in full by insurance." 
      }
    ]
  }
];
