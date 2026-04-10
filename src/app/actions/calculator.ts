"use server"

import { createClient } from '@/utils/supabase/server'
import { PricingConfig } from '@/lib/pricingEngine'
import { revalidatePath } from 'next/cache'
import { GoogleGenAI } from '@google/genai'

export async function generateConfigFromPrompt(prompt: string): Promise<PricingConfig> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

  const systemPrompt = `You are an AI pricing engine for a roofing contractor software platform called QuoteCatch.
A contractor will describe their pricing in plain English. You must extract and return a valid JSON object matching this exact structure:
{
  "materials": {
    "asphalt": <number, price per sq ft>,
    "tile": <number, price per sq ft>
  },
  "modifiers": {
    "pitch": {
      "flat": <number, multiplier e.g. 1.0>,
      "standard": <number, multiplier e.g. 1.0>,
      "steep": <number, multiplier e.g. 1.2>
    }
  },
  "flat_fees": <number, base fee in dollars>,
  "free_tier_averages": {
    "under_1500": <number, avg total for homes under 1500 sqft>,
    "1500_2500": <number, avg total for homes 1500-2500 sqft>,
    "over_2500": <number, avg total for homes over 2500 sqft>
  }
}

Rules:
- If a material price isn't mentioned, use industry standard defaults: asphalt=$4.50, tile=$11.00
- If flat fee isn't mentioned, default to $500
- Pitch multipliers: flat=1.0, standard=1.0, steep=1.2 unless specified
- free_tier_averages = material_price * avg_sqft_for_tier + flat_fees (avg sqft: 1200, 2000, 3200)
- Return ONLY the raw JSON object, no markdown fences, no explanation`

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: `Contractor pricing description: "${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    })

    const text = result.text ?? '{}'
    const json = JSON.parse(text) as PricingConfig
    return json
  } catch (err) {
    console.error('Gemini config generation failed, using defaults:', err)
    // Safe fallback
    return {
      materials: { asphalt: 4.50, tile: 11.00 },
      modifiers: { pitch: { flat: 1.0, standard: 1.0, steep: 1.2 } },
      flat_fees: 500,
      free_tier_averages: { under_1500: 5900, "1500_2500": 9500, over_2500: 14900 }
    }
  }
}

export async function saveCalculator(name: string, config: PricingConfig) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to save a calculator.")
  }

  const { data, error } = await supabase
    .from('calculators')
    .insert([{ user_id: user.id, name, config_json: config }])
    .select()

  if (error) {
    console.error("Error creating calculator:", error)
    throw new Error(error.message)
  }

  revalidatePath('/calculators')
  return data
}

export async function deleteCalculator(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('calculators').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/calculators')
}

export async function renameCalculator(id: string, newName: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('calculators').update({ name: newName }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/calculators')
}

export async function duplicateCalculator(id: string) {
  const supabase = await createClient()
  const { data: original, error: fetchErr } = await supabase
    .from('calculators').select('*').eq('id', id).single()
  if (fetchErr || !original) throw new Error("Could not duplicate configuration.")
  const { data, error } = await supabase
    .from('calculators')
    .insert([{ user_id: original.user_id, name: original.name + ' (Copy)', config_json: original.config_json, brand_color_hex: original.brand_color_hex }])
    .select()
  if (error) throw new Error(error.message)
  revalidatePath('/calculators')
  return data
}

export async function generateQuickEdit(originalConfig: PricingConfig, prompt: string): Promise<PricingConfig> {
  const newConfig = JSON.parse(JSON.stringify(originalConfig))
  const partialNew = await generateConfigFromPrompt(prompt)
  if (prompt.toLowerCase().includes("tile")) newConfig.materials.tile = partialNew.materials.tile
  if (prompt.toLowerCase().includes("asphalt")) newConfig.materials.asphalt = partialNew.materials.asphalt
  if (prompt.toLowerCase().includes("flat")) newConfig.flat_fees = partialNew.flat_fees
  return newConfig
}

export async function updateCalculatorConfig(id: string, newConfig: PricingConfig) {
  const supabase = await createClient()
  const { error } = await supabase.from('calculators').update({ config_json: newConfig }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/calculators')
}
