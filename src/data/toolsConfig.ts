export type ToolType = 'calculator' | 'text-generator' | 'template';

export interface ToolInput {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select';
  placeholder?: string;
  description?: string;
  options?: string[];
}

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
    }
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
    }
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
    }
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
    }
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
    }
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

If you know anyone else who might need a hand with their exterior, we have a "Refer-a-Neighbor" program where we'll send you a $${values.bonus || '100'} gift card for every lead that turns into a roof. 

Would you mind if I checked in with you in a week to see if any of your friends were asking about the new look?`;
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
];




