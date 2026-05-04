"use client"

import { useState } from 'react'
import { ChevronDown, Sparkles, Search, Satellite, Zap, Globe, BarChart3 } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
  icon: React.ReactNode
  isOpen: boolean
  onClick: () => void
}

const FAQItem = ({ question, answer, icon, isOpen, onClick }: FAQItemProps) => {
  return (
    <div 
      className={`group border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? 'bg-slate-50/50 shadow-sm' : 'hover:bg-slate-50/30'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl transition-colors duration-300 ${
            isOpen ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
          }`}>
            {icon}
          </div>
          <h3 className="text-lg font-medium text-slate-900 tracking-tight">{question}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
      </button>
      
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pl-14">
          <p className="text-slate-600 leading-relaxed font-medium">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does QuoteCatch differ from a standard roofing CRM?",
      answer: "QuoteCatch is built for speed, not bloat. Unlike complex CRMs that require weeks of training, QuoteCatch is a laser-focused lead capture machine. We don't sell your leads to other contractors—you own your funnel. Plus, at $99/mo (or $69/mo annually), we offer professional satellite tech for nearly half the price of $149/mo competitors.",
      icon: <Search className="w-5 h-5" />
    },
    {
      question: "Is this an instant roof quote estimator for my website?",
      answer: "Yes. Homeowners get a precise estimate based on real-time satellite measurements in seconds. You instantly receive the lead via email or webhook, including their contact info, roof dimensions, and selected materials—turning anonymous visitors into qualified appointments instantly.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      question: "How accurate are the satellite roof measurements?",
      answer: "Our engine uses high-resolution satellite data to provide industry-leading precision. This stops you from 'climbing roofs for free' and ensures you only spend time on qualified homeowners who have already seen your pricing and are ready to sign.",
      icon: <Satellite className="w-5 h-5" />
    },
    {
      question: "What is the monthly cost for QuoteCatch Pro?",
      answer: "We believe in transparent, massive value. QuoteCatch Pro is exactly $99/month on a month-to-month basis, or $69/month if billed annually. There are no hidden fees, no per-lead charges, and no long-term contracts. It's the most cost-effective way to scale your roofing lead generation.",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      question: "Can I use QuoteCatch without a website?",
      answer: "Absolutely. Every QuoteCatch account comes with a unique direct link you can share via SMS, email, or social media. You can also download your custom QR codes directly from the dashboard to put on truck wraps, yard signs, and door hangers—capturing leads wherever your business is visible.",
      icon: <Globe className="w-5 h-5" />
    },
    {
      question: "How does this help me capture more leads and close more sales?",
      answer: "By giving homeowners what they want—instant pricing—you capture 3x more leads than a standard 'Contact Us' form. Because these leads come in with measurements and pricing already established, your sales cycle is cut in half. You focus on closing, not measuring.",
      icon: <Sparkles className="w-5 h-5" />
    }
  ]


  return (
    <section id="faq" className="py-20 lg:py-32 px-4 sm:px-6 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-red-50 rounded-full blur-[100px] opacity-60 -z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] opacity-60 -z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-widest">Capture more leads, close more sales</span>
          </div>
          <h2 className="text-[36px] lg:text-[54px] font-semibold text-[#0F172A] tracking-tighter leading-tight">
            Frequently Asked <span className="text-red-700">Questions</span>
          </h2>
          <p className="text-slate-600 text-[18px] lg:text-[20px] font-medium max-w-2xl mx-auto">
            Everything you need to know about scaling your roofing business with high-precision satellite tech.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              icon={faq.icon}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* SEO Structured Data for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  )
}
