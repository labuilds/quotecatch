"use client"

import { useState } from "react"
import { 
  MoreHorizontal, 
  Copy, 
  Trash, 
  Pencil, 
  ExternalLink, 
  CheckCircle2,
  MousePointer2,
  Share,
  Zap,
  QrCode,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteCalculator, duplicateCalculator } from "@/app/actions/calculator"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUserTier } from "@/components/UserTierProvider"

export default function CalculatorCard({ calc, onDelete, onRename, onDuplicate, onUpgradeRequest }: {
  calc: any
  onDelete?: (id: string) => void
  onRename?: (id: string, name: string) => void
  onDuplicate?: (obj: any) => void
  onUpgradeRequest?: () => void
}) {
  const { isPro } = useUserTier()
  const [showDelete, setShowDelete] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCalculator(calc.id)
      setShowDelete(false)
      if (onDelete) onDelete(calc.id)
    } catch (err) { console.error(err) }
    finally { setIsDeleting(false) }
  }

  const handleDuplicate = async () => {
    if (!isPro) {
      if (onUpgradeRequest) onUpgradeRequest()
      return
    }

    setIsActionLoading(true)
    try {
      const newCalc = await duplicateCalculator(calc.id)
      if (onDuplicate && newCalc && newCalc.length > 0) onDuplicate(newCalc[0])
    } catch (err) { console.error(err) }
    finally { setIsActionLoading(false) }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://getquotecatch.com'
  const embedCode = `<iframe src="${origin}/widget/${calc.id}" width="100%" height="700" scrolling="no" style="border:none; border-radius: 24px; overflow:hidden;" title="Roofing Estimate"></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(`${origin}/widget/${calc.id}`)}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quotecatch-qr-${calc.name.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Download failed", err)
      // Fallback: open in new tab
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(`${origin}/widget/${calc.id}`)}`, '_blank')
    }
  }

  const offeredMaterials = calc.config_json?.offered_materials || ['asphalt', 'tile', 'metal', 'cedar'];
  const materialPricing = calc.config_json?.materials || {};

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.4 }}
        className="group relative h-full"
      >
        <Card className="h-full flex flex-col bg-white border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-[2.5rem] overflow-hidden cursor-default font-sans relative">
          
          {/* Subtle Hover Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-50/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {/* Status Badge */}
          <div className="absolute top-6 left-6 z-20">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[12px] font-bold text-emerald-700 uppercase tracking-widest">Active System</span>
            </div>
          </div>

          {/* Unified Content Area */}
          <div className="pt-14 pb-4 px-8 space-y-5 relative z-10 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h3 className="text-[22px] font-bold tracking-tighter text-[#0F172A] leading-none">
                  {calc.name}
                </h3>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-10 w-10 rounded-2xl bg-slate-50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm flex items-center justify-center -mt-2 shrink-0"
                )}>
                  <MoreHorizontal className="w-4 h-4 text-slate-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl shadow-2xl border-slate-100 bg-white/95 backdrop-blur-xl font-sans">
                   <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer py-3 font-medium text-slate-700 focus:bg-slate-50 focus:text-red-700 rounded-xl transition-colors text-xs">
                    <Copy className="w-4 h-4 mr-3 text-slate-600" /> Duplicate Machine
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 my-1" />
                   <DropdownMenuItem 
                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer py-3 font-medium rounded-xl transition-colors text-xs" 
                    onClick={() => setShowDelete(true)}
                  >
                    <Trash className="w-4 h-4 mr-3" /> Delete Estimator
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="pt-2">
              <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-1.5 overflow-hidden hover:bg-white transition-colors">
                {['asphalt', 'tile', 'metal', 'cedar'].map(key => {
                  const isEnabled = offeredMaterials.includes(key);
                  const price = materialPricing[key];
                  
                  return (
                    <div key={key} className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-white transition-all group/row",
                      !isEnabled && "opacity-60"
                    )}>
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          isEnabled ? "bg-red-600" : "bg-slate-300"
                        )} />
                         <span className={cn(
                          "text-[15px] font-medium capitalize",
                          isEnabled ? "text-[#0F172A]" : "text-slate-600"
                        )}>
                          {key.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[16px] font-semibold",
                        isEnabled ? "text-[#0F172A]" : "text-slate-300 font-semibold"
                      )}>
                        {price > 0 
                          ? `$${price.toFixed(2)}` 
                          : isEnabled 
                            ? <span className="text-[10px] text-slate-600 lowercase italic font-medium">pending</span>
                            : <span className="text-[9px] text-slate-300 uppercase tracking-widest font-semibold">off</span>
                        }
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <CardFooter className="p-8 pt-6 flex gap-3 relative z-10">
             <Link
              href={`/calculators/${calc.id}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-[7] basis-0 h-12 rounded-2xl font-bold text-[15px] bg-[#0F172A] hover:bg-black text-white shadow-xl shadow-slate-200 border-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              )}
            >
              <Pencil className="w-4 h-4 mr-2.5 opacity-70" />
              Configure
            </Link>
             <Button
              variant="outline"
              className="flex-[3] basis-0 h-12 rounded-2xl font-bold text-sm border-slate-200 text-slate-800 hover:bg-slate-50 hover:text-[#0F172A] hover:border-slate-300 transition-all flex items-center justify-center p-0"
              onClick={() => setShowShare(true)}
            >
              <ExternalLink className="w-5 h-5 opacity-90" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Delete Dialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="rounded-[2.5rem] border-slate-100 bg-white/95 backdrop-blur-xl font-sans p-8 !max-w-md">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
              <Trash className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="text-[24px] font-semibold text-[#0F172A] tracking-tight">Delete this estimator?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 font-medium">
              This will permanently delete the lead capture system and remove it from your dashboard. Any embedded widgets will stop working. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
           <AlertDialogFooter className="mt-8 gap-3 bg-transparent border-none p-0 mx-0 mb-0 flex flex-row justify-end items-center">
            <AlertDialogCancel className="rounded-2xl font-bold h-14 border-slate-100 text-slate-600 hover:bg-slate-50 px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl h-14 border-none shadow-xl shadow-red-600/20 px-6"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Estimator"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share / Embed Dialog */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent 
          className="w-[calc(100%-2.5rem)] sm:w-[90vw] md:w-full max-w-3xl lg:max-w-5xl rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border-slate-100 p-5 sm:p-10 lg:p-16 shadow-3xl bg-white font-sans overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
          closeButtonClassName="top-6 right-6 sm:top-12 sm:right-12 lg:top-16 lg:right-16"
        >
          <div className="absolute top-0 right-0 -mr-12 -mt-12 sm:-mr-20 sm:-mt-20 w-40 h-40 sm:w-80 sm:h-80 bg-red-50/50 rounded-full blur-2xl sm:blur-3xl -z-10" />
          
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm transition-all duration-500">
                <Share className="w-5 h-5 sm:w-7 sm:h-7 text-[#0F172A]" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-[22px] sm:text-[28px] font-semibold text-[#0F172A] tracking-tight truncate">
                  Deploy Machine
                </DialogTitle>
                 <DialogDescription className="text-[10px] sm:text-[16px] font-bold text-slate-600 uppercase tracking-[0.2em] truncate">
                  {calc.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-8 pt-10">
            <div className="space-y-3">
              <label className="text-[15px] font-semibold text-slate-600 tracking-[0.2em] uppercase px-1">Private Access Link</label>
              <div 
                className="relative group cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(`${origin}/widget/${calc.id}`)
                  setLinkCopied(true)
                  setTimeout(() => setLinkCopied(false), 2000)
                }}
              >
                <div className={cn(
                  "p-5 border rounded-3xl text-[17px] break-all pr-12 font-medium transition-all duration-500 relative overflow-hidden",
                  linkCopied 
                    ? "border-emerald-500 bg-emerald-50 text-[#0F172A]" 
                    : "border-slate-200 bg-slate-50 text-slate-600 group-hover:bg-white"
                )}>
                  {origin}/widget/{calc.id}
                </div>
                <div className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all border",
                  linkCopied ? "bg-emerald-500 border-emerald-500 text-white" : "text-slate-600 border-transparent"
                )}>
                  {linkCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 w-full">
              <div className="flex flex-col h-full">
                <label className="text-[15px] font-semibold text-slate-600 tracking-[0.2em] uppercase px-1 mb-3 sm:mb-4">Marketing QR Code</label>
                <div 
                  className="flex-1 p-5 sm:p-6 lg:p-10 bg-slate-50 border border-slate-200 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3rem] flex flex-col items-center justify-between gap-5 sm:gap-6 group hover:bg-white transition-all min-h-[320px] sm:min-h-[360px] w-full cursor-pointer hover:border-slate-300 shadow-sm hover:shadow-md duration-500"
                  onClick={handleDownloadQR}
                >
                  <div className="bg-white p-4 lg:p-6 rounded-[2rem] shadow-sm border border-slate-100 mt-2 shrink-0 transition-all group-hover:shadow-md">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${origin}/widget/${calc.id}`)}`} 
                      alt="QR Code"
                      className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 object-contain"
                    />
                  </div>
                  <div className="w-full space-y-5">
                    <Button 
                      variant="default" 
                      className="w-full h-14 rounded-2xl font-semibold text-[15px] uppercase tracking-widest bg-[#0F172A] text-white group-hover:bg-black flex items-center justify-center gap-3 transition-all duration-300 pointer-events-none shadow-xl shadow-slate-200 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-slate-300"
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </Button>
                     <p className="text-[16px] lg:text-[15px] text-slate-600 font-medium px-1 leading-relaxed text-center">
                      Put this on your truck, lawn signs, or business cards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <label className="text-[15px] font-semibold text-slate-600 tracking-[0.2em] uppercase px-1 mb-3 sm:mb-4">Embed Component Code</label>
                <div className="flex-1 p-5 sm:p-6 lg:p-10 bg-slate-50 border border-slate-200 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3rem] flex flex-col items-center justify-between gap-5 sm:gap-6 min-h-[320px] sm:min-h-[360px] group transition-all w-full">
                  <div 
                    className={cn(
                      "w-full flex-1 relative cursor-pointer group/code mt-1 sm:mt-2 overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem] border-2 transition-all duration-500 shrink-0 min-h-[160px] sm:min-h-[180px]",
                      embedCopied ? "border-emerald-500" : "border-transparent"
                    )}
                    onClick={handleCopy}
                  >
                    <textarea
                      readOnly
                      className={cn(
                        "w-full h-full p-5 lg:p-10 font-mono text-[11px] sm:text-[15px] lg:text-[15px] focus:outline-none resize-none leading-relaxed cursor-pointer transition-all duration-500",
                        embedCopied 
                          ? "bg-emerald-50 text-[#0F172A]" 
                          : "bg-[#1e293b] text-emerald-400"
                      )}
                      value={embedCode}
                    />
                    <div className={cn(
                      "absolute bottom-4 right-4 flex items-center justify-center transition-all",
                      embedCopied ? "opacity-100" : "opacity-0 group-hover/code:opacity-100"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-xl transition-all",
                        embedCopied ? "bg-emerald-500 text-white" : "bg-white text-[#0F172A] hover:bg-slate-50"
                      )}>
                        {embedCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full flex items-center justify-center gap-2">
                    <MousePointer2 className="w-4 h-4 text-emerald-500" />
                     <p className="text-[16px] lg:text-[15px] text-slate-600 font-medium leading-relaxed text-center">
                      Click anywhere on the code block to copy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
