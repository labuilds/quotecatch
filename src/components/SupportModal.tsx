"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Check, Loader2 } from "lucide-react"

export function SupportButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-150 font-semibold text-[14px] group cursor-pointer"
      >
        <MessageSquare className="w-[18px] h-[18px] shrink-0 group-hover:text-red-700 transition-colors" />
        Contact Support
      </button>
      {open && <SupportModal onClose={() => setOpen(false)} />}
    </>
  )
}

function SupportModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 700))
    setSending(false)
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setMessage("")
      onClose()
    }, 2000)
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-[17px] font-black text-slate-900">Contact Support</h2>
            <p className="text-[12px] text-slate-400 font-medium mt-0.5">We usually reply within a few hours.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">
              Your Message
            </label>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue, question, or feature request..."
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!message.trim() || sending || sent}
              className={`flex items-center gap-2 h-11 px-6 font-bold rounded-2xl text-[14px] transition-all cursor-pointer disabled:cursor-not-allowed ${
                sent
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-900 hover:bg-black text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
              }`}
            >
              {sending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : sent ? (
                <><Check className="w-4 h-4" /> Sent!</>
              ) : (
                <><Send className="w-4 h-4" /> Send Message</>
              )}
            </button>
            <a
              href="mailto:hello@getquotecatch.com"
              className="text-[13px] text-slate-400 hover:text-slate-700 font-medium transition-colors"
            >
              hello@getquotecatch.com
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
