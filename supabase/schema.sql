-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  website TEXT,
  webhook_url TEXT,
  company_logo_url TEXT,
  company_description TEXT,
  phone TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  stripe_customer_id TEXT,
  is_pro BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  subscription_status TEXT DEFAULT 'trialing',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create calculators table
CREATE TABLE public.calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand_color_hex TEXT,
  config_json JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculator_id UUID REFERENCES public.calculators(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  homeowner_name TEXT NOT NULL,
  homeowner_email TEXT,
  homeowner_phone TEXT,
  estimated_price NUMERIC,
  address TEXT,
  notes TEXT,
  form_data JSONB DEFAULT '{}'::jsonb,
  lat NUMERIC,
  lng NUMERIC,
  pricing_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Policies for calculators
CREATE POLICY "Users can read own calculators" ON public.calculators FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own calculators" ON public.calculators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calculators" ON public.calculators FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calculators" ON public.calculators FOR DELETE USING (auth.uid() = user_id);

-- Policies for leads
-- Users can see leads only for their calculators
CREATE POLICY "Users can read own leads" ON public.leads FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.calculators c WHERE c.id = public.leads.calculator_id AND c.user_id = auth.uid()
  )
);
CREATE POLICY "Users can delete own leads" ON public.leads FOR DELETE USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.calculators c WHERE c.id = public.leads.calculator_id AND c.user_id = auth.uid()
  )
);
-- Allow public anonymous insertion of leads (when interacting with an embedded calculator component)
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
