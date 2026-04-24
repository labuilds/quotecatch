import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Document Container */}
        <div className="bg-white rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-16 lg:p-20">
            <header className="mb-12 border-b border-slate-100 pb-10">
              <h1 className="text-4xl font-semibold tracking-tight text-[#0F172A] mb-4">Terms of Service</h1>
              <p className="text-slate-600 font-semibold uppercase tracking-widest text-sm">
                Effective Date: {today}
              </p>
            </header>

            <article className="prose prose-slate max-w-none prose-headings:text-[#0F172A] prose-headings:font-semibold prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-[#0F172A]">
              <p>
                Welcome to QuoteCatch. These Terms of Service ("Terms") govern your access to and use of the QuoteCatch website, 
                services, and applications (the "Service"). By using the Service, you agree to be bound by these Terms.
              </p>

              <h2>1. Account Registration</h2>
              <p>
                To access certain features of the Service, you must register for an account. You agree to provide accurate, 
                current, and complete information during the registration process and to update such information to keep it accurate, 
                current, and complete.
              </p>

              <h2>2. Use of the Service</h2>
              <p>
                QuoteCatch grants you a limited, non-exclusive, non-transferable, revocable license to use the Service for your 
                business purposes, subject to these Terms. You are responsible for all activity that occurs under your account.
              </p>

              <h2>3. Custom Estimates & Satellite Data</h2>
              <p>
                <strong>Limitation of Liability (Estimates):</strong> QuoteCatch utilizes advanced satellite imagery and 
                mathematical modeling to provide roofing estimates. These estimates are provided for <strong>informational purposes only</strong>. 
                We do not guarantee the absolute accuracy of any measurement or cost calculation. QuoteCatch, its founders, 
                and employees shall not be held liable for any financial losses, property damage, misquotes, or business inaccuracies 
                resulting from the use of our widget. Whether a contractor underprices a job or overprices a bid based on our 
                data, the final responsibility for verifying measurements and pricing lies solely with the user.
              </p>

              <h2>4. Prohibited Conduct & API Integrity</h2>
              <p>
                <strong>API Abuse & Security:</strong> Our Service integrates with premium third-party APIs, including Google Maps 
                and Google Solar. Any attempt to reverse-engineer, decompile, or bypass the security measures of the QuoteCatch 
                widget is strictly prohibited. You may not use any automated systems, including bots, scrapers, or crawlers, 
                to access the Service or harvest data.
              </p>
              <p>
                Abuse of our API calls for non-legitimate purposes will result in <strong>immediate IP bans and permanent 
                account termination</strong> without refund. We reserve the right to seek legal remedies for any unauthorized 
                access or theft of Service resources.
              </p>

              <h2>5. Payments and Subscriptions</h2>
              <p>
                Certain features of the Service require a paid subscription. All fees are non-refundable unless otherwise 
                specified. We reserve the right to change our subscription plans or adjust pricing for our service in any 
                manner and at any time as we may determine in our sole and absolute discretion.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of 
                QuoteCatch and its licensors. Our trademarks and trade dress may not be used in connection with any product 
                or service without the prior written consent of QuoteCatch.
              </p>

              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or 
                liability, under our sole discretion, for any reason whatsoever and without limitation, including but not 
                limited to a breach of the Terms.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which QuoteCatch 
                operates, without regard to its conflict of law provisions.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to 
                access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us via the support portal in your dashboard.
              </p>
            </article>

            <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-600 font-semibold ml-1 text-sm">
                © {new Date().getFullYear()} QuoteCatch. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
