import { createClient } from '@/utils/supabase/server';
import RoofingWidget from "@/components/RoofingWidget";
import { ShieldAlert } from 'lucide-react';
import { PricingConfig } from "@/lib/pricingEngine";

export default async function WidgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (id === 'preview-mode') {
      return null;
  }

  const supabase = await createClient();

  const { data: calc } = await supabase
    .from('calculators')
    .select('*, users(is_pro)')
    .eq('id', id)
    .single();

  if (!calc || calc.deleted_at) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Estimator Unavailable</h2>
          <p className="text-slate-500">This estimator is no longer active or has been removed by the administrator.</p>
        </div>
      </div>
    )
  }

  const isPro = calc.users?.is_pro || false;
  const config = calc.config_json as PricingConfig;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <RoofingWidget 
        isPro={isPro} 
        config={config} 
        calculatorId={id} 
      />
    </div>
  );
}
