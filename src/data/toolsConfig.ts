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
    title: 'Shingle Waste Calculator',
    seoDescription: 'Accurately calculate how many extra squares of shingles you need based on roof complexity and valley types.',
    type: 'calculator',
    resultLabel: 'Recommended Waste Percentage',
    inputs: [
      { id: 'squares', label: 'Total Roof Squares', type: 'number', placeholder: 'e.g. 30', description: 'Enter the total area of the roof in squares (100 sq. ft. each)' },
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
        question: "What is the standard waste percentage for a simple gable roof?", 
        answer: "A typical waste factor for a simple gable roof takes between 10% and 12%. This accounts for the standard overlaps and the relatively small amount of cutting required at the edges and ridges." 
      },
      { 
        question: "How much waste should I add for complex roofs with valleys and dormers?", 
        answer: "For complex roofs, including hip designs or those with multiple dormers and valleys, you should increase your waste factor to 15%–20%. The diagonal cuts required in valleys significantly increase material loss compared to straight eave cuts." 
      },
      { 
        question: "Does the roof pitch affect how much shingle waste I should order?", 
        answer: "Yes, steep-slope roofs (8/12 pitch or higher) usually require an additional 2%–3% in waste. This compensates for the difficulty of handling materials on a vertical surface and the increased likelihood of shingle damage during installation." 
      }
    ]
  },
  {
    slug: 'storm-door-knocking-script',
    title: 'Post-Storm Door Knocking Script',
    seoDescription: 'The highest-converting script for roofing sales reps walking neighborhoods after a major hailstorm.',
    type: 'text-generator',
    resultLabel: 'Your Custom Pitch Script',
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
        question: "What are the best hours for door knocking on roofing prospective leads?", 
        answer: "The most effective times are typically 'The Golden Hour' between 4:00 PM and 7:30 PM on weekdays, or Saturdays from 10:00 AM to 4:00 PM. This is when homeowners are most likely to be home and available to discuss their property's health after a storm." 
      },
      { 
        question: "How do I start a conversation using a door-knocking script effectively?", 
        answer: "Use the 'SLAP' formula: Start with a friendly greeting, Let them know why you're there (mention a neighbor's roof or recent storm activity), Ask an open-ended question about their roof, and Present a low-risk offer like a free inspection." 
      },
      { 
        question: "What should I do if a homeowner says no to a full roof inspection?", 
        answer: "Focus on providing immediate, low-stakes value. Offer a quick 'structural health check' of their gutters or downspouts to look for hail clues, which can often lead to a deeper conversation about the roof without feeling pushy." 
      }
    ]
  },
  {
    slug: 'email-follow-up-template',
    title: 'Simple Email Follow-Up Template',
    seoDescription: 'Stop losing leads for "not getting back fast enough." Use this professional template to stay top-of-mind.',
    type: 'template',
    resultLabel: 'Final Email Content',
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
        question: "How many days should I wait before sending a follow-up email after an estimate?", 
        answer: "A good rule of thumb is to send your first follow-up email 2–3 days after providing the estimate. This keeps your company top-of-mind while they are still in the decision-making phase without being overwhelming." 
      },
      { 
        question: "What is the most effective subject line for a roofing estimate follow-up?", 
        answer: "The highest-performing subject lines are personal and direct, such as 'Quick question about your roofing project' or 'Checking in on your roofing estimate.' Avoid sales-heavy language that might trigger spam filters or homeowner 'blindness'." 
      },
      { 
        question: "How many times should I follow up on a roofing lead before stopping?", 
        answer: "Most successful contractors follow up 3–5 times over the course of two weeks. If you haven't received a response after the 10-day mark, send a 'Gentle Nudge' email asking if they've made other arrangements." 
      }
    ]
  },
  {
    slug: 'metal-roofing-cost-calculator',
    title: 'Metal Roofing Cost Calculator',
    seoDescription: 'Estimation tool for metal roofing projects including material gauge and trim waste.',
    type: 'calculator',
    resultLabel: 'Estimated Project Cost',
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
        question: "How much does metal roofing cost per square in 2026?", 
        answer: "As of 2026, metal roofing typically costs between $700 and $2,900 per square (100 sq. ft.) installed. The wide range is due to the difference between affordable corrugated panels and premium standing seam or copper options." 
      },
      { 
        question: "Which metal roofing material provides the best value for the money?", 
        answer: "Galvanized steel and aluminum are the best value options, typically costing $400–$1,400 per square for materials. Aluminum is particularly favored in coastal areas because it doesn't rust, significantly increasing its lifespan and ROI." 
      },
      { 
        question: "Does the design of a metal roof increase the labor cost significantly?", 
        answer: "Yes, complex designs with many hips, valleys, or dormers can increase labor costs by 15%–25%. Specialized trim and flashing requirements for these features require much more precision work than a standard asphalt install." 
      }
    ]
  },
  {
    slug: 'shingle-bundle-calculator',
    title: 'Roof Shingle Bundle Calculator',
    seoDescription: 'Convert roof squares into exact bundle counts for asphalt shingles.',
    type: 'calculator',
    resultLabel: 'Required Bundles',
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
        question: "How many shingle bundles do I need to cover one roofing square?", 
        answer: "It takes exactly 3 standard bundles of asphalt shingles to cover one roofing square (100 square feet). Each bundle typically covers 33.3 square feet, so ordering by the '3-bundle rule' ensures you match your measured area perfectly." 
      },
      { 
        question: "How many shingles are in a standard bundle for 3-tab vs. architectural shingles?", 
        answer: "A bundle of 3-tab shingles typically contains 26–29 pieces, while architectural (dimensional) shingles usually have 20–24 pieces. This is because architectural shingles are thicker and heavier per piece, covering more area with fewer physical units." 
      },
      { 
        question: "How many bundles should I order for a 20 square roof including waste?", 
        answer: "For a 20 square roof, you should order 66 bundles if using a 10% waste factor (20 squares + 2 waste squares = 22 squares total). This gives you 60 bundles for the main field and 6 extra for starter courses, ridges, and cuts." 
      }
    ]
  },
  {
    slug: 'roof-pitch-multiplier-calculator',
    title: 'Roof Pitch Multiplier Calculator',
    seoDescription: 'Calculate the precise area multiplier based on your roof pitch for accurate estimating.',
    type: 'calculator',
    resultLabel: 'Pitch Multiplier',
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
        question: "How is a roof pitch multiplier calculated using the Pythagorean theorem?", 
        answer: "The multiplier is found by calculating the hypotenuse of a right angle where the 'run' (base) is 12 and the 'rise' (height) is your roof's pitch. Dividing this rafter length by the 12-inch run gives you a precise decimal multiplier used to find true surface area from a flat footprint." 
      },
      { 
        question: "Why do I need to use a pitch multiplier for roofing estimates?", 
        answer: "A flat blueprint only shows the 'projected' area of a house, but sloped roofs have more surface area than their footprint. Multiplying the footprint square footage by the pitch multiplier ensures you order enough shingles to cover the actual incline of the rafters." 
      },
      { 
        question: "What is the pitch multiplier for common slopes like 4/12 or 8/12?", 
        answer: "For a standard 4/12 pitch, the multiplier is approximately 1.054, while a steeper 8/12 pitch requires a 1.2019 multiplier. These decimals represent the percentage increase in material needed compared to a flat roof of the same dimensions." 
      }
    ]
  },
  {
    slug: 'commercial-tpo-estimator',
    title: 'Commercial TPO Roofing Estimator',
    seoDescription: 'Low-slope commercial roofing cost calculator for TPO and EPDM systems.',
    type: 'calculator',
    resultLabel: 'Total Commercial Estimate',
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
        question: "What is the average cost per square foot for TPO roofing in 2026?", 
        answer: "As of 2026, TPO roofing typically costs between $5.00 and $12.00 per square foot installed. This range accounts for membrane thickness (45, 60, or 80 mil) and whether the system is mechanically fastened or fully adhered." 
      },
      { 
        question: "Does adding rigid insulation increase the cost of a TPO roof significantly?", 
        answer: "Yes, adding Polyiso insulation can increase your budget by $1.50 to $4.50 per square foot depending on the R-value required. Tapered insulation systems, designed to create slope for drainage on flat decks, are at the higher end of this price spectrum." 
      },
      { 
        question: "Why is a commercial TPO inspection more expensive than a residential one?", 
        answer: "Commercial roofs often require specialized thermal imaging or electronic leak detection to find water trapped beneath the membrane. These diagnostic tools, combined with the safety requirements for large-scale buildings, drive up professional assessment costs." 
      }
    ]
  },
  {
    slug: 'pro-roofing-proposal-generator',
    title: 'Roofing Proposal Text Generator',
    seoDescription: 'Create a professional, high-converting roofing proposal summary in seconds.',
    type: 'template',
    resultLabel: 'Proposal Summary',
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
        question: "What are the most important elements to include in a roofing proposal?", 
        answer: "A high-converting proposal must include a detailed scope of work, specific material brands (e.g., GAF or Owens Corning), and a transparent breakdown of labor and disposal costs. Clear warranty terms and a firm project timeline are also essential." 
      },
      { 
        question: "Should a roofing proposal include a workmanship warranty?", 
        answer: "Absolutely; most professional roofing proposals offer a workmanship warranty ranging from 5 to 25 years. This protects the homeowner against installation errors and is often the deciding factor when comparing multiple contractor bids." 
      },
      { 
        question: "How does a detailed scope of work help prevent project disputes?", 
        answer: "By itemizing every task—from the multi-layer tear-off to the installation of ice and water shields—you set clear expectations. This prevents 'hidden' costs later on and ensures the homeowner understands exactly what they are paying for." 
      }
    ]
  },
  {
    slug: 'gutter-length-calculator',
    title: 'Gutter & Downspout Calculator',
    seoDescription: 'Estimate linear footage for gutters and necessary downspouts based on roof perimeter.',
    type: 'calculator',
    resultLabel: 'Gutter System Breakdown',
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
        question: "How many downspouts are required per linear foot of gutter?", 
        answer: "Industry standards generally require one downspout for every 30 to 40 linear feet of guttering to prevent overflow during heavy rain. If your roof has a large surface area or a steep pitch, you should decrease this spacing to every 20-25 feet for better drainage." 
      },
      { 
        question: "What is the best location to place downspouts on a residential home?", 
        answer: "Downspouts should be placed at the corners of the house wherever possible, ideally away from high-traffic walkways. Ensuring they discharge at least 5 to 10 feet away from the foundation is critical to preventing basement flooding." 
      },
      { 
        question: "Does the size of my gutter (5-inch vs 6-inch) change the downspout requirement?", 
        answer: "Yes, 6-inch gutters can handle nearly 50% more water volume, which may allow for slightly wider downspout spacing. However, the bottleneck is usually the downspout itself, so using 3x4 inch downspouts is recommended for larger gutter systems." 
      }
    ]
  },
  {
    slug: 'roof-ventilation-calculator',
    title: 'Attic Ventilation Calculator',
    seoDescription: 'Ensure your roof stays cool. Calculate the Net Free Area (NFA) needed for your attic.',
    type: 'calculator',
    resultLabel: 'Required NFA (sq. inches)',
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
        question: "What is the difference between the 1:150 and 1:300 ventilation rules?", 
        answer: "The 1:150 rule requires 1 sq. ft. of ventilation for every 150 sq. ft. of attic floor, used for older homes without vapor barriers. Modern homes with balanced intake and exhaust systems often qualify for the 1:300 rule, which is the current efficiency standard." 
      },
      { 
        question: "How do I calculate Net Free Area (NFA) for attic vents?", 
        answer: "NFA is calculated by dividing your total attic square footage by your target ratio (e.g., 300) and then multiplying by 144 to get square inches. This number tells you the total amount of 'empty space' needed in your vents to allow proper airflow." 
      },
      { 
        question: "Why must attic ventilation be balanced between intake and exhaust?", 
        answer: "Unbalanced ventilation can create a 'vacuum' effect that pulls conditioned air from your living space into the attic. A 50/50 split between soffit intake and ridge exhaust ensures a continuous flow of air that keeps the roof deck cool and dry." 
      }
    ]
  },
  {
    slug: 'roof-referral-request-generator',
    title: 'Customer Referral Script Generator',
    seoDescription: 'The best script for asking happy roofing customers for referrals and reviews.',
    type: 'text-generator',
    resultLabel: 'Referral Script',
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
        question: "What are the best incentives for a roofing referral program?", 
        answer: "The most effective incentives are direct cash bonuses or gift cards ranging from $50 to $250. 'Two-sided' incentives, where you reward both the referrer and the new customer with a discount, often see the highest conversion rates." 
      },
      { 
        question: "How should a roofing contractor ask a happy customer for a referral?", 
        answer: "The best approach is to wait until the final walkthrough or sign-off when the customer is most satisfied. Use a helpful script that highlights your 'Refer-a-Neighbor' program and mentions that most of your business comes from local word-of-mouth." 
      },
      { 
        question: "When is the most effective time to launch a referral request?", 
        answer: "While the initial request should happen at the job's completion, a follow-up 3-6 months later is also highly effective. This reminds the homeowner about the program just as their neighbors might start noticing the roof's durability." 
      }
    ]
  },
  {
    slug: 'insurance-denial-appeal-script',
    title: 'Insurance Claim Appeal Script',
    seoDescription: 'Generate a professional letter to appeal a denied roofing insurance claim.',
    type: 'text-generator',
    resultLabel: 'Appeal Letter Content',
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
        question: "What are the common reasons for appealing a denied roof insurance claim?", 
        answer: "Appeals are often triggered by adjusters misidentifying storm damage as 'age-related wear' or failing to document functional damage. Providing independent documentation from a licensed contractor with high-resolution photos of hail impacts is key to winning an appeal." 
      },
      { 
        question: "Can a claim be appealed if it was denied for being 'cosmetic' damage?", 
        answer: "Yes, if you can prove the 'cosmetic' damage compromises the long-term waterproofing or structural integrity of the roof, the denial can be overturned. This usually requires a technical report explaining how the impact damaged the mat." 
      },
      { 
        question: "What evidence is needed to successfully appeal a roofing claim denial?", 
        answer: "You should provide dated photos, local weather data confirming the storm event, and a professional contractor's estimate. Demonstrating 'recent and functional' damage rather than 'gradual and cosmetic' is the most powerful argument." 
      }
    ]
  },
  {
    slug: 'roofing-lead-reactivation-script',
    title: 'Aged Lead Reactivation Script',
    seoDescription: 'Waking up cold leads with a compelling follow-up that gets them back on the phone.',
    type: 'text-generator',
    resultLabel: 'Reactivation Message',
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
        question: "What is the best way to contact a cold roofing lead from six months ago?", 
        answer: "The most effective method is a 'soft' follow-up that leads with a value-driven reason, such as upcoming material price increases or a seasonal maintenance check. This reactivates the conversation without being pushy." 
      },
      { 
        question: "Why do most roofing leads go cold after the initial estimate?", 
        answer: "Most leads stagnate due to decision fatigue or sticker shock from the high cost of replacement. Reaching out with financing options or a smaller repair-based 'entry offer' can often lower the barrier to entry and get them on the phone." 
      },
      { 
        question: "How often should I run a database reactivation campaign for roofing?", 
        answer: "Running a reactivation campaign every 3 to 6 months is an industry best practice. This timing aligns with seasonal transitions and ensures you stay top-of-mind before the lead decides to call a different contractor." 
      }
    ]
  },
  {
    slug: 'vinyl-siding-cost-calculator',
    title: 'Vinyl Siding Cost Calculator',
    seoDescription: 'Accurately estimate the cost of vinyl siding installation for your home based on square footage and siding quality.',
    type: 'calculator',
    resultLabel: 'Estimated Siding Cost',
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
        question: "How much does vinyl siding cost per square foot installed in 2026?", 
        answer: "In 2026, professional installation for vinyl siding typically ranges from $4.00 to $12.00 per square foot. This includes the cost of materials ($3-$7) and labor ($2.50-$5.00), depending on the siding's thickness and local rates." 
      },
      { 
        question: "What is the price difference between standard and insulated vinyl siding?", 
        answer: "Insulated vinyl siding generally costs 30% to 50% more than standard panels, averaging $8.00 to $12.00 per square foot installed. However, the higher upfront cost is often offset by improved R-value and a more premium appearance." 
      },
      { 
        question: "Does horizontal vs vertical siding affect the total installation cost?", 
        answer: "Yes, vertical siding (like board and batten) is often 10% to 20% more expensive due to additional furring strips and specialized trimming required. It is also more labor-intensive to install properly to ensure a waterproof finish." 
      }
    ]
  },
  {
    slug: 'cedar-shake-roof-calculator',
    title: 'Cedar Shake Roof Estimator',
    seoDescription: 'Determine how many bundles of cedar shakes are required for a roof replacement.',
    type: 'calculator',
    resultLabel: 'Material Estimate',
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
        question: "How many bundles of cedar shakes are in a roofing square?", 
        answer: "The number of bundles per square depends on your chosen exposure. For a standard 5-inch exposure, you'll need 5 bundles per square, whereas a 7.5-inch exposure reduces the requirement to 4 bundles per square (100 sq. ft)." 
      },
      { 
        question: "What is the difference between No. 1 and No. 2 grade cedar shakes?", 
        answer: "No. 1 Blue Label shakes are 100% edge-grain and clear of knots, offering the highest durability. No. 2 Red Label shakes contain some flat grain and limited knots, making them a more budget-friendly option for secondary structures." 
      },
      { 
        question: "How does the 'exposure' of a cedar shake affect the roof's lifespan?", 
        answer: "Lower exposure (5 inches) increases the 'triple-coverage' area, providing better protection against moisture. While a higher exposure (7.5 inches) uses less material, it may slightly reduce the absolute lifespan in high-moisture climates." 
      }
    ]
  },
  {
    slug: 'roof-cleaning-cost-estimator',
    title: 'Roof Cleaning Cost Estimator',
    seoDescription: 'Calculate the cost of soft-washing or pressure cleaning a roof based on debris levels.',
    type: 'calculator',
    resultLabel: 'Estimated Service Cost',
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
        question: "What is the difference between soft washing and pressure washing for roofs?", 
        answer: "Soft washing uses low-pressure water and specialized detergents to kill algae and moss at the root without damaging shingles. Traditional pressure washing uses high-force water that can strip away protective granules and force moisture under the roof deck, leading to premature leaks." 
      },
      { 
        question: "How much does a professional roof cleaning cost in 2026?", 
        answer: "Residential roof cleaning typically ranges from $0.30 to $0.75 per square foot, depending on the moss levels and the cleaning method used. Steep roofs that require harness safety systems or specialized chemical treatments for heavy lichen may be at the higher end of the pricing spectrum." 
      },
      { 
        question: "Will soft washing damage my plants or landscaping?", 
        answer: "Professional roofing crews use biodegradable detergents and pre-rinse all vegetation to ensure your plants are protected. As long as the manufacturer's dilution ratios are followed and the property is thoroughly rinsed, soft washing is safe for most standard landscaping." 
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
        question: "How much does it cost to replace a skylight during a roof replacement?", 
        answer: "Replacing an existing skylight while the roof is already torn off typically costs between $900 and $1,800. This is significantly cheaper than a standalone installation because the labor for flashing and shingle integration is already being performed as part of the total roof project." 
      },
      { 
        question: "Is solar-powered venting worth the additional cost for a skylight?", 
        answer: "Solar-powered skylights often qualify for a 26-30% federal tax credit on the total cost of the unit and installation labor, making them comparable in price to manual venting units. They also feature rain sensors that automatically close the vent at the first sign of moisture." 
      },
      { 
        question: "Can I install a skylight on a flat or low-slope roof?", 
        answer: "Yes, specialized 'curb-mounted' skylights are designed specifically for flat or low-slope TPO and EPDM roofs. These require a built-up wooden curb to ensure water flows around the unit rather than pooling against the flashing, preventing long-term leaks." 
      }
    ]
  },
  {
    slug: 'solar-roof-capacity-calculator',
    title: 'Solar Panel Capacity Calculator',
    seoDescription: 'Find out how many solar panels can fit on your roof and the total kW output.',
    type: 'calculator',
    resultLabel: 'Estimated Power Capacity',
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
        question: "How do I calculate how many solar panels will fit on my roof?", 
        answer: "A reliable estimate is to multiply your usable south-facing roof area by 0.75 to account for fire code setbacks and vents. Dividing this adjusted square footage by 18 (the average size of a 400W panel) tells you the maximum number of panels your roof can support." 
      },
      { 
        question: "What is the standard fire department setback for roof-mounted solar?", 
        answer: "Most local building codes require a 3-foot 'pathway' along the ridges and eaves to allow firefighters safe access. This setback reduces the usable area for panels but is essential for safety and ensuring your solar installation passes final building inspections." 
      },
      { 
        question: "How many kW of solar power does the average home roof produce?", 
        answer: "A typical residential installation produces between 5kW and 12kW of peak power, depending on the number of south-facing roof faces available. Modern 400W panels allow homeowners to generate significantly more power in less square footage." 
      }
    ]
  },
  {
    slug: 'labor-cost-with-overtime-calculator',
    title: 'Roofing Labor Overtime Calculator',
    seoDescription: 'Business tool for roofing contractors to calculate crew labor costs with overtime.',
    type: 'calculator',
    resultLabel: 'Total Labor Expense',
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
        question: "What are the federal laws for paying overtime to roofing crews?", 
        answer: "Under the FLSA, all non-exempt workers must be paid time-and-a-half for every hour worked over 40 in a single workweek. This applies even if you pay your crew on a 'piece-rate' or 'per square' basis, which is a common point of legal liability for roofing contractors." 
      },
      { 
        question: "Do 'per square' payments exempt a contractor from overtime requirements?", 
        answer: "No, piece-rate workers are still entitled to overtime pay based on their 'regular rate of pay' for that week. Failing to calculate and pay this additional half-time for hours over 40 can lead to back-wage penalties and Department of Labor audits." 
      },
      { 
        question: "How does 1099 vs W-2 status affect roofing labor costs?", 
        answer: "Legitimately classified W-2 employees require you to pay for workers' comp, social security, and overtime, which adds 20-30% to your raw labor cost. 1099 subcontractors are responsible for their own taxes and insurance, but they must meet strict 'independent contractor' criteria." 
      }
    ]
  },
  {
    slug: 'tile-roof-repair-estimator',
    title: 'Broken Tile Repair Estimator',
    seoDescription: 'Estimate the cost of replacing individual broken tiles on a concrete or clay roof.',
    type: 'calculator',
    resultLabel: 'Repair Estimate',
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
        question: "What is the average cost to replace a single broken roof tile?", 
        answer: "Replacing a few tiles typically involves a base 'trip charge' of $250 to $450 plus $20 to $40 per tile. The price is higher than standard shingles because the repair requires carefully sliding out adjacent tiles and ensuring the underlying 'head-lap' remains waterproof." 
      },
      { 
        question: "Why are clay S-tiles more expensive to repair than concrete tiles?", 
        answer: "Clay tiles are more fragile and often require specialized sourcing to match the color and profile of older installations. The labor is also more intensive because contractors must be extremely careful not to break additional tiles while walking on the roof surface." 
      },
      { 
        question: "Can I glue a broken roof tile back together instead of replacing it?", 
        answer: "Using tile adhesive is acceptable for minor corner chips, but a clean break through the center of the tile requires a full replacement. Glued tiles eventually fail due to thermal expansion and contraction, allowing UV damage to penetrate the underlayment." 
      }
    ]
  },
  {
    slug: 'snow-guard-layout-calculator',
    title: 'Snow Guard Layout Calculator',
    seoDescription: 'Calculate how many snow guards you need for a metal or slate roof based on pitch.',
    type: 'calculator',
    resultLabel: 'Required Snow Guards',
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
        question: "How many rows of snow guards are needed for a metal roof?", 
        answer: "Most residential metal roofs require at least two staggered rows of snow guards along the eaves. For roofs with a pitch steeper than 8/12 or rafters longer than 20 feet, a third supplemental row is recommended to prevent large 'snow-slides' that can damage gutters." 
      },
      { 
        question: "What is the standard spacing for snow guards on a standing seam roof?", 
        answer: "Snow guards are typically spaced every 9 to 12 inches to effectively break up the snow-pack. On modern standing seam roofs, specialized clamps are used that attach directly to the metal ribs without penetrating the surface, maintaining the roof's waterproofing integrity." 
      },
      { 
        question: "Does every house in a cold climate need snow guards?", 
        answer: "Snow guards are Specifically critical for 'slick' surfaces like metal, slate, and synthetic shakes. They prevent the entire roof's snow load from sliding off at once, which is an 'avalanche' hazard that can rip gutters off the house or injure people on the ground." 
      }
    ]
  },
  {
    slug: 'fascia-soffit-cost-generator',
    title: 'Fascia & Soffit Replacement Estimator',
    seoDescription: 'Estimate the cost for replacing damaged wood fascia or aluminum soffit covers.',
    type: 'calculator',
    resultLabel: 'Fascia/Soffit Total',
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
        question: "What is the linear foot cost for fascia replacement in 2026?", 
        answer: "Standard aluminum-wrapped fascia replacement typically costs $12 to $18 per linear foot, while premium thick-milled PVC (like Azek) can range from $22 to $30. These prices usually include removal of old rotted wood and installation of custom-bent metal trim." 
      },
      { 
        question: "Is it better to use wood or PVC for my roof fascia boards?", 
        answer: "While primed wood is cheaper upfront, PVC fascia is highly recommended because it is completely impervious to rot and insects. Over a 20-year lifespan, PVC often pays for itself by eliminating the need for regular painting and structural repairs." 
      },
      { 
        question: "What happens if I ignore rotted fascia or soffit boards?", 
        answer: "Damaged fascia allows water to seep behind your gutters and into your roof's starter course, leading to rotted rafter tails. Similarly, blocked or falling soffit boards prevent attic ventilation, which can cause mold growth and ice dams during winter." 
      }
    ]
  },
  {
    slug: 'subcontractor-agreement-generator',
    title: 'Roofing Subcontractor Agreement',
    seoDescription: 'Generate a standard scope of work and payment terms agreement for roofing subcontractors.',
    type: 'template',
    resultLabel: 'Agreement Document',
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
        question: "What should be included in a professional roofing subcontractor agreement?", 
        answer: "A valid agreement must clearly define the scope of work (e.g., tear-off, cleanup, specific material usage) and detailed payment terms. It is also critical to include insurance requirements for General Liability and Workers' Comp to protect your company." 
      },
      { 
        question: "How does a 'per-square' pay rate work for roofing subcontractors?", 
        answer: "Subcontractors are usually paid based on the number of 'squares' (100 sq. ft.) of shingles they actually install. Most contractors pay a base rate for the field shingles plus 'add-ons' for steep pitches, multiple layers, or specialized flashing work." 
      },
      { 
        question: "Why is an 'independent contractor' status important for roofing crews?", 
        answer: "Calling a crew a subcontractor rather than an employee avoids payroll taxes and insurance overhead, but the crew must meet strict 'independent contractor' criteria. Misclassifying employees as subcontractors can lead to massive IRS penalties." 
      }
    ]
  },
  {
    slug: 'chimney-flashing-cost-estimator',
    title: 'Chimney Flashing Estimator',
    seoDescription: 'Calculate the cost to repair or replace specialized chimney flashing using copper or galvanized steel.',
    type: 'calculator',
    resultLabel: 'Flashing Total',
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
        question: "What is the best material for chimney flashing: steel, aluminum, or copper?", 
        answer: "Copper is the gold standard for chimney flashing because it can last over 50 years and develops a beautiful patina. Galvanized steel is more budget-friendly but can rust at joints, while aluminum is a lightweight, rust-proof option common in mid-range projects." 
      },
      { 
        question: "Does a chimney leak always mean the flashing needs to be replaced?", 
        answer: "Not necessarily; a leak could also be caused by cracked mortar on top of the chimney. However, if the leak appears in the attic at the base of the chimney, it is almost always a failure in the 'step flashing' or 'counter-flashing' where the roof meets the masonry." 
      },
      { 
        question: "What is the average cost for a chimney flashing repair in 2026?", 
        answer: "A professional chimney flashing job typically costs between $650 and $1,200 depending on the size of the chimney. Large custom chimneys with multiple corners require more detailed soldering and hand-bent metal, which pushes the price higher." 
      }
    ]
  },
  {
    slug: 'slate-roof-weight-calculator',
    title: 'Slate Roof Weight Calculator',
    seoDescription: 'Determine the total structural load of a slate roof to ensure the building can handle the weight.',
    type: 'calculator',
    resultLabel: 'Total Load (Tons)',
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
        question: "How much does a slate roof weigh per square foot?", 
        answer: "Standard 1/4-inch slate weighs approximately 8 to 10 pounds per square foot (800-1,000 lbs per square). Thicker architectural slates (1/2-inch or 3/4-inch) can weigh up to 25 pounds per square foot, which is five times heavier than asphalt shingles." 
      },
      { 
        question: "Does my house need structural reinforcement before installing slate?", 
        answer: "Yes, unless your home was originally built for slate, you must have a structural engineer evaluate your rafters. Most modern homes are only engineered for 'lightweight' materials and will require additional trusses orサポート beams to safely hold slate." 
      },
      { 
        question: "What are the common structural requirements for a slate roof?", 
        answer: "Slate requires heavy-duty 3/4-inch CDX plywood or solid wood-plank decking to support the weight. You should also ensure your rafters are spaced no more than 16 inches on center and are properly braced to prevent 'settling' or sagging over time." 
      }
    ]
  },
  {
    slug: 'roof-deck-replacement-calculator',
    title: 'Roof Deck (Sheathing) Calculator',
    seoDescription: 'Estimate the cost and material count for replacing rotted roof decking with OSB or Plywood.',
    type: 'calculator',
    resultLabel: 'Sheathing Estimate',
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
        question: "Is OSB or Plywood better for roof sheathing in 2026?", 
        answer: "While OSB is 15-30% cheaper and standard for most residential builds, plywood is superior for moisture resistance. In high-humidity climates, plywood's ability to dry out quickly without 'swelling' at the edges makes it the preferred choice for long-term structural integrity." 
      },
      { 
        question: "How much does it cost to replace a sheet of roof decking?", 
        answer: "Replacing a single 4x8 sheet typically costs between $70 and $130, which includes the material cost ($15-$40) and install labor ($55-$90). If you are replacing the entire deck during a re-roof, you can often negotiate a lower 'per-sheet' rate." 
      },
      { 
        question: "When does rotted roof decking actually need to be replaced?", 
        answer: "Any section of decking that yields to pressure or shows visible signs of black mold and delamination must be replaced. Ignoring rotted sheathing prevents the new roofing nails from 'biting' correctly, which can cause shingles to blow off during high winds." 
      }
    ]
  },
  {
    slug: 'hoa-roofing-approval-generator',
    title: 'HOA Roofing Approval Request',
    seoDescription: 'Generate a professional request for HOA approval of your new roofing material and color.',
    type: 'template',
    resultLabel: 'HOA Request Content',
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
        question: "Why do HOAs require approval for new roofing materials?", 
        answer: "HOAs enforce architectural standards to maintain neighborhood property values and visual harmony. They typically require a formal application that includes manufacturer spec sheets and specific color samples to ensure your new roof matches the approved community palette." 
      },
      { 
        question: "What should I do if my HOA denies my roof color choice?", 
        answer: "If denied, you should immediately request the 'Approved Color List' from the board. Most denials are based on a lack of technical documentation; resubmitting your request with a professional manufacturer's brochure and a sample shingle usually resolves the issue." 
      },
      { 
        question: "Can an HOA force me to remove a roof installed without approval?", 
        answer: "Yes, HOAs have the legal authority through their CC&Rs to demand removal of non-compliant materials at the homeowner's expense. To avoid this, always wait for a 'Notice to Proceed' letter from the board before your contractor starts the tear-off process." 
      }
    ]
  },
  {
    slug: 'roof-ridge-vent-calculator',
    title: 'Ridge Vent Linear Footage Tool',
    seoDescription: 'Calculate how many pieces of ridge vent you need for your roof peaks.',
    type: 'calculator',
    resultLabel: 'Required Ridge Vents',
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
        question: "How do I calculate the amount of ridge vent my attic needs?", 
        answer: "The standard '1/150 rule' requires 1 square foot of ventilation for every 150 square feet of attic floor space. Since ridge vents are 'shingle-over' pieces, you should measure total length of your peaks and subtract 2 feet from each end to allow for capping." 
      },
      { 
        question: "Is a ridge vent more effective than traditional box vents?", 
        answer: "Ridge vents are generally superior because they provide continuous exhaust at the highest point of the roof, creating a natural 'siphon' effect. When combined with working soffit intake vents, they ensure even cooling across the entire roof deck." 
      },
      { 
        question: "Can I use a ridge vent on a roof with a very steep pitch?", 
        answer: "Most modern shingle-over ridge vents are designed to work on pitches up to 12/12. For 'extreme' pitches, specialized high-profile or metal-specific ridge vents are required to ensure the vent remains weather-tight and provides adequate Net Free Area (NFA)." 
      }
    ]
  },
  {
    slug: 'ice-dam-prevention-checklist',
    title: 'Ice Dam Prevention Checklist',
    seoDescription: 'A systematic checklist to identify and mitigate ice dam risks before winter.',
    type: 'template',
    resultLabel: 'Mitigation Checklist',
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
        question: "Do heating cables actually prevent ice dams?", 
        answer: "Heating cables are a 'symptom' fix; they create channels for water to drain but do not address the root cause. True prevention requires sealing attic air leaks and increasing insulation to an R-49 rating, which keeps the roof surface cold enough." 
      },
      { 
        question: "How far should an Ice & Water shield extend past my interior wall?", 
        answer: "To meet International Residential Code (IRC), the self-adhered waterproof membrane must extend at least 2 feet past the interior 'warm' wall line. This creates a secondary barrier that prevents backing-up water from entering your home." 
      },
      { 
        question: "Why are gutters full of debris a major risk factor for ice dams?", 
        answer: "When gutters are clogged, water cannot drain away from the roofline, causing it to pool and freeze directly at the shingle edge. This 'ice-wall' traps further snow-melt, forcing liquid water up under the shingles where it can leak into your rafters." 
      }
    ]
  },
  {
    slug: 'metal-roof-screw-calculator',
    title: 'Metal Roof Screw Count Calculator',
    seoDescription: 'Calculate exactly how many fasteners you need for an exposed-fastener metal roof.',
    type: 'calculator',
    resultLabel: 'Fastener Count',
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
        question: "What is the standard screw spacing for an exposed-fastener metal roof?", 
        answer: "Common practice is to place screws every 24 inches along the panels, with double-fastening at the eave and ridge for wind uplift protection. Each panel 'low' usually receives a fastener to ensure the neoprene washer creates a tight seal." 
      },
      { 
        question: "How many screws are typically in a 'square' of metal roofing?", 
        answer: "For a standard 3-foot wide AG or R-panel, you can expect to use 80 to 120 screws per square (100 sq. ft.). This count includes the extra fasteners required around trim pieces like rake edges, sidewall flashing, and ridge caps." 
      },
      { 
        question: "Do metal roof screws need to be replaced over time?", 
        answer: "Yes, the neoprene washers on exposed fasteners can dry out and crack after 15-20 years, leading to 'pinhole' leaks. It is an industry best practice to inspect your fasteners every decade and 're-screw' sections where the washers have failed." 
      }
    ]
  },
  {
    slug: 'roof-coating-estimate-tool',
    title: 'Silicone Roof Coating Estimator',
    seoDescription: 'Determine gallons of silicone or acrylic coating needed to waterproof a flat roof.',
    type: 'calculator',
    resultLabel: 'Coating Required',
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
        question: "Is roof coating a viable alternative to a full roof replacement?", 
        answer: "If your flat roof is structurally sound and lacks saturated insulation, a high-solids silicone coating can add 10-15 years of life at roughly 40% of the cost of a replacement. However, if the underlying boards are rotted, coating is a temporary fix." 
      },
      { 
        question: "How many gallons of silicone coating are needed per square?", 
        answer: "Most high-performance silicone systems require 2 to 3 gallons per 'square' (100 sq. ft.) to achieve the necessary 20-30 mil thickness. This is typically applied in two separate 'passes' to ensure complete coverage and to fill in minor cracks." 
      },
      { 
        question: "Does white roof coating actually lower energy bills?", 
        answer: "Yes, 'cool roof' coatings reflect up to 85% of UV radiation, significantly reducing the surface temperature of your flat roof. In summer months, this can lower HVAC cooling costs by 15-25% by preventing the roof from acting as a massive heat sink." 
      }
    ]
  },
  {
    slug: 'stone-coated-steel-calculator',
    title: 'Stone Coated Steel Calculator',
    seoDescription: 'Estimate panels and trim for stone-coated steel (Decra/Tilcor) roofing systems.',
    type: 'calculator',
    resultLabel: 'Panel Estimate',
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
        question: "What are the pros and cons of stone-coated steel roofing?", 
        answer: "The major 'pros' are a 50-year lifespan and the look of traditional tile or wood shakes without the massive weight. The primary 'con' is the initial investment, which is typically 2-3 times higher than asphalt shingles, though cheaper than true clay." 
      },
      { 
        question: "Is a stone-coated steel roof noisy during heavy rain?", 
        answer: "Because stone-coated steel panels are installed over an airspace or 'batten' system, they are significantly quieter than traditional corrugated metal. The textured stone granule surface also breaks up rain-drop impact, making the acoustic profile similar to shingles." 
      },
      { 
        question: "Can I walk on a stone-coated steel roof without denting it?", 
        answer: "Yes, but you must follow specific walking patterns. You should only step in the 'low' areas of the panel where the steel is supported by the decking or battens. Walking on the high 'ridges' or 'barrels' of the profile can cause cosmetic denting." 
      }
    ]
  },
  {
    slug: 'roofing-warranty-claim-generator',
    title: 'Manufacturer Warranty Claim Generator',
    seoDescription: 'Generate a professional letter to initiate a manufacturer warranty claim for defective shingles.',
    type: 'text-generator',
    resultLabel: 'Claim Letter',
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
        question: "What constitutes a valid shingle warranty claim?", 
        answer: "Valid claims usually involve 'manufacturing defects' like premature granule loss, thermal cracking, or delamination occurring before the rated life. Damage caused by wind, hail, or improper installation is generally not covered and handled by insurance." 
      },
      { 
        question: "How do I start a warranty claim with GAF or Owens Corning?", 
        answer: "You must first obtain a 'Warranty Claim Packet' from the manufacturer's website. They will require evidence including clear photos, a sample of the defective material (shingle pull), and proof the roof was installed to their technical manuals." 
      },
      { 
        question: "What does a 'pro-rated' roofing warranty mean?", 
        answer: "A pro-rated warranty means the manufacturer's payout decreases every year your roof is in service. For example, a 50-year shingle might cover 100% replacement for the first 10 years, but only 20% by year 40, requiring the homeowner to cover the balance." 
      }
    ]
  },
  {
    slug: 'roofing-financing-calculator',
    title: 'Roofing Financing Calculator',
    seoDescription: 'Calculate your monthly payments for a new roof based on loan amount, interest rate, and term length.',
    type: 'calculator',
    resultLabel: 'Monthly Payment',
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
        question: "What are the typical interest rates for roofing loans in 2026?", 
        answer: "Homeowners with good credit (700+) can typically secure roofing financing between 6.99% and 9.99%. Special 'zero-interest' promotions are often available through large contractors, but these usually require the balance to be paid in full within 12-24 months." 
      },
      { 
        question: "Is it better to use a HELOC or a personal loan for a new roof?", 
        answer: "A HELOC often offers the lowest interest rates and potential tax advantages, making it ideal for expensive tile or slate projects. A personal home improvement loan is faster to set up and doesn't require putting your home up as collateral." 
      },
      { 
        question: "Can I finance a roof if my insurance claim was denied?", 
        answer: "Yes, most professional roofing companies partner with specialized lenders like Sunlight Financial or GoodLeap. These lenders understand the emergency nature of roof repairs and can often provide approvals in minutes, allowing you to start work immediately." 
      }
    ]
  },
  {
    slug: 'roof-snow-load-calculator',
    title: 'Roof Snow Load Calculator',
    seoDescription: 'Estimate the weight of snow on your roof to determine if it exceeds structural safety limits.',
    type: 'calculator',
    resultLabel: 'Estimated Snow Weight',
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
        question: "What is the weight limit for snow on a standard residential roof?", 
        answer: "Most modern homes are engineered to support a 'live load' of 20 to 40 pounds per square foot (psf). In areas with 20 psf limits, roughly 2 feet of packed snow or 4 inches of solid ice is enough to reach the structural danger zone where rafter bowing occurs." 
      },
      { 
        question: "How do I know if the snow on my roof is too heavy?", 
        answer: "Warning signs include interior doors that suddenly won't close, new cracks in ceiling drywall, or a 'creaking' sound from the attic. If you see visible bowing in your rafters or have over 3 feet of wet snow, contact a professional to safely rake the roof." 
      },
      { 
        question: "Does metal roofing shed snow more safely than shingles?", 
        answer: "Metal roofs with a steep pitch are excellent at shedding snow naturally, but they can create 'avalanche' hazards for anyone on the ground. Shingle roofs hold snow in place longer, providing better insulation but requiring the structure to support the weight longer." 
      }
    ]
  },
  {
    slug: 'shingle-roof-age-estimator',
    title: 'Roof Age & Health Estimator',
    seoDescription: 'Determine the remaining life of your shingle roof based on visible wear and tear indicators.',
    type: 'calculator',
    resultLabel: 'Estimated Remaining Life',
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
        question: "How can I find the official age of my roof if I just bought the house?", 
        answer: "The most reliable way is to check the local building department for past permits, which will list the exact date of the last full re-roof. If no permit is on file, you can often find the age in the home's real estate disclosure or by having a roofer inspect the shingles for a manufacturer date code." 
      },
      { 
        question: "What are the earliest signs that a shingle roof is failing?", 
        answer: "Look for 'granule loss' in your gutters, which indicates the protective coating is wearing off. Other early warnings include 'cupping' (edges turning up) or 'clawing' (centers popping up), both of which indicate the asphalt has dried out and the shingles are becoming brittle." 
      },
      { 
        question: "Is it worth repairing a 20-year-old shingle roof?", 
        answer: "Generally, no. Most architectural shingles have a functional lifespan of 22-25 years. At the 20-year mark, the asphalt becomes too brittle to 'seal' around new repair nails, often leading to a cycle of leaks. Investing in a full replacement is usually more cost-effective." 
      }
    ]
  },
  {
    slug: 'sms-review-request-generator',
    title: 'Review Request SMS Generator',
    seoDescription: 'Generate the perfect text message to send to homeowners to capture 5-star Google and Facebook reviews.',
    type: 'text-generator',
    resultLabel: 'SMS Message Content',
    inputs: [
      { id: 'clientName', label: 'Homeowner Name', type: 'text' },
      { id: 'link', label: 'Review Link', type: 'text', placeholder: 'g.page/your-company/review' }
    ],
    compute: (values) => {
      return `Hi ${values.clientName || 'there'}! This is with QuoteCatch Roofing. It was an absolute pleasure getting your new roof installed today. 

If you have 30 seconds, would you mind sharing your experience with us here? ${values.link || '[LINK]'} 

Reviews from neighbors like you help us tremendously. Thank you!`;
    },
    faqs: [
      { 
        question: "When is the best time to send a review request to a homeowner?", 
        answer: "The 'Golden Window' is within 2 to 4 hours of completing the project and cleaning up the job site. This is when the homeowner is most impressed by the visual transformation and cleanliness of their yard, resulting in a much higher conversion rate for 5-star reviews." 
      },
      { 
        question: "How can I increase the number of reviews my roofing company gets?", 
        answer: "The most effective method is to send a personalized text message with a direct link to your Google Business Profile. Homeowners are significantly more likely to click a link on their smartphone than navigate through an email. Incentivizing your crew for reviews also helps." 
      },
      { 
        question: "Should I respond to negative reviews on Google?", 
        answer: "Yes, always respond professionally. Future customers read your responses to see how you handle conflict. Acknowledge the issue and offer to resolve it offline. A thoughtful response can often mitigate the damage of a one-star rating and build trust with others." 
      }
    ]
  },
  {
    slug: 'roof-drainage-scupper-calculator',
    title: 'Roof Scupper Sizing Tool',
    seoDescription: 'Calculate the required width and height for roof scuppers based on drainage area and local rainfall.',
    type: 'calculator',
    resultLabel: 'Recommended Scupper Size',
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
        question: "What is the minimum legal size for a roof scupper?", 
        answer: "According to the International Building Code (IBC), a scupper must be at least 4 inches in height or width. However, sizing should never be based on minimums alone; it must be calculated using your roof's total drainage area and your local 100-year rainfall intensity rate." 
      },
      { 
        question: "What is the difference between a primary and secondary scupper?", 
        answer: "Primary scuppers are the main drainage path, while secondary (overflow) scuppers are installed 2 inches higher. If water starts pouring out of your secondary scuppers, it is a critical warning sign that your primary drains are clogged and your roof is holding dangerous weight." 
      },
      { 
        question: "Do roof scuppers require maintenance?", 
        answer: "Yes, scuppers are high-risk areas for debris accumulation. They should be cleared at least twice a year. Clogged scuppers cause water to pool against the parapet wall, which is the leading cause of perimeter leaks on flat residential and commercial roofs." 
      }
    ]
  },
  {
    slug: 'attic-fan-savings-calculator',
    title: 'Attic Fan Energy Savings Tool',
    seoDescription: 'Find out how much an solar attic fan can save you on your monthly cooling bills.',
    type: 'calculator',
    resultLabel: 'Estimated Monthly Savings',
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
        question: "Do solar attic fans actually lower my electric bill?", 
        answer: "Solar attic fans can reduce attic temperatures significantly, but their impact on your AC bill depends on your insulation. In older homes with poor insulation (R-19 or less), they are most effective because the attic acts as a massive heat sink for the living space." 
      },
      { 
        question: "Can an attic fan cause my AC to work harder?", 
        answer: "Yes, if your attic isn't properly air-sealed. A powerful fan can create negative pressure, pulling conditioned (cooled) air from your living space into the attic through light fixtures. This forces your AC to run longer to replace the lost cooling." 
      },
      { 
        question: "What is the best alternative to a powered attic fan?", 
        answer: "The industry standard for efficiency is 'Passive Ventilation,' which combines continuous soffit intake vents with a ridge exhaust vent. This creates a natural 'chimney effect' that cools the attic without using electricity or risking negative pressure leaks." 
      }
    ]
  },
  {
    slug: 'hail-damage-probability-tool',
    title: 'Hail Damage Risk Probability',
    seoDescription: 'Determine the likelihood of your roof having functional damage after a hail storm based on stone size.',
    type: 'template',
    resultLabel: 'Damage Risk Level',
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
        question: "How big does hail need to be to damage a roof?", 
        answer: "Most shingles can withstand hail up to 1 inch (quarter-sized) without structural damage. However, 'Golf Ball' sized hail (1.75 inches) is typically the threshold where shingles suffer 'functional damage,' meaning the granules are knocked loose and the mat is fractured." 
      },
      { 
        question: "Can small hail cause a roof to leak?", 
        answer: "Small hail rarely causes immediate leaks but can significantly shorten the life of a roof. Cumulative 'bruising' knocks granules loose, exposing the asphalt to UV rays. This leads to premature aging and cracking, causing leaks years earlier than expected." 
      },
      { 
        question: "Does insurance cover hail damage if there aren't any leaks yet?", 
        answer: "Yes. Most policies cover 'functional damage,' which includes the reduction of the roof's lifespan. You don't need a leak for a valid claim; a certified inspector can identify the 'bruises' and underlying fractures that justify a full replacement under most policies." 
      }
    ]
  },
  {
    slug: 'roofing-permit-fee-estimator',
    title: 'Roofing Permit Fee Estimator',
    seoDescription: 'Estimate local municipality permit fees based on the total contract value of your roofing project.',
    type: 'calculator',
    resultLabel: 'Estimated Permit Cost',
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
        question: "Why do I need a permit for a simple re-roof?", 
        answer: "Permits ensure that your roof is installed to current local building codes, specifically regarding wind uplift and fire ratings. Without a permit, you may face fines, issues with your insurance during a claim, or delays when trying to sell your home." 
      },
      { 
        question: "How much do roofing permits typically cost in 2026?", 
        answer: "Permit fees are usually based on 'Total Contract Value.' Most jurisdictions charge a base fee of $150 to $300, plus an additional $10 to $20 for every $1,000 of project cost. A standard $20,000 roof will typically have a permit fee between $350 and $700." 
      },
      { 
        question: "Should the homeowner or the contractor pull the roofing permit?", 
        answer: "Always require your contractor to pull the permit. This ensures they are licensed and legally responsible for the workmanship. If you pull an 'Owner-Builder' permit, you assume all liability for code violations and worker injuries on your property." 
      }
    ]
  },
  {
    slug: 'cool-roof-roi-calculator',
    title: 'Cool Roof ROI Calculator',
    seoDescription: 'Calculate the return on investment for high-reflectance (Cool Roof) systems compared to standard roofing.',
    type: 'calculator',
    resultLabel: 'Estimated Payback Period',
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
        question: "Is there a federal tax credit for cool roofs in 2026?", 
        answer: "As of early 2026, many primary federal energy tax credits (Section 25C) for residential cool roofs have expired. However, many state-level programs (like California's Title 24) and utility companies still offer rebates that can offset up to 20% of the material cost." 
      },
      { 
        question: "How much does a 'Cool Roof' actually save on cooling costs?", 
        answer: "A high-reflectance roof can reduce the cooling load of a building by 10-15% during peak summer months. For a typical residential property, this translates to roughly $200–$500 in annual savings depending on local electricity rates and HVAC efficiency." 
      },
      { 
        question: "Does a white roof save money in cold climates?", 
        answer: "In northern climates, 'Cool Roofs' can have a 'heating penalty.' While they save money in the summer, they prevent the sun from warming your home in the winter, which can slightly increase heating bills. They are most cost-effective in 'Sun Belt' regions." 
      }
    ]
  },
  {
    slug: 'roofing-safety-gear-cost',
    title: 'OSHA Safety Gear Budget Tool',
    seoDescription: 'Business tool for roofing owners to estimate the cost of providing OSHA-compliant safety gear for a crew.',
    type: 'calculator',
    resultLabel: 'Safety Gear Total',
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
        question: "Does OSHA require fall protection for residential roofing?", 
        answer: "Yes. OSHA regulation 1926.501 requires fall protection for any work performed at 6 feet or more above a lower level. For residential roofing, a harness, lifeline, and permanent anchor are the industry standards for legal and physical safety compliance." 
      },
      { 
        question: "What is the cost of a full OSHA-compliant roofing safety kit?", 
        answer: "A basic, high-quality safety kit—including a full-body harness, 50ft vertical lifeline, shock-absorbing lanyard, and reusable roof anchor—typically costs between $160 and $250 per worker. This is a vital investment to prevent catastrophic injury and massive fines." 
      },
      { 
        question: "Do roof anchors need to be replaced after a fall?", 
        answer: "Yes. Any component of a fall arrest system, including the harness and anchor, that has been subjected to 'impact loading' (a fall) must be immediately removed from service and replaced. They are one-time-use items designed for life-saving structural preservation." 
      }
    ]
  }
];
