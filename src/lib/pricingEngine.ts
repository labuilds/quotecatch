export interface PricingConfig {
  materials: { [key: string]: number };
  modifiers: { pitch: { [key: string]: number } };
  flat_fees: number;
  free_tier_averages: { [key: string]: number };
}

export interface EstimateInputs {
  sqFt?: string;
  address?: string;
  material: string;
  pitch: string;
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  materials: {
    asphalt: 5.50,
    tile: 14.00,
    metal: 9.00
  },
  modifiers: {
    pitch: {
      flat: 1.0,
      low: 1.15,
      standard: 1.25,
      steep: 1.50
    }
  },
  flat_fees: 750,
  free_tier_averages: {
    small: 1500,
    medium: 2500,
    large: 4000
  }
}

export function calculateEstimate(inputs: EstimateInputs, config: PricingConfig): number {
  let size = 0;
  
  // Use free_tier_averages if sqFt input is a range ID, otherwise parse as number
  if (inputs.sqFt) {
    if (config.free_tier_averages[inputs.sqFt]) {
      size = config.free_tier_averages[inputs.sqFt];
    } else {
      size = parseInt(inputs.sqFt) || 2000;
    }
  } else {
    size = 2000;
  }

  // Fallbacks to 0 or 1 respectively so calculation doesn't throw NaN if inputs are empty
  const materialPrice = config.materials[inputs.material] || 0;
  const pitchMultiplier = config.modifiers.pitch[inputs.pitch] || 1;

  const total = ((size * materialPrice) * pitchMultiplier) + config.flat_fees;
  return total;
}
