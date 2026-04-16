import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
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
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Document Container */}
        <div className="bg-white rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-16 lg:p-20">
            <header className="mb-12 border-b border-slate-100 pb-10">
              <h1 className="text-4xl font-black tracking-tight text-[#0F172A] mb-4">Privacy Policy</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                Last Updated: {today}
              </p>
            </header>

            <article className="prose prose-slate max-w-none prose-headings:text-[#0F172A] prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-[#0F172A]">
              <p>
                At QuoteCatch, your privacy is a priority. This Privacy Policy describes how we collect, use, and share 
                your information when you use our website, widgets, and services (the "Service").
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We collect information that you or your customers provide directly to us through the Service. This includes:
              </p>
              <ul>
                <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, and company details.</li>
                <li><strong>Widget Lead Data:</strong> When prospective customers use the QuoteCatch widget on your site, we collect <strong>property addresses</strong>, contact information (name, email, phone), and roofing preferences specifically to calculate roof sizes and provide cost estimates.</li>
              </ul>

              <h2>2. How We Use Information</h2>
              <p>
                We use the collected information to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our roofing estimation Service.</li>
                <li>Process and analyze property measurements via satellite data.</li>
                <li>Communicate with you about your account and Service updates.</li>
                <li>Fulfill our contractual obligations to you as a subscriber.</li>
              </ul>

              <h2>3. Google API Services & OAuth</h2>
              <p>
                Our Service uses Google OAuth for user authentication and integrates with various Google API Services (including Google Maps and Google Solar).
              </p>
              <p>
                <strong>Google API Disclosure:</strong> QuoteCatch's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the <strong>Limited Use</strong> requirements. We do not use your Google user data for advertising purposes or to build profiles beyond what is necessary to provide the QuoteCatch Service.
              </p>

              <h2>4. Third-Party Services</h2>
              <p>
                We share your information with third-party service providers who perform services on our behalf:
              </p>
              <ul>
                <li><strong>Supabase:</strong> Used for secure user authentication and as our primary database service.</li>
                <li><strong>Google APIs:</strong> We utilize Google Maps and Google Solar APIs to fetch property imagery and calculate structural measurements based on provided addresses.</li>
                <li><strong>Dodo Payments:</strong> Used for secure processing of subscription payments and billing management.</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement robust security measures to protect your information from unauthorized access, alteration, or destruction. 
                However, no internet-based service is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>6. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide you with the Service. 
                If you wish to delete your account or request that we no longer use your information, please contact our support team.
              </p>

              <h2>7. Your Rights</h2>
              <p>
                Depending on your location, you may have rights regarding your personal data, including the right to access, 
                correct, or delete the personal information we hold about you.
              </p>

              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h2>9. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please reach out to us through the support 
                dashboard in your QuoteCatch account.
              </p>
            </article>

            <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-400 font-bold ml-1 text-sm">
                © {new Date().getFullYear()} QuoteCatch. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
