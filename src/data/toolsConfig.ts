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
  inputs: ToolInput[];
  compute: (values: Record<string, any>) => string | number;
  resultLabel: string;
  iconName?: string;
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
    }
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
    }
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
    }
  }
];
