"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, 
  MapPin, 
  Zap, 
  ArrowLeft, 
  Home, 
  Search, 
  Loader2, 
  ExternalLink, 
  Globe,
  ChevronRight,
  ShieldCheck,
  Phone,
  Calendar,
  Share2,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Info
} from "lucide-react"
import LeadCaptureModal from "@/components/LeadCaptureModal"

const MATERIAL_INFO: Record<string, { title: string; desc: string; image: string }> = {
  asphalt: {
    title: "Architectural Asphalt",
    desc: "Asphalt shingles are the most popular roofing material in North America. They are durable, affordable, and come in a wide variety of colors and styles to match any home. They offer excellent fire resistance and are easy to maintain.",
    image: "/asphalt.jpg"
  },
  tile: {
    title: "Spanish & Luxury Tile",
    desc: "Tile roofing offers exceptional longevity and fire resistance. Common in Mediterranean and Southwestern architecture, tiles are made from concrete or clay and can last over 50 years with proper installation.",
    image: "/tiles.jpg"
  },
  metal: {
    title: "Standing Seam Metal",
    desc: "Metal roofing is a premium choice known for its extreme durability and energy efficiency. It is highly resistant to wind and fire, and can often be installed over existing roofs, reducing waste.",
    image: "/materials/metal.jpg"
  },
  cedar: {
    title: "Natural Cedar Shake",
    desc: "Natural Cedar shakes provide a timeless, organic look with excellent insulation properties. They are naturally resistant to decay and insects, providing a unique aesthetic that ages beautifully over time.",
    image: "/materials/cedar.png"
  }
}

const normalizeSocialLink = (url: string, platform: 'facebook' | 'instagram' | 'linkedin' | 'website') => {
  if (!url) return "#";
  
  let clean = url.trim();
  if (!clean) return "#";
  
  // If it's already a full URL with protocol, just ensure it's validish
  if (clean.startsWith('http')) return clean;
  
  // Define platform bases
  const bases: Record<string, string> = {
    facebook: 'facebook.com/',
    instagram: 'instagram.com/',
    linkedin: 'linkedin.com/in/'
  };

  const base = bases[platform as keyof typeof bases];

  if (base) {
    // If they already included the domain but no protocol
    if (clean.includes(base.split('/')[0])) {
      return `https://${clean}`;
    }
    // If it's just a handle, prefix it
    return `https://${base}${clean.replace(/^@/, '')}`;
  }
  
  // Default for website or if no platform matches
  return clean.startsWith('http') ? clean : `https://${clean}`;
}

const PITCH_LABELS: Record<string, string> = {
  flat: "Flat",
  low: "Low Slope",
  standard: "Moderate Slope",
  steep: "Steep Slope"
}

export default function EstimatesClient({ 
  lead, 
  companyName,
  userProfile,
  isDemo = false,
  staticMapUrl = null
}: { 
  lead: any, 
  companyName: string,
  userProfile?: any,
  isDemo?: boolean,
  staticMapUrl?: string | null
}) {
  const [showResults, setShowResults] = useState(!!lead.homeowner_email)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formData = lead.form_data || {}
  const materialKey = formData.desiredMaterial || 'asphalt'
  const material = MATERIAL_INFO[materialKey] || MATERIAL_INFO.asphalt
  
  const unformattedPrice = lead.estimated_price || 0
  const minPrice = unformattedPrice * 0.9
  const maxPrice = unformattedPrice * 1.35 // Wider range for "estimate" feel

  const formatPrice = (val: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val)

  const priceRange = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}*`

  const sqFt = formData.sqFt || "1500_2500" // Default to mid-size if unknown
  const pitchLabel = PITCH_LABELS[formData.pitch] || "Standard (4/12)"




  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden pb-12">
      
      {isDemo && (
        <div className="w-full bg-amber-50 border-b border-amber-100 py-3 px-6 text-center">
            <p className="text-[15px] font-semibold text-amber-800">
                <span className="bg-amber-200 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider mr-2">Demo Mode</span>
                This is a sample estimate. To get real quotes for your project, <a href="/login?tab=signup" className="underline hover:text-amber-900">sign up for a free account</a>.
            </p>
        </div>
      )}

      {/* Header Area */}
      <div className={`max-w-6xl mx-auto px-6 pt-12 transition-all duration-700 ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {userProfile?.company_logo_url ? (
          <div className="h-14 mb-8">
            <img src={userProfile.company_logo_url} alt={companyName} className="h-full w-auto object-contain" />
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tighter uppercase">{companyName || "Roofing Specialist"}</span>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h1 className="text-[32px] lg:text-[40px] font-semibold text-[#0F172A] tracking-tight leading-none">Review your estimate</h1>
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all font-semibold text-[16px] shadow-sm self-start md:self-auto group active:scale-95"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-animate-in fade-in zoom-in duration-300" />
            ) : (
              <Share2 className="w-4 h-4 group-hover:text-red-600 transition-colors" />
            )}
            <span className={copied ? "text-emerald-700" : ""}>
              {copied ? "Link Copied!" : "Share Estimate"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row items-stretch md:items-start">
            {/* Image (Carousel-like) */}
            <div className="md:w-1/2 relative h-[180px] md:h-[500px] md:min-h-[500px] overflow-hidden shrink-0">
               <img src={material.image} alt={material.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" />
            </div>

            {/* Content */}
            <div className="md:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-[16px] font-semibold text-slate-600 uppercase tracking-widest">{material.title}</p>
                <h2 className="text-[32px] lg:text-[38px] font-semibold text-[#0F172A] tracking-tighter leading-tight">
                  {priceRange}
                </h2>
                
                <div className="space-y-4">
                  <p className={`text-[15px] text-slate-600 font-medium leading-relaxed transition-all ${showFullDesc ? "" : "line-clamp-3"}`}>
                    {material.desc}
                  </p>
                  <button 
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="flex items-center gap-1 text-[16px] font-semibold text-[#0F172A] hover:text-red-700 transition-colors"
                  >
                    {showFullDesc ? "See less" : "See more"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFullDesc ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <div className="pt-8 border-t border-slate-50 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[16px] font-semibold text-[#0F172A]">Real-time Estimation</p>
                      <p className="text-[16px] text-slate-600 font-semibold">Based on current local material rates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-3 mb-6 flex items-center justify-center">
              {userProfile?.company_logo_url ? (
                <img src={userProfile.company_logo_url} alt={companyName} className="w-full h-full object-contain" />
              ) : (
                <ShieldCheck className="w-10 h-10 text-slate-300" />
              )}
            </div>
            
            <h3 className="text-[20px] font-semibold text-[#0F172A] mb-4">{companyName || "Our Roofing Team"}</h3>
            
            <p className="text-[16px] text-slate-600 font-semibold leading-relaxed mb-8">
              {userProfile?.company_description || "Backed by years of experience, we specialize in roof repairs and replacements using premium materials. Protect your home with expert roofing you can count on."}
            </p>

            <div className="flex flex-col items-center gap-6 w-full">
              {userProfile?.phone && (
                <a 
                  href={`tel:${userProfile.phone}`} 
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0F172A] text-white hover:bg-slate-900 transition-all shadow-xl shadow-slate-200 group w-full justify-center"
                >
                  <Phone className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[15px] font-semibold">{userProfile.phone}</span>
                </a>
              )}

              <div className="flex items-center justify-center gap-4">
                {userProfile?.website && (
                  <a href={normalizeSocialLink(userProfile.website, 'website')} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all text-slate-600" title="Visit Website">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                <a href={`mailto:${lead.homeowner_email || ""}`} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all" title="Send Email">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Roof Stats Section */}
        <div className="mt-12 bg-[#0F172A] rounded-[2.5rem] p-10 lg:p-14 text-white overflow-hidden relative">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-10 relative z-10">
                <h2 className="text-[36px] lg:text-[48px] font-semibold tracking-tighter leading-none">
                  Your roof by<br />the numbers—
                </h2>
                <p className="text-slate-600 font-semibold text-[15px] max-w-sm">
                  This is an estimate. Actual roof size will vary based on the exact slope (steepness) of your roof.
                </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    <div className="space-y-1">
                      <p className="text-[28px] lg:text-[34px] font-semibold">{sqFt === "under_1500" ? "< 1,500" : sqFt === "1500_2500" ? "2,000" : sqFt === "over_2500" ? "3,000+" : sqFt}</p>
                      <p className="text-slate-600 font-semibold text-[16px] uppercase tracking-widest">Square feet</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[28px] lg:text-[34px] font-semibold">{pitchLabel}</p>
                      <p className="text-slate-600 font-semibold text-[16px] uppercase tracking-widest">Slope</p>
                    </div>
                    {formData.buildingType && (
                      <div className="space-y-1">
                        <p className="text-[28px] lg:text-[34px] font-semibold capitalize">{formData.buildingType}</p>
                        <p className="text-slate-600 font-semibold text-[16px] uppercase tracking-widest">Building</p>
                      </div>
                    )}
                    {formData.material && (
                      <div className="space-y-1">
                        <p className="text-[28px] lg:text-[34px] font-semibold capitalize">{formData.material}</p>
                        <p className="text-slate-600 font-semibold text-[16px] uppercase tracking-widest">Existing Roof</p>
                      </div>
                    )}
                    {formData.timeline && (
                      <div className="space-y-1">
                        <p className="text-[28px] lg:text-[34px] font-semibold capitalize">{formData.timeline.replace('-', ' to ')}</p>
                        <p className="text-slate-600 font-semibold text-[16px] uppercase tracking-widest">Timeline</p>
                      </div>
                    )}
                    {formData.financing && (
                      <div className="space-y-1">
                        <p className="text-[28px] lg:text-[34px] font-semibold capitalize">{formData.financing}</p>
                        <p className="text-slate-600 font-semibold text-[16px] uppercase tracking-widest">Financing</p>
                      </div>
                    )}
                  </div>

                  {lead.notes && (
                    <div className="pt-8 border-t border-slate-800 mt-4">
                      <p className="text-slate-600 font-semibold text-[16px] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Homeowner Notes:
                      </p>
                      <p className="text-slate-300 font-medium italic text-[16px] leading-relaxed">
                        "{lead.notes}"
                      </p>
                    </div>
                  )}
              </div>

              {(userProfile?.is_pro || isDemo) ? (
                <div className="relative h-[240px] lg:h-[300px] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
                   <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                    {staticMapUrl ? (
                      <img 
                        src={staticMapUrl} 
                        alt="Satellite View" 
                        className="absolute inset-0 w-full h-full object-cover z-10" 
                        onError={(e) => {
                          console.error("Satellite Image failed to load. URL:", staticMapUrl);
                          e.currentTarget.style.opacity = '0';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 border border-slate-800 fallback-msg">
                       <div className="text-center space-y-3">
                          <MapPin className="w-10 h-10 text-slate-700 mx-auto" />
                          <p className="text-[16px] font-semibold text-slate-600 uppercase tracking-widest">
                            {!staticMapUrl ? "Google Maps API Key Missing" : "Satellite Imagery Unavailable"}
                          </p>
                          <p className="text-[10px] text-slate-600 font-semibold px-8 max-w-[240px]">
                            {!staticMapUrl 
                              ? "Check your .env.local file for GOOGLE_MAPS_API_KEY." 
                              : "High-resolution aerial scan could not be loaded for this location."
                            }
                          </p>
                       </div>
                    </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center justify-center bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 p-12 text-center">
                   <div className="max-w-xs space-y-4">
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                        <Zap className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-600 text-[15px] font-semibold">Satellite measurements are exclusive to our Pro tier partners.</p>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
          <p className="text-[18px] font-semibold text-[#0F172A] mb-8 tracking-tight">Connect and learn more about us</p>
          
          <div className="flex items-center gap-6 mb-20">
            {userProfile?.facebook_url && (
              <a href={normalizeSocialLink(userProfile.facebook_url, 'facebook')} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-all text-slate-600">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {userProfile?.instagram_url && (
              <a href={normalizeSocialLink(userProfile.instagram_url, 'instagram')} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-all text-slate-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            )}
            {userProfile?.linkedin_url && (
              <a href={normalizeSocialLink(userProfile.linkedin_url, 'linkedin')} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-all text-slate-600">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {!userProfile?.facebook_url && !userProfile?.instagram_url && !userProfile?.linkedin_url && (
              <div className="flex items-center gap-6 opacity-20">
                <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-600">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-600">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
              </div>
            )}
          </div>

          <p className="text-[16px] text-slate-600 font-semibold text-center max-w-lg italic mb-8">
            *Please be advised that this is only an estimate. Final prices will vary upon onsite assessment.
          </p>

          <div className="flex items-center gap-2 grayscale opacity-20 group/brand">
             <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
             </div>
             <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-900">
                Powered by <a href="https://getquotecatch.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-700 transition-colors">QuoteCatch</a>
             </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!showResults && (
           <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-[90]"
            />
            <LeadCaptureModal 
              leadId={lead.id} 
              companyName={companyName}
              onSubmitSuccess={() => setShowResults(true)}
            />
           </>
        )}
      </AnimatePresence>
    </div>
  )
}
