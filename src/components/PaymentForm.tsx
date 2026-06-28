import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Sparkles, PlusCircle, Share2, Palette, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAccount } from 'wagmi';

interface PaymentFormProps {
  prefillTitle?: string;
  prefillDesc?: string;
  prefillKey?: string;
}

const THEMES = [
  { id: 'modern', name: 'Modern', desc: 'Sleek dark interface with deep accents', color: 'bg-purple-600' },
  { id: 'minimal', name: 'Minimal', desc: 'High-contrast, borders, clean typography', color: 'bg-slate-900' },
  { id: 'corporate', name: 'Corporate', desc: 'Solid, reliable, corporate secure feel', color: 'bg-blue-700' },
  { id: 'glass', name: 'Glass', desc: 'Glow, transparency & backdrop filters', color: 'bg-cyan-500' },
  { id: 'gradient', name: 'Gradient', desc: 'Vibrant double-gradient background', color: 'bg-gradient-to-r from-purple-600 to-cyan-400' },
];

export default function PaymentForm({ prefillTitle = '', prefillDesc = '', prefillKey = 'initial' }: PaymentFormProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  // Prefill hook
  useEffect(() => {
    setTitle(prefillTitle);
    setDescription(prefillDesc);
  }, [prefillTitle, prefillDesc, prefillKey]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !address) return;

    const params = new URLSearchParams({
      amount,
      address,
      ...(title && { title }),
      ...(description && { desc: description }),
      theme: selectedTheme, // Append selected theme to URL
    });

    const link = `${window.location.origin}/pay?${params.toString()}`;
    setGeneratedLink(link);
    setIsGenerated(true);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'AutoPay Payment Link',
          text: `Settle payment of ${amount} USDC on Arc Testnet`,
          url: generatedLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const resetForm = () => {
    setAmount('');
    setTitle('');
    setDescription('');
    setSelectedTheme('modern');
    setGeneratedLink('');
    setIsGenerated(false);
  };

  return (
    <div id="payment-form-section" className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!isGenerated ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl shadow-slate-900/[0.02] dark:shadow-none border border-slate-100 dark:border-slate-800/80 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100/30 dark:border-purple-900/10">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-[#22D3EE]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Create Invoice Link</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">Settle instant USDC links on Arc</p>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4.5 py-3.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-purple-500/5 focus:border-[#7C3AED] dark:focus:ring-purple-500/10 dark:focus:border-[#22D3EE] outline-none transition-all font-semibold text-lg text-slate-950 dark:text-white"
                    />
                    <div className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-sm select-none">
                      USDC
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Payment Title <span className="text-slate-400 dark:text-slate-600 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Consulting Services Invoice"
                    className="w-full px-4.5 py-3.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-purple-500/5 focus:border-[#7C3AED] dark:focus:ring-purple-500/10 dark:focus:border-[#22D3EE] outline-none transition-all text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Description <span className="text-slate-400 dark:text-slate-600 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide additional details or terms for the client..."
                    rows={2.5}
                    className="w-full px-4.5 py-3.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-purple-500/5 focus:border-[#7C3AED] dark:focus:ring-purple-500/10 dark:focus:border-[#22D3EE] outline-none transition-all resize-none text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                  />
                </div>

                {/* FEATURE 2: Payment Theme Selector */}
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3.5">
                    <Palette className="w-3.5 h-3.5 text-purple-500" />
                    Visual Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTheme(t.id)}
                        className={cn(
                          "flex flex-col items-center p-2.5 rounded-xl border transition-all relative cursor-pointer",
                          selectedTheme === t.id
                            ? "bg-purple-500/5 border-purple-500 dark:border-[#22D3EE] ring-2 ring-purple-500/10"
                            : "bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                        title={t.desc}
                      >
                        <div className={cn("w-5 h-5 rounded-full mb-1.5 shadow-xs border border-white/20", t.color)} />
                        <span className={cn(
                          "text-[9px] font-extrabold tracking-wide",
                          selectedTheme === t.id ? "text-purple-600 dark:text-[#22D3EE]" : "text-slate-500 dark:text-slate-400"
                        )}>
                          {t.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!address}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 dark:bg-[#7C3AED] dark:hover:bg-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/10 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs mt-2"
                >
                  {address ? 'Generate Link' : 'Connect Wallet to Generate'}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl shadow-slate-900/[0.02] dark:shadow-none border border-slate-100 dark:border-slate-800/80 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100/30 dark:border-emerald-950/10">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-[#22C55E]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Workspace Link Ready</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">Settleable payment URL generated</p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Create another link"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center bg-slate-50 dark:bg-[#0F172A]/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-850/40">
                  <div className="bg-white p-3.5 rounded-2xl shadow-xs mb-4">
                    <QRCodeSVG value={generatedLink} size={180} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">AutoPay Invoice QR</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dynamic Payment Link</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs text-slate-600 dark:text-[#CBD5E1] font-mono truncate">
                      {generatedLink}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={cn(
                        "p-3.5 rounded-xl transition-all active:scale-90 cursor-pointer",
                        copied ? "bg-emerald-500 text-white" : "bg-purple-600 dark:bg-[#7C3AED] hover:bg-purple-700 dark:hover:bg-purple-600 text-white"
                      )}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-[#0F172A] text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-transparent dark:border-slate-800/40 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-slate-500" />
                    Share Link
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex items-center justify-center gap-2 py-3.5 bg-purple-600 dark:bg-[#7C3AED] hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-xl font-bold transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Create New
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
