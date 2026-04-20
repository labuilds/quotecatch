"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Crown, Check, Loader2, LogOut, User, CreditCard, Bot, Lock,
  Camera, Globe, MessageSquare, Info, Type, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"
import { updateUserProfile, deleteUserAccount } from "@/app/actions/profile"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SettingsClientProps {
  isPro: boolean
  userProfile: any
}

export function SettingsClient({ isPro, userProfile }: SettingsClientProps) {
  const [formData, setFormData] = useState({
    first_name: userProfile.first_name || "",
    last_name: userProfile.last_name || "",
    company_name: userProfile.company_name || "",
    website: userProfile.website || "",
    webhook_url: userProfile.webhook_url || "",
    company_logo_url: userProfile.company_logo_url || "",
    company_description: userProfile.company_description || "",
    facebook_url: userProfile.facebook_url || "",
    linkedin_url: userProfile.linkedin_url || "",
    instagram_url: userProfile.instagram_url || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [saved, setSaved] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Create a sanitized copy of the form data for URLs
      const sanitizedData = { ...formData }
      const standardUrlFields = ['website', 'webhook_url']
      const socialFields = {
        facebook_url: 'facebook.com/',
        instagram_url: 'instagram.com/',
        linkedin_url: 'linkedin.com/in/'
      }
      
      standardUrlFields.forEach(field => {
        const val = (sanitizedData as any)[field]
        if (val && val.trim() !== "" && !val.startsWith('http://') && !val.startsWith('https://')) {
          (sanitizedData as any)[field] = `https://${val.trim()}`
        }
      })

      Object.entries(socialFields).forEach(([field, domain]) => {
        let val = (sanitizedData as any)[field]
        if (val && val.trim() !== "") {
          val = val.trim()
          if (val.startsWith('http')) {
            (sanitizedData as any)[field] = val
          } else if (val.includes(domain.split('/')[0])) {
            (sanitizedData as any)[field] = `https://${val}`
          } else {
            // It's a handle
            (sanitizedData as any)[field] = `https://${domain}${val.replace(/^@/, '')}`
          }
        }
      })

      let finalLogoUrl = sanitizedData.company_logo_url

      // 1. Upload logo if a new one is selected
      if (selectedFile) {
        setLogoUploading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `logos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, selectedFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath)
        
        finalLogoUrl = publicUrl
        setLogoPreview(null)
        setSelectedFile(null)
      }

      // 2. Update profile with everything
      await updateUserProfile({
        ...sanitizedData,
        company_logo_url: finalLogoUrl
      })

      setFormData({ ...sanitizedData, company_logo_url: finalLogoUrl })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      alert("Error saving profile: " + err.message)
    } finally {
      setIsSaving(false)
      setLogoUploading(false)
    }
  }

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, company_logo_url: "" }))
    setLogoPreview(null)
    setSelectedFile(null)
  }

  const handleUpgrade = async () => {
    try {
      const { url } = await createDodoCheckoutSession()
      if (!url || url.startsWith("#")) {
        alert("Billing is not configured. Please add DODO_PAYMENTS_API_KEY and DODO_PRO_PRODUCT_ID to your environment variables.")
        return
      }
      window.location.href = url
    } catch (error) {
      console.error(error)
      alert("Failed to start checkout. Check your network or API keys.")
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") return
    
    setIsDeleting(true)
    try {
      const { success } = await deleteUserAccount()
      if (success) {
        await supabase.auth.signOut()
        router.push("/login")
      }
    } catch (err: any) {
      alert("Error deleting account: " + err.message)
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      {/* Page header */}
      <div>
        <h1 className="text-[36px] font-black tracking-tighter text-[#0F172A] leading-tight">
          Account Settings
        </h1>
        <p className="text-slate-500 font-medium text-[16px] mt-1">
          Manage your roofing business profile and subscription.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {/* Content */}
        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <User className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-[18px] font-black text-[#0F172A]">Company Profile</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1.5">First Name</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="John"
                  className="h-14 rounded-2xl border-slate-200 bg-white px-6 text-[16px] font-normal text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1.5">Last Name</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Smith"
                  className="h-14 rounded-2xl border-slate-200 bg-white px-6 text-[16px] font-normal text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1.5">Company Name</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Apex Roofing Pros"
                className="h-14 rounded-2xl border-slate-200 bg-white px-6 text-[16px] font-normal text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[15px] font-bold text-slate-600 ml-1">Company Logo</Label>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className={`w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed transition-colors flex items-center justify-center overflow-hidden ${logoPreview ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : formData.company_logo_url ? (
                      <img src={formData.company_logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 opacity-40">
                        <Globe className="w-8 h-8 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">No Logo</span>
                      </div>
                    )}
                    {logoUploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-red-700" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-[13px] text-slate-500 font-bold leading-relaxed">
                    Upload your company logo. This will be shown on your quotes and widgets.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="h-10 rounded-xl relative overflow-hidden font-bold text-slate-600 hover:text-slate-900 border-slate-200"
                    >
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleLogoSelect}
                        disabled={logoUploading || isSaving}
                      />
                      <Camera className="w-4 h-4 mr-2" />
                      {formData.company_logo_url || logoPreview ? "Change Logo" : "Select Logo"}
                    </Button>
                    {(formData.company_logo_url || logoPreview) && (
                      <Button
                        variant="ghost"
                        onClick={removeLogo}
                        className="h-10 rounded-xl font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                    {logoPreview && !logoUploading && !isSaving && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-xl border border-red-100 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                          Pending Save
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1.5">Short Description (One-liner)</Label>
              <Input
                value={formData.company_description}
                onChange={(e) => setFormData(prev => ({ ...prev, company_description: e.target.value }))}
                placeholder="High-quality roofing services with a 25-year warranty."
                className="h-14 rounded-2xl border-slate-200 bg-white px-6 text-[16px] font-normal text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1.5">Business Website</Label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://apexroofing.com"
                  className="h-14 pl-12 pr-6 rounded-2xl border-slate-200 bg-white text-[16px] font-normal text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
              <h4 className="text-[14px] font-black text-slate-400 uppercase tracking-widest mb-4">Social Media Presence</h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-[48px_1fr] items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <svg className="w-5 h-5 text-blue-600 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <Input
                    value={formData.facebook_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/your-page"
                    className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-[15px] font-bold text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                  />
                </div>
                <div className="grid grid-cols-[48px_1fr] items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#0077b5]/10 flex items-center justify-center border border-[#0077b5]/20">
                    <svg className="w-5 h-5 text-[#0077b5] fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/company/your-company"
                    className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-[15px] font-bold text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                  />
                </div>
                <div className="grid grid-cols-[48px_1fr] items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100">
                    <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <Input
                    value={formData.instagram_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                    placeholder="https://instagram.com/your-handle"
                    className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-[15px] font-bold text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className={`h-12 px-8 font-black rounded-2xl text-[16px] transition-all duration-300 ${
                  saved
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                    : "bg-[#0F172A] hover:bg-black text-white shadow-lg shadow-slate-200 hover:-translate-y-0.5"
                }`}
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : saved ? (
                  <><Check className="w-4 h-4 mr-2" /> Settings Saved</>
                ) : (
                  "Save Profile Settings"
                )}
              </Button>
            </div>
          </section>

          {/* Billing Section */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <CreditCard className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-[18px] font-black text-[#0F172A]">Current Plan</h3>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[20px] font-black text-[#0F172A]">
                    {isPro ? "Pro Satellite" : "Basic Estimator"}
                  </p>
                  <span
                    className={`text-[12px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      isPro
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    Active
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 font-bold">
                  {isPro
                    ? "Unlimited Lead Machines · Pro Satellite Power · CRM Webhooks"
                    : "Standard Lead Machine · Manual Estimations · Basic Analytics"}
                </p>
              </div>
              {!isPro && (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="h-11 px-6 bg-red-700 text-white font-black rounded-xl text-[14px] shadow-lg shadow-red-200 hover:bg-red-800 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Upgrade to Pro Satellite
                </Button>
              )}
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50" />
          </section>


          {/* CRM Webhooks (Pro-Gated) */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isPro ? "bg-red-50 border-red-100/50" : "bg-slate-50 border-slate-100"}`}>
                  {isPro ? (
                    <Bot className="w-5 h-5 text-red-700" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <h3 className="text-[18px] font-black text-[#0F172A]">CRM Webhooks</h3>
              </div>
              {!isPro && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="text-[12px] font-black uppercase tracking-widest bg-red-700 text-white px-3 py-1.5 rounded-full shadow-sm hover:bg-red-800 transition-colors cursor-pointer"
                >
                  Pro Feature
                </button>
              )}
            </div>

            <p className="text-[14px] text-slate-600 font-bold leading-relaxed">
              Automatically push new leads to Zapier, Make, or your CRM of choice.
            </p>

            <div className={`space-y-4 ${!isPro ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1.5">Endpoint URL</Label>
                </div>
                <Input
                  value={formData.webhook_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                  disabled={!isPro}
                  placeholder="https://hooks.zapier.com/..."
                  className="h-14 rounded-2xl border-slate-200 bg-white px-6 text-[16px] font-normal text-[#0F172A] focus-visible:ring-4 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>
            </div>

            {!isPro && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full h-12 border-2 border-dashed border-red-200 rounded-2xl text-red-700 font-black text-[14px] hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Upgrade to Pro to unlock CRM Webhooks
              </button>
            )}
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50/30 border border-red-100 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center border border-red-200">
                <X className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-[#0F172A]">Danger Zone</h3>
                <p className="text-[13px] text-red-600/60 font-medium italic">Proceed with absolute caution</p>
              </div>
            </div>

            <div className="p-6 bg-white border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-[16px] font-black text-[#0F172A]">Delete Your Account</p>
                <p className="text-[13px] text-slate-500 font-bold max-w-sm">
                  Permanently remove all your lead machines, estimator data, and website integrations. This action is irreversible.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteDialog(true)}
                className="h-12 px-6 rounded-xl bg-red-50 text-red-600 font-black hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                Delete Account
              </Button>
            </div>
          </section>

          {/* Sign out */}
          <div className="flex justify-center pt-8">
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-2xl h-12 px-6 text-[16px] transition-all"
              onClick={async () => {
                await supabase.auth.signOut()
                router.push("/login")
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out of Account
            </Button>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-[2.5rem] border-red-100 bg-white p-10 font-sans max-w-md">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
              <X className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="text-[28px] font-black text-[#0F172A] tracking-tight leading-tight">
              Are you absolutely certain?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-[15px] pt-4">
              This will permanently delete your QuoteCatch account and all associated data. You will lose access to all your Lead Machines instantly.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-8 space-y-4">
             <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">Type <span className="text-red-600">DELETE</span> to confirm</p>
             <Input 
               value={deleteConfirmation}
               onChange={(e) => setDeleteConfirmation(e.target.value)}
               placeholder="DELETE"
               className="h-14 rounded-2xl border-2 border-red-100 bg-white px-6 text-center text-[18px] font-black text-red-600 focus-visible:ring-4 focus-visible:ring-red-100 focus-visible:border-red-500 transition-all placeholder:text-red-100"
             />
          </div>

          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="h-14 rounded-2xl font-black border-slate-100 text-slate-500 flex-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE" || isDeleting}
              className="h-14 rounded-2xl bg-red-600 text-white font-black flex-[1.5] border-none shadow-xl shadow-red-200 transition-all hover:bg-black disabled:opacity-30"
            >
              {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete Irreversibly"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
