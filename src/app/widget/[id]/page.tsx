import { createAdminClient } from '@/utils/supabase/server';
import RoofingWidget from "@/components/RoofingWidget";
import { ShieldAlert } from 'lucide-react';
import { PricingConfig } from "@/lib/pricingEngine";

export const revalidate = 0;

export default async function WidgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (id === 'preview-mode') {
      return null;
  }

  const supabase = await createAdminClient();

  const { data: calc } = await supabase
    .from('calculators')
    .select('*')
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

  const { data: userData } = await supabase
    .from('users')
    .select('is_pro, trial_ends_at, subscription_status, company_name, company_logo_url')
    .eq('id', calc.user_id)
    .single();

  const isPro = userData?.is_pro || false;
  const trialExpired = userData?.trial_ends_at && new Date(userData.trial_ends_at) < new Date();
  const isPastDue = userData?.subscription_status === 'past_due';
  
  // A roofer has access if they are Pro OR if they have a valid active trial
  const hasAccess = isPro || (userData?.trial_ends_at && !trialExpired && !isPastDue);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Estimator Unavailable</h2>
          <p className="text-slate-500">This estimator is currently unavailable. Please contact {userData?.company_name || "the administrator"} for assistance.</p>
        </div>
      </div>
    )
  }
  const config = calc.config_json as PricingConfig;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <RoofingWidget 
        isPro={isPro} 
        config={config} 
        calculatorId={id} 
        companyName={userData?.company_name || ""}
        companyLogoUrl={userData?.company_logo_url || ""}
      />
    </div>
  );
}
