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
  Zap
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
  const embedCode = `<iframe src="${origin}/widget/${calc.id}" width="100%" height="640" style="border:none; border-radius: 24px; overflow:hidden;" title="Roofing Estimate"></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  const offeredMaterials = calc.config_json?.offered_materials || [];
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
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active System</span>
            </div>
          </div>

          <CardHeader className="pt-16 pb-4 px-8 relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-[22px] font-black tracking-tighter text-[#0F172A] group-hover:text-red-700 transition-colors duration-300">
                  {calc.name}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  Automated Capturing Engine
                </CardDescription>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-10 w-10 rounded-2xl bg-slate-50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm flex items-center justify-center -mt-2"
                )}>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl shadow-2xl border-slate-100 bg-white/95 backdrop-blur-xl font-sans">
                  <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer py-3 font-bold text-slate-700 focus:bg-slate-50 focus:text-red-700 rounded-xl transition-colors">
                    <Copy className="w-4 h-4 mr-3 text-slate-400" /> Duplicate Machine
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 my-1" />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer py-3 font-bold rounded-xl transition-colors" 
                    onClick={() => setShowDelete(true)}
                  >
                    <Trash className="w-4 h-4 mr-3" /> Disable System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-8 pt-2 space-y-6 relative z-10">
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Live Inventory & Rates</h4>
              <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-2 overflow-hidden hover:bg-white transition-colors">
                {['asphalt', 'tile', 'metal', 'cedar'].map(key => {
                  const isEnabled = offeredMaterials.includes(key);
                  const price = materialPricing[key];
                  
                  return (
                    <div key={key} className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white transition-all group/row",
                      !isEnabled && "opacity-60"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          isEnabled ? "bg-red-600" : "bg-slate-300"
                        )} />
                        <span className={cn(
                          "text-[14px] font-bold capitalize",
                          isEnabled ? "text-[#0F172A]" : "text-slate-400"
                        )}>
                          {key.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[15px] font-black",
                        isEnabled ? "text-[#0F172A]" : "text-slate-400 font-bold"
                      )}>
                        {price > 0 ? `$${price.toFixed(2)}/sq` : <span className="text-[11px] text-slate-400 lowercase italic font-medium">pending config</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0 flex gap-3 relative z-10">
            <Link
              href={`/calculators/${calc.id}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-[7] basis-0 h-12 rounded-2xl font-black text-[15px] bg-[#0F172A] hover:bg-black text-white shadow-xl shadow-slate-200 border-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              )}
            >
              <Pencil className="w-4 h-4 mr-2.5 opacity-70" />
              Configure
            </Link>
            <Button
              variant="outline"
              className="flex-[3] basis-0 h-12 rounded-2xl font-bold text-sm border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#0F172A] hover:border-slate-300 transition-all flex items-center justify-center p-0"
              onClick={() => setShowShare(true)}
            >
              <ExternalLink className="w-5 h-5" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Delete Dialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="rounded-[2.5rem] border-slate-100 bg-white/95 backdrop-blur-xl font-sans p-8">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
              <Trash className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="text-[24px] font-black text-[#0F172A] tracking-tight">Disable this machine?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              This will instantly deactivate the lead capture system. Any embedded widgets will show an unavailable message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-2xl font-black h-14 border-slate-100 text-slate-500 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl h-14 border-none shadow-xl shadow-red-600/20"
              disabled={isDeleting}
            >
              {isDeleting ? "Disabling..." : "Yes, disable machine"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share / Embed Dialog */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="max-w-xl rounded-[3rem] border-slate-100 p-10 shadow-3xl bg-white font-sans overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-red-50/50 rounded-full blur-3xl -z-10" />
          
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center">
                <Share className="w-6 h-6 text-[#0F172A]" />
              </div>
              <div>
                <DialogTitle className="text-[28px] font-black text-[#0F172A] tracking-tight">
                  Deploy Machine
                </DialogTitle>
                <DialogDescription className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] pt-1">
                  {calc.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-8 pt-10">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase px-1">Private Access Link</label>
              <div 
                className="relative group cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(`${origin}/widget/${calc.id}`)
                  setLinkCopied(true)
                  setTimeout(() => setLinkCopied(false), 2000)
                }}
              >
                <div className={cn(
                  "p-5 bg-slate-50 border rounded-3xl text-[15px] text-slate-600 break-all pr-12 font-bold transition-all group-hover:bg-white",
                  linkCopied ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200"
                )}>
                  {origin}/widget/{calc.id}
                </div>
                <div className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all border",
                  linkCopied ? "bg-emerald-500 border-emerald-500 text-white" : "text-slate-400 border-transparent"
                )}>
                  {linkCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase px-1">Embed Component Code</label>
              <div 
                className="relative cursor-pointer group"
                onClick={handleCopy}
              >
                <textarea
                  readOnly
                  className={cn(
                    "w-full h-36 p-6 rounded-[2rem] font-mono text-[13px] focus:outline-none resize-none leading-relaxed border-2 transition-all cursor-pointer",
                    embedCopied ? "bg-emerald-900/10 border-emerald-500 text-emerald-700" : "bg-[#1e293b] text-emerald-400 border-transparent"
                  )}
                  value={embedCode}
                />
                <div className={cn(
                  "absolute bottom-4 right-4 font-black rounded-xl h-10 px-6 flex items-center justify-center transition-all",
                  embedCopied ? "bg-emerald-500 text-white shadow-lg" : "bg-white text-[#0F172A] opacity-0 group-hover:opacity-100 shadow-xl"
                )}>
                  {embedCopied ? "Copied!" : "Copy Code"}
                </div>
              </div>
              <p className="text-[12px] text-slate-400 font-bold px-2 flex items-center gap-2">
                <MousePointer2 className="w-3.5 h-3.5 text-emerald-500" />
                Click anywhere on the code to copy
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
