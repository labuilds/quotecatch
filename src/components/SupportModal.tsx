"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Check, Loader2, Image as ImageIcon, Trash2 } from "lucide-react"
import { createPortal } from "react-dom"
import { sendSupportEmail } from "@/app/actions/support"

export function SupportButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-4 w-full px-6 py-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all duration-200 font-black text-[18px] group cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 shrink-0 group-hover:text-red-700 transition-colors" />
        <span className="whitespace-nowrap">Contact Support</span>
      </button>
      {open && <SupportModal onClose={() => setOpen(false)} />}
    </>
  )
}

function SupportModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("")
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    textareaRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = "unset"
    }
  }, [onClose])

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = base64Str
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        let width = img.width
        let height = img.height

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7)) // Compress to 70% quality JPEG
      }
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + screenshots.length > 5) {
      alert("Maximum 5 screenshots allowed")
      return
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (>10MB)`)
        continue
      }

      const reader = new FileReader()
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string)
        setScreenshots(prev => [...prev, compressed])
      }
      reader.readAsDataURL(file)
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    try {
      await sendSupportEmail({
        message,
        screenshots: screenshots.length > 0 ? screenshots : undefined
      })
      setSent(true)
      setTimeout(() => {
        setSent(false)
        setMessage("")
        setScreenshots([])
        onClose()
      }, 2000)
    } catch (err: any) {
      alert("Failed to send: " + err.message)
    } finally {
      setSending(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center px-0 sm:px-6 py-10 pointer-events-auto"
      style={{ zIndex: 9999999, isolation: "isolate" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-slate-100 flex flex-col overflow-hidden"
        style={{ maxHeight: "calc(100vh - 5rem)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-10 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm transition-all duration-500">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#0F172A]" />
            </div>
            <div>
              <h2 className="text-[24px] font-semibold text-slate-900 tracking-tight leading-none mb-1.5">Contact Support</h2>
              <p className="text-[16px] text-slate-400 font-medium">We usually reply within a few hours.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSend} className="p-6 space-y-6">
          <div className="space-y-2">

            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue, question, or feature request..."
              rows={6}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[18px] font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[18px] font-semibold text-slate-400 tracking-widest">
                Screenshots ({screenshots.length}/5)
              </label>
            </div>

            {screenshots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {screenshots.map((src, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 group">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setScreenshots(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {screenshots.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-[11px] font-bold">Add Another</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-[16px] font-bold">Click to upload screenshots</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <button
              type="submit"
              disabled={!message.trim() || sending || sent}
              className={`w-full flex items-center justify-center gap-2 h-14 px-10 font-black rounded-2xl text-[18px] transition-all cursor-pointer disabled:cursor-not-allowed ${sent
                ? "bg-emerald-500 text-white"
                : "bg-[#0F172A] hover:bg-black text-white shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                }`}
            >
              {sending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Sending Message...</>
              ) : sent ? (
                <><Check className="w-5 h-5" /> Message Sent!</>
              ) : (
                <><Send className="w-5 h-5" /> Send Message</>
              )}
            </button>

            <div className="text-center pt-2 border-t border-slate-50">
              <p className="text-[14px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 underline underline-offset-4 decoration-slate-200">Founder & Direct Support</p>
              <a
                href="mailto:founder@getquotecatch.com"
                className="text-[17px] text-slate-900 font-extrabold hover:text-red-700 transition-colors"
              >
                founder@getquotecatch.com
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
