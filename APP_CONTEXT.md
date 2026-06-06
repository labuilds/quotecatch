# QuoteCatch: Project Context & Architecture

**Mission**: Turn low-converting contractor websites into high-octane lead generation machines.
**Focus**: Roofing contractors ("The Anti-CRM crowd").
**The Vibe**: Premium, fast, trustworthy. High-fidelity animations, large type, and buttery transitions.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Authentication**: Supabase Auth (SSR Integration with PKCE)
- **Database**: Supabase (PostgreSQL)
- **Billing**: Dodo Payments (Subscription management + Checkout sessions)
- **Styling**: Tailwind CSS + shadcn/ui (Customized for premium aesthetics)
- **Animations**: Framer Motion (for widget transitions and UI micro-interactions)
- **Deployment**: Vercel

---

## 🏗 Key Architectural Patterns

### 1. The "Intent-to-Purchase" Flow
A seamless bridge from marketing to checkout that bypasses the dashboard for new customers.
- **Trigger**: Landing page pricing buttons append `?intent=pro` to the login URL.
- **Tracking**: `LoginPage` detects this and drops a temporary cookie: `checkout_intent=pro; max-age=3600`.
- **Interception**: The `/auth/confirm` (Magic Link) and `/auth/callback` (OAuth/Google) routes check for this cookie upon successful login.
- **Redirect**: If present, they clear the cookie and redirect to `/api/checkout/init`.
- **Checkout**: `/api/checkout/init` generates a Dodo Payments session and sents the user directly to the payment page.

### 2. Manual Pricing Engine
We have decommissioned the AI-prompt-based configuration in favor of a **Manual Editor** (`src/components/dashboard/ManualCalculatorEditor.tsx`).
- **Control**: Contractors have 100% manual control over material rates, pitch multipliers, baseline flat fees, and free-tier fallback averages.
- **Live Preview**: The editor features a real-time side-by-side preview where any manual adjustment to the math is instantly reflected in a live `RoofingWidget` instance.
- **Integrity**: This ensures the roofer’s pricing math is exact and predictable, never relying on LLM interpretation for financial estimates.

### 3. Auth Integrity (Singleton Client)
- `src/utils/supabase/client.ts` uses a singleton pattern for the browser client. This is critical to prevent the loss of the PKCE code verifier across React re-renders during the Magic Link/OAuth handshake.

---

## 🎨 Branding & UI Conventions
- **Terminology**: 
  - Never use "Distribution Engine" → always **"Basic Estimator"**.
  - Never use "Profit Engine" → always **"Pro Satellite"**.
- **The "Hero" Input Pattern**: Login forms use upscaled inputs (`text-[22px]`, `h-17`) for high-impact visual design. 
- **Base UI Unlocking**: The base shadcn `Input` component has been modified to remove the `md:text-sm` constraint, allowing custom font sizes (like 22px or 30px) to persist on desktop.

---

## 🚦 Infrastructure & Environments
- **Production Domain**: [getquotecatch.com](https://getquotecatch.com) (Deployed on Vercel, DNS managed by Cloudflare).
- **Development**: [localhost:3000](http://localhost:3000).
- **Auth White-labeling**: 
  - BOTH `http://localhost:3000` and `https://getquotecatch.com` must be in the Supabase Redirect Allow List.
  - All magic links and social redirects MUST use the base `/auth/callback` or `/auth/confirm` endpoints for session hydration.

---

## 💎 Precise Implementation Nuances

### 1. Dynamic Marketing State
The landing page (`src/app/page.tsx`) is a **hybrid server/client component**. It performs a server-side auth check to dynamically swap the "Get Started" and "Login" buttons for a single "Go to Dashboard" button for returning users. This ensures zero "flicker" of login buttons for authenticated contractors.

### 2. The "Hero" Input Architecture
To achieve the premium, high-impact login form:
- **Base Level**: We modified `src/components/ui/input.tsx` to remove the default `md:text-sm` Tailwind override. Without this, custom font sizes were being capped at 14px on desktop.
- **Implementation Level**: Inputs now use `text-[19px]` to `text-[22px]` with `font-black` and `h-18` to `h-20` to command absolute visual attention.

### 3. Widget "Snappiness" vs Safety
We use `onPointerDown` for selection steps to eliminate the 300ms mobile tap delay. To survive the resulting "double fire" from the browser:
- `handleSelect` immediately sets `setIsAdvancing(true)`.
- It uses a nested `setTimeout` (300ms for visual feedback, 400ms for the navigation lock). This prevents users from accidentally "triple-skipping" when they tap quickly.

### 4. Billing Environment Safety
- Production payments require `DODO_PAYMENTS_API_KEY` and `DODO_PRO_PRODUCT_ID` to be strictly synced between the Stripe/Dodo dashboard and Vercel Environment Variables.
- Billing client logic uses a `#` hash fallback to prevent runtime crashes if keys are missing, instead showing a graceful configuration alert.

---

## 📋 Ongoing Directives for LLMs
1. **Mobile First**: 80% of users are roofers on phones. Always test transitions on a mobile viewport.
2. **Premium Density**: Don't be afraid of huge margins. Use `py-28`, `space-y-12`, and `px-16` to keep the app feeling expensive.
3. **Intent Preservation**: Any change to `auth/callback` or `auth/confirm` MUST preserve the `checkout_intent` cookie logic, as this is our primary conversion engine.
