import { useEffect, useState } from 'react';
import { Transaction } from '../lib/transactions';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, ExternalLink, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { arcTestnet } from '../lib/arc';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = () => {
      const txs = JSON.parse(localStorage.getItem('transactions') || '[]');
      setTransactions(txs);
    };

    loadTransactions();
    const interval = setInterval(loadTransactions, 2000);
    return () => clearInterval(interval);
  }, []);

  if (transactions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 p-10 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No transactions recorded</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
          Your settlement history will sync automatically once payments are processed on Arc Testnet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 px-4 sm:px-0 select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Transaction History</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Real-time ledger updates from Arc Testnet</p>
        </div>
        <span className="text-[10px] font-extrabold text-purple-600 dark:text-[#22D3EE] bg-purple-500/5 dark:bg-cyan-500/5 px-2.5 py-1 rounded-md border border-purple-500/10 dark:border-cyan-500/10 uppercase tracking-widest">
          Active Workspace
        </span>
      </div>

      <div className="space-y-3.5">
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between group hover:border-purple-500/20 dark:hover:border-purple-500/20 hover:shadow-lg hover:shadow-slate-950/[0.01] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                tx.type === 'sent' 
                  ? "bg-amber-500/10 text-[#F59E0B]" 
                  : "bg-emerald-500/10 text-[#22C55E]"
              )}>
                {tx.type === 'sent' ? <ArrowUpRight className="w-5 h-5 animate-pulse" /> : <ArrowDownLeft className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-base">
                    {tx.type === 'sent' ? 'Settle Sent' : 'Settle Received'} {tx.amount} USDC
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {tx.type === 'sent' ? `To: ${tx.to?.slice(0, 6)}...${tx.to?.slice(-4)}` : `From: ${tx.from?.slice(0, 6)}...${tx.from?.slice(-4)}`}
                  <span className="mx-2 text-slate-200 dark:text-slate-800 select-none">•</span>
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <a
              href={`${arcTestnet.blockExplorers.default.url}/tx/${tx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-slate-400 hover:text-purple-600 dark:hover:text-[#22D3EE] bg-slate-50 dark:bg-[#0F172A]/40 hover:bg-slate-100 dark:hover:bg-[#0F172A] rounded-xl border border-slate-100/10 dark:border-transparent transition-all cursor-pointer"
              title="View on ArcScan"
            >
              <ExternalLink className="w-4.5 h-4.5" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-[#F59E0B] rounded-md text-[9px] font-extrabold uppercase tracking-wider select-none border border-amber-500/15">
          <Clock className="w-2.5 h-2.5 animate-spin" />
          Pending
        </span>
      );
    case 'success':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-[#22C55E] rounded-md text-[9px] font-extrabold uppercase tracking-wider select-none border border-emerald-500/15">
          <CheckCircle2 className="w-2.5 h-2.5" />
          Success
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-[#EF4444] rounded-md text-[9px] font-extrabold uppercase tracking-wider select-none border border-red-500/15">
          <XCircle className="w-2.5 h-2.5" />
          Failed
        </span>
      );
    default:
      return null;
  }
}
