"use client"

import { useState } from "react"
import { Calculator, MoreHorizontal, Copy, Trash, Pencil, Share, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteCalculator, duplicateCalculator } from "@/app/actions/calculator"

export default function CalculatorCard({ calc, onDelete, onRename, onDuplicate }: {
  calc: any
  onDelete?: (id: string) => void
  onRename?: (id: string, name: string) => void
  onDuplicate?: (obj: any) => void
}) {
  const [showDelete, setShowDelete] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)


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
    setIsActionLoading(true)
    try {
      const newCalc = await duplicateCalculator(calc.id)
      if (onDuplicate && newCalc && newCalc.length > 0) onDuplicate(newCalc[0])
    } catch (err) { console.error(err) }
    finally { setIsActionLoading(false) }
  }

  const embedCode = `<iframe src="https://getquotecatch.com/widget/${calc.id}" width="100%" height="640" style="border:none; border-radius: 24px; overflow:hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08);" title="Roofing Estimate"></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pricing = Object.entries(calc.config_json?.materials || {})
    .filter(([key]) => key !== 'metal')
    .map(([key, value]) => ({
      label: key === 'asphalt' ? 'Asphalt' : key === 'tile' ? 'Tiles' : key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      value: value as number
    }))

  return (
    <>
      <Card className="flex flex-col bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative group rounded-[1.5rem] overflow-hidden cursor-default font-sans">
        {/* Hover shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.5rem]" />

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-4 right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 z-20 hover:bg-slate-100 w-9 h-9 rounded-xl inline-flex items-center justify-center outline-none cursor-pointer">
            <MoreHorizontal className="w-4 h-4 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-xl border-slate-100 bg-white font-sans">
            <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer py-2.5 font-semibold text-slate-700 focus:bg-slate-50 focus:text-slate-900 rounded-xl m-1">
              <Copy className="w-4 h-4 mr-2.5 text-slate-400" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100 my-1" />
            <DropdownMenuItem className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2.5 font-semibold rounded-xl m-1" onClick={() => setShowDelete(true)}>
              <Trash className="w-4 h-4 mr-2.5" /> Disable Widget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CardHeader className="pb-4 mb-1 pr-10 relative z-10 pt-6 px-6">
          <div className="w-12 h-12 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:bg-red-100 group-hover:scale-105 duration-300 border border-red-100">
            <Calculator className="w-6 h-6" />
          </div>
          <CardTitle className="text-[20px] lg:text-[22px] font-black tracking-tight line-clamp-1 text-slate-900">{calc.name}</CardTitle>
          <CardDescription className="line-clamp-1 mt-1 text-[14px] lg:text-[15px] font-semibold text-slate-400">
            Custom Lead Estimator · Active
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 space-y-2 relative z-10 px-6">
          {pricing.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center bg-slate-50 px-4 py-2.5 lg:py-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-semibold text-[14px] lg:text-[15px]">{label}</span>
              <span className="font-black text-slate-900 text-[15px] lg:text-[16px]">
                ${value?.toFixed(2)}<span className="text-slate-400 font-medium text-[12px] lg:text-[13px] ml-1">/sq ft</span>
              </span>
            </div>
          ))}
        </CardContent>

        <CardFooter className="border-t border-slate-100 bg-slate-50/60 p-4 gap-3 relative z-10 flex mt-4">
          <Link
            href={`/calculators/${calc.id}`}
            className={buttonVariants({ variant: "outline", className: "flex-1 border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 shadow-none rounded-xl font-bold transition-all h-10 lg:h-11 text-[14px] lg:text-[15px]" })}
          >
            <Pencil className="w-4 h-4 mr-2 text-slate-400" />
            Edit
          </Link>
          <Button
            variant="default"
            className="flex-1 bg-slate-900 hover:bg-black text-white font-bold shadow-sm rounded-xl transition-all h-10 lg:h-11 border-none text-[14px] lg:text-[15px]"
            onClick={() => setShowShare(true)}
          >
            <Share className="w-4 h-4 mr-2" />
            Embed
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="rounded-3xl border-slate-100 bg-white font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[22px] font-black text-slate-900">Disable this engine?</AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-slate-500 mt-2 leading-relaxed font-medium">
              This instantly turns off your active public widget. Any embedded links will show an "unavailable" message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-2xl font-bold h-12 border-slate-200 text-slate-700 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl h-12 shadow-[0_4px_14px_rgba(239,68,68,0.3)] border-none"
              disabled={isDeleting}
            >
              {isDeleting ? "Disabling..." : "Yes, disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share / Embed Dialog */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="max-w-lg rounded-3xl border-slate-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] bg-white font-sans">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-slate-600" />
              </div>
              Embed Your Engine
            </DialogTitle>
            <DialogDescription className="text-[15px] pt-1 text-slate-500 font-medium leading-relaxed">
              Paste this into WordPress, Webflow, GoHighLevel, or any CMS.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 pt-5">
            <div className="space-y-2.5">
              <label className="text-[14px] font-black text-slate-400 tracking-widest uppercase">Direct Link</label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] text-slate-700 break-all select-all font-mono font-medium">
                https://getquotecatch.com/widget/{calc.id}
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[14px] font-black text-slate-400 tracking-widest uppercase">Embed Snippet</label>
              <div className="relative">
                <textarea
                  readOnly
                  className="w-full h-32 p-5 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[14px] focus:outline-none resize-none leading-relaxed border-0"
                  value={embedCode}
                />
                <Button
                  size="sm"
                  className={`absolute bottom-4 right-4 font-bold border-0 shadow-lg transition-all rounded-xl h-9 px-3.5 text-[14px] ${copied ? 'bg-emerald-500 text-white' : 'bg-white hover:bg-slate-100 text-slate-900'}`}
                  onClick={handleCopy}
                >
                  <Copy className="w-4 h-4 mr-1.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
