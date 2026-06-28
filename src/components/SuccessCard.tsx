import { useLocation, Link } from 'react-router-dom';
import { Check, Copy, ExternalLink, ArrowLeft, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { arcTestnet } from '../lib/arc';

export default function SuccessCard() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const { hash, amount, title, timestamp } = location.state || {};

  const copyHash = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hash) {
    return (
      <div className="text-center py-20 px-4 select-none">
        <p className="text-slate-500 dark:text-[#CBD5E1] font-semibold mb-4">No recent settlement record detected.</p>
        <Link to="/" className="text-purple-600 dark:text-[#22D3EE] font-extrabold hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl shadow-slate-900/[0.02] dark:shadow-none border border-slate-100 dark:border-slate-800/80 overflow-hidden"
    >
      {/* Visual Header */}
      <div className="p-8 text-center bg-purple-500/5 dark:bg-purple-500/10 border-b border-slate-100 dark:border-slate-800/60 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-500/5 to-transparent" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
          className="w-20 h-20 bg-emerald-500 dark:bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-black text-slate-900 dark:text-[#F8FAFC] mb-2 font-sans tracking-tight">
          Payment Successful
        </h2>
        <p className="text-[#22C55E] font-extrabold uppercase tracking-widest text-xs select-none">
          Settlement Confirmed
        </p>
      </div>

      <div className="p-8 space-y-6">
        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4 items-end bg-slate-50 dark:bg-[#0F172A]/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-850/40">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Amount Paid</p>
            <p className="text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">{amount} USDC</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Timestamp</p>
            <p className="text-xs font-bold text-slate-700 dark:text-[#CBD5E1]">
              {new Date(timestamp).toLocaleDateString()} at {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Invoice Title Info */}
        {title && (
          <div className="px-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Payment Title</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-[#CBD5E1]">{title}</p>
          </div>
        )}

        {/* Hash details */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Transaction Hash</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-mono text-slate-600 dark:text-[#CBD5E1] truncate">
                {hash}
              </div>
              <button
                onClick={copyHash}
                className={cn(
                  "p-3.5 rounded-xl transition-all active:scale-90 cursor-pointer",
                  copied ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-[#0F172A] border border-transparent dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <a
            href={`${arcTestnet.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 text-xs font-extrabold text-purple-600 dark:text-[#22D3EE] hover:bg-purple-500/5 dark:hover:bg-cyan-500/5 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/40 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            View on ArcScan
            <ExternalLink className="w-4 h-4 text-purple-500 dark:text-cyan-400" />
          </a>
        </div>

        {/* Done / Return Action */}
        <div className="pt-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-purple-600 hover:bg-purple-700 dark:bg-[#7C3AED] dark:hover:bg-purple-600 text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-purple-500/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Done
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
