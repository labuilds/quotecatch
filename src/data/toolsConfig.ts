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
    title: 'Gutter & Downspout (Linear Footage) Estimator',
    seoDescription: 'Precisely estimate linear footage for gutter systems, including corner miters and downspout drop factors.',
    type: 'calculator',
    resultLabel: 'Material Linear Footage',
    inputs: [
      { id: 'perimeter', label: 'Roof Perimeter (Feet)', type: 'number', placeholder: 'e.g. 200' },
      { id: 'stories', label: 'Building Stories', type: 'select', options: ['1 Story', '2 Story', '3 Story'] }
    ],
    compute: (values) => {
      const feet = Number(values.perimeter) || 0;
      const downspouts = Math.ceil(feet / 30);
      let dsLength = 10;
      if (values.stories === '2 Story') dsLength = 20;
      if (values.stories === '3 Story') dsLength = 30;
      
      return `${feet}lf Gutter, ${downspouts} Downspouts (~${downspouts * dsLength} total vertical feet)`;
    },
    faqs: [
      { 
        question: "When should I specify 6-inch gutters over the 5-inch residential standard?", 
        answer: "Specify 6-inch gutters for steep roofs (7/12+) or long runs over 40 feet. Larger gutters have 50% more capacity, which prevents water from 'overshooting' the edge during high-intensity storms, protecting the customer's foundation and your reputation." 
      },
      { 
        question: "How do I calculate the 'Adjusted Square Footage' for gutter capacity?", 
        answer: "Use the pitch factor to increase your plan-view area. A 12/12 pitch roof shed water 40% faster than a 4/12 roof. Adjusting your capacity calculation for speed (not just volume) ensures you don't install an undersized system on a steep custom home." 
      },
      { 
        question: "Why is the 3x4 inch downspout the benchmark for professional drainage?", 
        answer: "The downspout is the bottleneck. A 3x4 inch downspout provides nearly double the drainage area of the standard 2x3. For 6-inch gutter systems, 3x4 downspouts are mandatory to handle the increased volume and prevent ice-heave in winter." 
      }
    ]
  },
  {
    slug: 'roof-ventilation-calculator',
    title: 'NFA Balancing & Code Compliance Lead Machine',
    seoDescription: 'Technical NFA tool for contractors to ensure 1:150 balancing to meet IRC building codes and prevent shingle warranty invalidation.',
    type: 'calculator',
    resultLabel: 'Required NFA (Target Benchmark)',
    inputs: [
      { id: 'atticSqft', label: 'Attic Floor Square Footage', type: 'number', placeholder: 'e.g. 2000' },
      { id: 'ratio', label: 'Ventilation Ratio', type: 'select', options: ['1:150 (Standard)', '1:300 (With Vapor Barrier)'] }
    ],
    compute: (values) => {
      const sqft = Number(values.atticSqft) || 0;
      const ratio = values.ratio === '1:300 (With Vapor Barrier)' ? 300 : 150;
      const totalNfaNeeded = (sqft / ratio) * 144; // sqft to sq inches
      return `${Math.ceil(totalNfaNeeded)} sq. inches (Split 50/50 Intake/Exhaust)`;
    },
    faqs: [
      { 
        question: "What is the 1/300 Ventilation Rule and how do I qualify for it?", 
        answer: "The 1/300 code allows you to reduce required venting if the system is 'balanced' (50% intake at soffit, 50% exhaust at ridge). Proving a balanced system allows you to avoid over-venting, which can trap moisture if not designed correctly." 
      },
      { 
        question: "How do I calculate Net Free Area (NFA) for ridge vents vs. static pods?", 
        answer: "NFA represents the actual airflow capacity after subtracting the vent's structure. For ridge vents, the industry standard is 18 sq. inches per linear foot. Always calculate on NFA, not vent size, to ensure you meet IRC residential codes." 
      },
      { 
        question: "Why is balanced intake and exhaust critical for meeting shingle warranties?", 
        answer: "Thermal transfer is the enemy. Unbalanced ventilation (too much exhaust, not enough intake) creates a vacuum that pulls moisture into the attic. Maintaining a 1:1 ratio protects the shingle warranty and prevents premature granule loss from heat buildup." 
      }
    ]
  },
  {
    slug: 'roof-referral-request-generator',
    title: 'Customer Referral & Social Proof System',
    seoDescription: 'Business tool for activating happy roofing customers to generate high-quality referrals and organic social proof.',
    type: 'text-generator',
    resultLabel: 'Referral Campaign Script',
    inputs: [
      { id: 'customerName', label: 'Customer Name', type: 'text' },
      { id: 'bonus', label: 'Referral Bonus ($)', type: 'number', placeholder: '100' }
    ],
    compute: (values) => {
      return `Hi ${values.customerName || 'there'}, I'm so glad we could get your roof handled! Since we're a local company, most of our work comes from neighbors like you. 

I'd love to invite you into our "Refer-a-Neighbor" program where we'll send you a $${values.bonus || '100'} gift card for every lead that turns into a roof. Would you mind if I checked in with you in a week to see if any of your friends were asking about the new look?`;
    },
    faqs: [
      { 
        question: "How can I use a referral program to reduce my average cost-per-lead?", 
        answer: "Referrals are your lowest-cost lead source. By offering a $100–$250 'Refer-a-Neighbor' bonus, you can acquire high-converting leads for a fraction of the cost of Google Ads or door-knocking labor, significantly padding your net profits." 
      },
      { 
        question: "What is the best way to ask a 'High-NPS' client for a written review or referral?", 
        answer: "Ask during the final walkthrough while the yard is clean and the new roof look is fresh. Use a script that positions their referral as 'helping their neighbors work with a licensed pro' rather than just making you more money." 
      },
      { 
        question: "How often should I follow up with former clients for new referrals?", 
        answer: "Schedule a '1-Year Wellness Check' email. Ask how the roof is holding up and remind them of your referral incentive. This keeps your brand top-of-mind just as their friends and family might be starting their own home projects." 
      }
    ]
  },
  {
    slug: 'insurance-denial-appeal-script',
    title: 'Insurance Technical Rebuttal & Appeal System',
    seoDescription: 'Evidence-based appeal generator for contractors citing manufacturer installation specs (GAF/OC) and Appraisal Clause escalation language.',
    type: 'text-generator',
    resultLabel: 'Rebuttal Argument Language',
    inputs: [
      { id: 'carrier', label: 'Insurance Carrier', type: 'text', placeholder: 'State Farm' },
      { id: 'claimNum', label: 'Claim Number', type: 'text' },
      { id: 'date', label: 'Date of Loss', type: 'text' }
    ],
    compute: (values) => {
      return `RE: Appeal of Claim #${values.claimNum || '[CLAIM #]'}
Date of Loss: ${values.date || '[DATE]'}

To whom it may concern at ${values.carrier || '[CARRIER]'},

We are formally requesting a re-inspection of the property located at the address on file. Our licensed roofing contractor has identified significant functional damage to the ${values.date || 'subject'} storm event that was not adequately addressed in the initial adjustment. Specifically, we have found material loss and creased shingles that pose an immediate risk to the structural integrity of the home. 

We look forward to meeting your adjuster at the property to ensure the homeowner receives the full coverage they are entitled to under their policy.`;
    },
    faqs: [
      { 
        question: "How do I cite manufacturer installation specs (Mat Fracture) in a rebuttal?", 
        answer: "Focus on shingle mat integrity. If a carrier denies 'bruising' as cosmetic, generate a rebuttal citing GAF or Owens Corning specs that prove mat fracture reduces the roof's waterproofing performance—invalidating the denial under the policy's duty to repair." 
      },
      { 
        question: "What is the specific language for an 'Appraisal Clause' escalation?", 
        answer: "When a carrier hits a technical deadlock, invoke the Appraisal Clause. The script generated by this tool uses the standard language: 'We hereby demand Appraisal under the terms of the policy to determine the amount of loss,' forcing a neutral umpire to resolve the dispute." 
      },
      { 
        question: "How can I prove 'Standard Waste' is insufficient for an insurance claim?", 
        answer: "Submit an itemized complexity report from this tool showing hip/ridge linear footage vs. facet area. Proving that the 'Suggested Waste Factor' from EagleView exceeds the carrier's default 10% is the most effective way to win supplemental material payments." 
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
      let pricePerSqft = 4.50;
      if (values.quality === 'Premium (.044)') pricePerSqft = 6.25;
      if (values.quality === 'Insulated Vinyl') pricePerSqft = 8.50;
      
      const total = sqft * pricePerSqft;
      return `$${total.toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How should I set my labor rate for vertical Board & Batten siding installation?", 
        answer: "Always add a 15%–20% labor premium for vertical siding. The requirement for extra furring strips and more complex trimming at the eaves significantly increases man-hours compared to standard horizontal laps." 
      },
      { 
        question: "What is the sales ROI of upselling insulated vinyl siding to homeowners?", 
        answer: "Insulated vinyl allows you to position the project as an 'Energy Upgrade' rather than just an aesthetic change. Though the material costs 40% more, it supports a much higher markup and reduces call-backs related to panel 'noise' and expansion warping." 
      },
      { 
        question: "How can I maintain siding project margins during material price volatility?", 
        answer: "Include a 30-day expiration on all siding quotes. Work with your local supplier to secure 'lock-in' pricing on popular colors (like charcoal or deep blues) to ensure you aren't eating price hikes between the estimate and the install date." 
      }
    ]
  },
  {
    slug: 'cedar-shake-roof-calculator',
    title: 'Cedar Shake Grade & Triple-Coverage Estimator',
    seoDescription: 'Technical material estimator for cedar roofing, calculating bundle counts based on exposure and Blue Label vs. Red Label grading.',
    type: 'calculator',
    resultLabel: 'Cedar Material Schedule',
    inputs: [
      { id: 'squares', label: 'Roof Squares', type: 'number', placeholder: 'e.g. 25' },
      { id: 'exposure', label: 'Exposure (Inches)', type: 'select', options: ['5 inch exposure', '7.5 inch exposure'] },
      { id: 'grade', label: 'Shake Grade', type: 'select', options: ['No. 1 Blue Label', 'No. 2 Red Label'] }
    ],
    compute: (values) => {
      const squares = Number(values.squares) || 0;
      const bundlesPerSquare = values.exposure === '5 inch exposure' ? 5 : 4;
      const totalBundles = squares * bundlesPerSquare;
      const basePrice = values.grade === 'No. 1 Blue Label' ? 120 : 90;
      
      return `${totalBundles} Bundles (~$${(totalBundles * basePrice).toLocaleString()} budget)`;
    },
    faqs: [
      { 
        question: "Why should my company only quote 'Blue Label' cedar for primary structures?", 
        answer: "No. 1 Blue Label shakes are 100% edge-grain and clear of knots. Recommending lower grades (Red Label) for a main roof creates a massive liability for leaks and warping, which will cost your company more in warranty calls than you save on material." 
      },
      { 
        question: "How can I explain bundle-per-square counts to justify a premium cedar bid?", 
        answer: "Focus on 'Triple-Coverage.' Explain that at a 5-inch exposure, you are providing three layers of cedar at every point of the roof. This technical justification makes your high-bundle-count bid look like 'Superior Protection' compared to a low-exposure, cheaper competitor." 
      },
      { 
        question: "What is the professional standard for cedar shake underlayment?", 
        answer: "Always use a specialized breathable underlayment (like Cedar Breather) to prevent rot. Adding this $0.50–$0.75 per sq. ft. material prevents common moisture trap issues, allowing you to offer a much stronger 25-year workmanship warranty." 
      }
    ]
  },
  {
    slug: 'roof-cleaning-cost-estimator',
    title: 'Roof Maintenance & Soft-Wash Profit Estimator',
    seoDescription: 'Business calculator for estimating margins on soft-wash roof cleaning services, including chemical costs and steep-slope premiums.',
    type: 'calculator',
    resultLabel: 'Estimated Service Quote',
    inputs: [
      { id: 'sqft', label: 'Roof Square Footage', type: 'number', placeholder: 'e.g. 2500' },
      { id: 'method', label: 'Cleaning Method', type: 'select', options: ['Soft Wash (Chemical)', 'Low Pressure Wash'] },
      { id: 'steepness', label: 'Roof Pitch', type: 'select', options: ['Walkable', 'Moderate', 'Steep (Harness required)'] }
    ],
    compute: (values) => {
      const sqft = Number(values.sqft) || 0;
      let rate = 0.35;
      if (values.method === 'Low Pressure Wash') rate = 0.50;
      if (values.steepness === 'Steep (Harness required)') rate += 0.15;
      
      const total = sqft * rate;
      return `$${total.toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How can I add roof soft-washing as a high-margin service to my roofing business?", 
        answer: "Soft-washing has a 70%–80% profit margin and is an easy 'maintenance upsell' after any inspection. Position it as a way to 'extend the life of your existing roof' for clients who aren't ready for a full $20,000 replacement yet." 
      },
      { 
        question: "What are the common liability pitfalls of pressure washing shingles?", 
        answer: "Pressure washing is a massive liability. High-force water strips away protective granules, potentially voiding the manufacturer's warranty and shortening the roof's life. Only use soft-wash chemical systems to protect your business's reputation and avoid damage claims." 
      },
      { 
        question: "Should I charge extra for moss removal on steep-slope roofs?", 
        answer: "Yes; any roof requiring a harness safety system should carry a 20%–30% 'steep-slope premium.' The added time for anchoring and the increased risk to your technicians must be reflected in your service ticket to maintain target profitability." 
      }
    ]
  },
  {
    slug: 'skylight-install-calculator',
    title: 'Skylight Installation Calculator',
    seoDescription: 'Estimate the cost to install or replace skylights during a roof replacement.',
    type: 'calculator',
    resultLabel: 'Skylight Total',
    inputs: [
      { id: 'count', label: 'Number of Skylights', type: 'number', placeholder: '1' },
      { id: 'type', label: 'Skylight Type', type: 'select', options: ['Fixed (No vent)', 'Manual Venting', 'Solar Powered Venting'] }
    ],
    compute: (values) => {
      const count = Number(values.count) || 0;
      let unitPrice = 900;
      if (values.type === 'Manual Venting') unitPrice = 1400;
      if (values.type === 'Solar Powered Venting') unitPrice = 2200;
      
      return `$${(count * unitPrice).toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How should I price skylight replacements during a full roof tear-off?", 
        answer: "Since your crew is already doing the labor for flashing and shingle tie-ins, you can offer a $500–$800 discount on skylight replacements compared to standalone installs. This 'bundled price' makes the upsell nearly irresistible to homeowners during a reroof." 
      },
      { 
        question: "What is the sales advantage of pitching solar-powered skylights?", 
        answer: "Position the 26%-30% federal tax credit (Section 25D). Because the credit covers the entire cost of the unit and the installation labor, your client effectively gets an automated, solar-venting unit for the same price as a manual sky-light." 
      },
      { 
        question: "How can I prevent leaks on low-slope skylight installations?", 
        answer: "Always use curb-mounted skylights for roofs below a 3/12 pitch. Building a professional wooden curb ensures water flows around the unit rather than pooling on the frame—eliminating the #1 source of skylight callbacks for flat-roof TPO projects." 
      }
    ]
  },
  {
    slug: 'solar-roof-capacity-calculator',
    title: 'PV Array & Solar Power Capacity Estimator',
    seoDescription: 'Professional tool for contractors to estimate usable roof area for solar PV arrays, factoring in setbacks and fire code pathways.',
    type: 'calculator',
    resultLabel: 'Projected Solar Capacity',
    inputs: [
      { id: 'area', label: 'Usable South-Facing Sqft', type: 'number', placeholder: 'e.g. 800' },
      { id: 'panelWattage', label: 'Panel Wattage', type: 'number', placeholder: '400' }
    ],
    compute: (values) => {
      const area = Number(values.area) || 0;
      const wattage = Number(values.panelWattage) || 400;
      const panels = Math.floor(area / 18); // Avg panel is ~18 sqft
      const kw = (panels * wattage) / 1000;
      
      return `${panels} Panels (~${kw.toFixed(2)} kW System)`;
    },
    faqs: [
      { 
        question: "How should I calculate 'usable' area for a solar-ready roof installation?", 
        answer: "Always subtract 3-foot pathways from all ridges and eaves for fire code compliance. When pitching a reroof, show the client their 'Usable Solar Zone' vs. 'Setback Zone' to demonstrate your technical expertise in modern roofing standards." 
      },
      { 
        question: "What is the ROI potential for upselling 'Solar-Ready' underlayment?", 
        answer: "High-temperature underlayment (like Grace Ice & Water Shield HT) is essential for roofs getting solar later. Upselling this premium product now protects the shingles from the extreme heat trapped under solar panels, allowing you to charge a $0.50–$1.00 per sq. ft. premium." 
      },
      { 
        question: "How can a solar capacity estimate help me close higher roofing tickets?", 
        answer: "By demonstrating how many kW their roof can produce, you position your roofing company as an energy consultant. This adds a 'high-tech' layer to your brand that local 'shingle slingers' can't match, allowing you to command higher margins." 
      }
    ]
  },
  {
    slug: 'labor-cost-with-overtime-calculator',
    title: 'Project Labor & Overtime Burden Calculator',
    seoDescription: 'Business calculator for roofing owners to estimate total labor costs including overtime premiums and loaded payroll factors.',
    type: 'calculator',
    resultLabel: 'Fully Burdened Labor Expense',
    inputs: [
      { id: 'crewSize', label: 'Crew Size', type: 'number', placeholder: '4' },
      { id: 'hourlyRate', label: 'Hourly Rate / Person ($)', type: 'number', placeholder: '25' },
      { id: 'hours', label: 'Total Hours Worked', type: 'number', placeholder: '50' }
    ],
    compute: (values) => {
      const crew = Number(values.crewSize) || 0;
      const rate = Number(values.hourlyRate) || 0;
      const hours = Number(values.hours) || 0;
      
      const regularHours = Math.min(hours, 40);
      const otHours = Math.max(hours - 40, 0);
      
      const totalPerPerson = (regularHours * rate) + (otHours * rate * 1.5);
      return `$${(totalPerPerson * crew).toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How can I ensure my piece-rate roofing crew is FLSA compliant for overtime?", 
        answer: "By law, piece-rate workers are entitled to overtime pay based on their 'regular rate of pay' for that week. Calculate the total earnings divided by total hours; if they exceed 40, you must pay an additional half-time premium to avoid massive DOL back-wage penalties." 
      },
      { 
        question: "What is the biggest labor liability for roofing companies using subcontractors?", 
        answer: "Misclassification. If you control the crew's schedule, provide their tools, and dictate every movement, the IRS may classify them as W-2 employees. Using a robust 1099 subcontractor agreement is vital to prove their independent contractor status." 
      },
      { 
        question: "How should I budget for workers' comp premiums in my labor estimates?", 
        answer: "Roofing has some of the highest workers' comp rates in the industry (~$20–$40 per $100 of payroll). Ensure your labor quote includes this 'burdened' cost to protect your net profit from being eroded by end-of-year insurance audits." 
      }
    ]
  },
  {
    slug: 'tile-roof-repair-estimator',
    title: 'Clay/Concrete Tile Repair Service Estimator',
    seoDescription: 'Technical tool for estimating specialty tile repairs, factoring in mobilization charges and profile-specific material costs.',
    type: 'calculator',
    resultLabel: 'Tile Repair System Estimate',
    inputs: [
      { id: 'brokenCount', label: 'Number of Broken Tiles', type: 'number', placeholder: '10' },
      { id: 'tileType', label: 'Tile Type', type: 'select', options: ['Concrete Flat', 'Clay S-Tile', 'Concrete Spanish'] }
    ],
    compute: (values) => {
      const count = Number(values.brokenCount) || 0;
      let laborBase = 250; // Trip charge
      let tileCost = 15;
      if (values.tileType === 'Clay S-Tile') tileCost = 25;
      
      const total = laborBase + (count * tileCost) + (count * 10); // $10 per tile labor
      return `$${total.toLocaleString()}`;
    },
    faqs: [
      { 
        question: "How should I structure my 'Trip Charge' for small tile repair jobs?", 
        answer: "Always charge a minimum flat-fee 'mobilization charge' ($350–$500) regardless of the tile count. This covers the cost of travel, safety setup, and the high-liability risk of walking on fragile concrete or clay tiles." 
      },
      { 
        question: "What is the secret to sourcing matching tiles for older roof repairs?", 
        answer: "Keep a 'Boneyard' of salvaged tiles from your full replacement jobs. Being able to offer an immediate match for a 20-year-old Monier or Eagle tile profile allows you to charge a premium for your 'expert sourcing' and immediate job completion." 
      },
      { 
        question: "How can I prevent crew members from breaking extra tiles during a repair?", 
        answer: "Enforce a 'Walk on the Laps' rule. Tiles are strongest where they overlap the battens. Professional crews should also use foam walking pads or specialized roofing ladders to distribute weight evenly and eliminate the cost of collateral damage." 
      }
    ]
  },
  {
    slug: 'snow-guard-layout-calculator',
    title: 'Snow Guard Spacing & Structural Load Tool',
    seoDescription: 'Determine required snow guard layout patterns based on roof pitch, eave length, and staggering requirements.',
    type: 'calculator',
    resultLabel: 'Required Component Schedule',
    inputs: [
      { id: 'length', label: 'Roof Length (Eave Feet)', type: 'number', placeholder: '50' },
      { id: 'pitch', label: 'Roof Pitch', type: 'select', options: ['Low (under 6/12)', 'Medium (6/12 to 10/12)', 'Steep (over 10/12)'] }
    ],
    compute: (values) => {
      const length = Number(values.length) || 0;
      let spacing = 12; // inches
      if (values.pitch === 'Medium (6/12 to 10/12)') spacing = 9;
      if (values.pitch === 'Steep (over 10/12)') spacing = 6;
      
      const guardsPerRow = (length * 12) / spacing;
      return `${Math.ceil(guardsPerRow * 2)} Guards (Recommended in 2 staggered rows)`;
    },
    faqs: [
      { 
        question: "How can I upsell snow guards as a mandatory safety feature for metal roofs?", 
        answer: "Explain the 'Avalanche Risk' and the liability of standard gutters. On slick surfaces like metal or slate, snow guards are an essential investment to prevent total gutter failure and the risk of injury to people on the ground—protecting the homeowner and your business." 
      },
      { 
        question: "What is the markup strategy for standing seam vs. screw-down snow guards?", 
        answer: "Standing seam snow guards (using non-penetrating clamps like S-5!) should carry a higher premium. Position the 'No Holes in Your Roof' benefit to justify the $15–$25 per unit cost, allowing for a 40% margin on the hardware and labor." 
      },
      { 
        question: "Should my company offer snow guard layout design as a professional service?", 
        answer: "Yes; a professional layout that considers rafter length and local snow-load data separates you from 'handyman' competitors. Providing a stamped or technical layout adds massive perceived value to your metal roofing bids." 
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
        question: "How should I structure my 'Per Sheet' replacement price for 2026?", 
        answer: "Charge $85–$115 per sheet. This covers the material, disposal of the rotted sheet, and the labor for custom cutting. Standardizing this price in your contract upfront eliminates 'sticker shock' when your crew finds rot during the tear-off phase." 
      },
      { 
        question: "Why should my crew replace rotted decking instead of 'patching' it?", 
        answer: "Patching rot is a major liability. If a roofing nail doesn't have a solid wood 'bite,' that shingle will blow off in the next storm. Complete sheet replacement ensures a full manufacturer warranty and protects your business from workmanship claims." 
      }
    ]
  },
  {
    slug: 'hoa-roofing-approval-generator',
    title: 'HOA Technical Spec & Approval Package Builder',
    seoDescription: 'Generate professional HOA approval documents including material technical data and manufacturer spec sheets.',
    type: 'template',
    resultLabel: 'Technical Approval Content',
    inputs: [
      { id: 'hoaName', label: 'HOA Board Name', type: 'text' },
      { id: 'material', label: 'Proposed Material', type: 'text', placeholder: 'CertainTeed Landmark' },
      { id: 'color', label: 'Proposed Color', type: 'text', placeholder: 'Weathered Wood' }
    ],
    compute: (values) => {
      return `To the Board of Directors at ${values.hoaName || '[HOA NAME]'},
      
I am writing to formally submit a request for exterior modification for my property. I intend to replace my current roof with ${values.material || 'a high-quality asphalt shingle'} in the color ${values.color || '[COLOR]'}. 

This material has been chosen specifically to maintain the aesthetic harmony of the neighborhood while providing superior wind and fire resistance. Enclosed with this request is the manufacturer's technical data sheet and a sample of the granule coloring. 

I look forward to your timely approval so we can proceed with the installation.`;
    },
    faqs: [
      { 
        question: "How can I help my clients win HOA approval for premium roofing materials?", 
        answer: "Provide them with a 'Technical Spec Package.' This includes high-res material brochures, fire-rating certifications, and local address references where you've installed the same material. This professional documentation closes HOA-restricted leads much faster." 
      },
      { 
        question: "What should my roofing company do if an HOA denies a color choice?", 
        answer: "Request the 'Approved Roofing Palette' immediately and offer the closest matching architectural shingle. Position the upgrade to a more durable mat or better wind rating to maintain the project's high-ticket value despite the color restriction." 
      },
      { 
        question: "Is it worth specializing in HOA-managed neighborhoods?", 
        answer: "Yes; the complexity of HOA approvals acts as a barrier to entry for 'fly-by-night' contractors. Becoming the 'Go-To HOA Pro' allows you to charge higher margins and often leads to lucrative group-bid opportunities within the community." 
      }
    ]
  },
  {
    slug: 'roof-ridge-vent-calculator',
    title: 'Ridge Vent Linear Footage & NFA Balancing Tool',
    seoDescription: 'Calculate mandatory linear footage for ridge vents to achieve balanced NFA (Net Free Area) with soffit intake.',
    type: 'calculator',
    resultLabel: 'Calculated Ridge Component Schedule',
    inputs: [
      { id: 'linearFeet', label: 'Total Ridge Length (Feet)', type: 'number', placeholder: 'e.g. 80' },
      { id: 'ventType', label: 'Vent Profile', type: 'select', options: ['Standard Shingle-Over', 'High-Profile Aluminum', 'Metal Roof Z-Vent'] }
    ],
    compute: (values) => {
      const feet = Number(values.linearFeet) || 0;
      const pieces = Math.ceil(feet / 4); // Standard 4ft pieces
      return `${pieces} pieces (4ft each) for ${feet} linear feet of ridge.`;
    },
    faqs: [
      { 
        question: "How can I explain the 'Siphon Effect' benefit of ridge vents to a client?", 
        answer: "Explain that ridge vents use the Bernoulli principle to naturally pull hot air out of the attic. This continuous airflow prevents the 'Heat Trap' that cooks shingles from the inside out, allowing you to justify the premium ridge vent as a lifetime protection upgrade." 
      },
      { 
        question: "Why is balancing intake and exhaust mandatory for manufacturer warranties?", 
        answer: "GAF, Owens Corning, and CertainTeed require balanced ventilation to validate their lifetime warranties. Failing to install a 50/50 intake/exhaust split can lead to your company being liable for premature shingle failure—always include proper soffit venting in your bid." 
      },
      { 
        question: "Should my company charge more for ridge vent on steep-slope roofs?", 
        answer: "Yes; installing 4ft shingle-over ridge vents on 10/12+ pitches is significantly more labor-intensive and requires higher safety precautions. Charge a 20% premium on ridge vent labor to protect your margins on these difficult runs." 
      }
    ]
  },
  {
    slug: 'ice-dam-prevention-checklist',
    title: 'Winterization Maintenance & Ice Dam Mitigation Scope',
    seoDescription: 'Professional checklist for identifying and mitigating ice dam risks through ventilation and insulation technical assessments.',
    type: 'template',
    resultLabel: 'Mitigation Scope Report',
    inputs: [
      { id: 'atticNode', label: 'Attic Status', type: 'select', options: ['Insulated', 'Uninsulated / Drafty'] },
      { id: 'gutterNode', label: 'Gutter Status', type: 'select', options: ['Clean', 'Full of debris'] }
    ],
    compute: (values) => {
      return `ICE DAM MITIGATION PLAN:
- [ ] ATTIC: ${values.atticNode === 'Insulated' ? 'Maintain R-49+ levels' : 'CRITICAL: Add blown-in insulation to stop heat loss'}
- [ ] GUTTERS: ${values.gutterNode === 'Clean' ? 'Verify downspouts clear' : 'CRITICAL: Remove debris to allow drainage'}
- [ ] VENTILATION: Ensure soffit vents aren't blocked by new insulation
- [ ] BARRIER: Verify Ice & Water shield extends 2' past the interior wall line
- [ ] ACTION: Consider heat cables in problematic valleys if icing persists.`;
    },
    faqs: [
      { 
        question: "How can I explain the 'root cause' of ice dams to justify an insulation upsell?", 
        answer: "Frame it as a 'System Failure.' Explain that ice dams are a result of heat loss, not just cold weather. By upselling air-sealing and R-49 insulation, you provide a permanent solution that protects the roof deck and prevents the ice dams your shingles are designed to resist." 
      },
      { 
        question: "What is the IRC code requirement for Ice & Water shield extension?", 
        answer: "To meet International Residential Code (IRC), the self-adhered membrane must extend at least 2 feet past the interior 'warm' wall line. Adhering to this standard protects your business from liability during building inspections and ensures the assembly is legally waterproof." 
      },
      { 
        question: "Should my company offer heat cable installation as a primary service?", 
        answer: "Heat cables should be a secondary 'add-on' for problematic valleys only. Position them as a 'fail-safe' rather than a primary solution, as they do not address the ventilation and insulation issues that cause structural damage over time." 
      }
    ]
  },
  {
    slug: 'metal-roof-screw-calculator',
    title: 'Fastener Schedule & Wind-Uplift Estimator',
    seoDescription: 'Calculate mandatory fastener patterns and component counts for exposed-fastener metal roofing systems.',
    type: 'calculator',
    resultLabel: 'Fastener System Schedule',
    inputs: [
      { id: 'squares', label: 'Total Squares', type: 'number', placeholder: '15' },
      { id: 'spacing', label: 'Screw Spacing (Inches)', type: 'number', placeholder: '24' }
    ],
    compute: (values) => {
      const squares = Number(values.squares) || 0;
      // Rough rule: 80-100 screws per square for standard 3ft panels
      const count = squares * 90; 
      const bagsOf250 = Math.ceil(count / 250);
      return `${count.toLocaleString()} Screws (~${bagsOf250} bags of 250)`;
    },
    faqs: [
      { 
        question: "How can I set a mandatory fastener pattern to protect against wind uplift?", 
        answer: "Standard practice is screws every 24 inches on center, with a 'double-screw' pattern at the eaves and ridges. Providing this technical specification in your contract demonstrates superior structural attention compared to 'fly-by-night' crews." 
      },
      { 
        question: "What is the profit potential of 'Re-Screwing' aged metal roofs?", 
        answer: "Re-screwing is a high-margin maintenance service ($2.50–$4.00 per linear foot of ridge/eave). As neoprene washers degrade after 15 years, offering a full fastener replacement can double the roof's life and generate lucrative 'fill-in' jobs for your crews." 
      },
      { 
        question: "Why should I only use EPDM-washer screws for metal roofing?", 
        answer: "Standard neoprene washers dry out and crack in 10 years, creating 'pinhole' leaks. Specifying high-grade EPDM washers allows you to offer a 20-year workmanship warranty on the seal, setting your company apart as a premium specialty contractor." 
      }
    ]
  },
  {
    slug: 'roof-coating-estimate-tool',
    title: 'Silicone/Cool-Roof Coating & Profit Margin Estimator',
    seoDescription: 'Commercial tool for estimating liquid-applied silicone or acrylic roof coating systems and project profitability.',
    type: 'calculator',
    resultLabel: 'Coating System Estimate',
    inputs: [
      { id: 'sqft', label: 'Total Square Footage', type: 'number', placeholder: '5000' },
      { id: 'material', label: 'Coating Type', type: 'select', options: ['High-Solid Silicone', 'Acrylic', 'Urethane'] }
    ],
    compute: (values) => {
      const sqft = Number(values.sqft) || 0;
      let coverage = 50; // sqft per gallon per coat
      if (values.material === 'Acrylic') coverage = 100;
      
      const gallonsNeeded = Math.ceil((sqft / coverage) * 2); // 2 coats
      return `${gallonsNeeded} Gallons (for 2-coat application)`;
    },
    faqs: [
      { 
        question: "How can I identify saturated insulation before estimating a roof coating?", 
        answer: "Infrared thermal imaging is essential. Coating over saturated insulation is a recipe for project failure and lawsuits. Proving the sub-roof is dry allows you to offer a manufacturer-backed warranty on the silicone system." 
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
  }
];
