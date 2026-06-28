import { useState, useEffect, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import { parseUnits, isAddress } from 'viem';
import { ERC20_ABI, arcTestnet, USDC_CONFIG } from '../lib/arc';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, ShieldCheck, AlertCircle, Wallet, QrCode, FileText, Building, Layers, Eye, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { logTransaction, updateTransactionStatus } from '../lib/transactions';

interface PaymentData {
  amount: string;
  recipient: string;
  title?: string;
  description?: string;
}

export default function PaymentCard() {
  const { address: payerAddress, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const navigate = useNavigate();
  const location = useLocation();

  const payment = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const amountParam = params.get('amount');
    const recipientAddress = params.get('address');
    const title = params.get('title');
    const description = params.get('desc');

    if (!amountParam || !recipientAddress || !isAddress(recipientAddress)) {
      return null;
    }

    return {
      amount: amountParam,
      recipient: recipientAddress,
      title: title || undefined,
      description: description || undefined,
    } as PaymentData;
  }, [location.search]);

  // Read theme from query parameter
  const selectedTheme = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('theme') || 'modern';
  }, [location.search]);

  const [showQR, setShowQR] = useState(false);
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isConfirmError } = useWaitForTransactionReceipt({ hash });

  const amountInUnits = useMemo(() => {
    if (!payment?.amount) return 0n;
    try {
      return parseUnits(payment.amount.toString(), USDC_CONFIG.decimals);
    } catch (e) {
      console.error("Error parsing amount:", e);
      return 0n;
    }
  }, [payment?.amount]);

  const isInvalidAmount = amountInUnits === 0n;

  useEffect(() => {
    if (hash && payment && payerAddress) {
      if (isSuccess) {
        updateTransactionStatus(hash, 'success');
        
        navigate('/success', { 
          state: { 
            hash, 
            amount: payment?.amount, 
            title: payment?.title,
            timestamp: new Date().toISOString()
          } 
        });
      } else if (isConfirmError) {
        updateTransactionStatus(hash, 'failed');
      }
    }
  }, [isSuccess, isConfirmError, hash, navigate, payment, payerAddress]);

  const handlePay = () => {
    if (!payment || !payerAddress) return;

    const recipientAddress = payment.recipient;
    const amountParam = payment.amount;

    console.log("Recipient:", recipientAddress);
    console.log("Amount (raw):", amountParam);
    console.log("Amount (parsed):", amountInUnits.toString());

    if (isInvalidAmount) {
      console.error("Invalid payment amount: 0");
      return;
    }

    writeContract({
      address: USDC_CONFIG.address, 
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [
        recipientAddress as `0x${string}`, 
        amountInUnits, 
      ],
      account: payerAddress,
      chain: arcTestnet,
      chainId: arcTestnet.id,
    }, {
      onSuccess: (txHash) => {
        logTransaction({
          type: 'sent',
          amount: amountParam,
          to: recipientAddress,
          txHash,
          status: 'pending',
          timestamp: new Date().toISOString()
        });
      }
    });
  };

  if (!payment) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-[#1E293B] rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Invalid Invoice Link</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">This link contains malformed routing coordinates or addresses.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const isProcessing = isWritePending || isConfirming;

  const styleMap = {
    modern: {
      card: "bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl",
      accentBadge: "bg-purple-500/10 text-purple-700 dark:text-[#22D3EE] border-purple-500/25",
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5" />,
      amountText: "text-slate-900 dark:text-white",
      recipientBox: "bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-200/50 dark:border-slate-850/40",
      infoGrid: "bg-slate-50 dark:bg-[#0F172A]/40 border border-slate-100 dark:border-slate-850/20",
      button: "bg-purple-600 hover:bg-purple-700 dark:bg-[#7C3AED] dark:hover:bg-purple-600 text-white shadow-lg shadow-purple-500/10",
      qrText: "text-purple-600 dark:text-[#22D3EE]",
    },
    minimal: {
      card: "bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-slate-800 rounded-none shadow-none font-mono",
      accentBadge: "bg-transparent text-slate-950 dark:text-slate-200 border border-slate-950 dark:border-slate-700",
      badgeIcon: <FileText className="w-3.5 h-3.5" />,
      amountText: "text-slate-950 dark:text-slate-100 font-mono",
      recipientBox: "bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none",
      infoGrid: "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none",
      button: "bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-950 rounded-none border border-slate-950",
      qrText: "text-slate-950 dark:text-slate-300 underline",
    },
    corporate: {
      card: "bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-md border-t-8 border-t-purple-600",
      accentBadge: "bg-blue-500/5 text-blue-700 dark:text-blue-400 border border-blue-500/10",
      badgeIcon: <Building className="w-3.5 h-3.5" />,
      amountText: "text-slate-900 dark:text-slate-100",
      recipientBox: "bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-200 dark:border-slate-800 rounded-lg",
      infoGrid: "bg-slate-50 dark:bg-[#0F172A]/30 border border-slate-200 dark:border-slate-800 rounded-lg",
      button: "bg-[#7C3AED] hover:bg-purple-700 text-white rounded-lg shadow-md font-sans tracking-wide",
      qrText: "text-slate-600 dark:text-slate-400 hover:underline",
    },
    glass: {
      card: "bg-white/40 dark:bg-slate-900/35 backdrop-blur-xl border border-white/25 dark:border-slate-800/50 rounded-3xl shadow-2xl relative overflow-hidden",
      accentBadge: "bg-white/10 text-purple-750 dark:text-cyan-300 border border-white/20 dark:border-slate-700/40",
      badgeIcon: <Layers className="w-3.5 h-3.5" />,
      amountText: "text-slate-900 dark:text-cyan-100",
      recipientBox: "bg-white/10 dark:bg-slate-950/20 border border-white/10 dark:border-slate-800/20 backdrop-blur-md",
      infoGrid: "bg-white/10 dark:bg-slate-950/10 border border-white/10 dark:border-slate-800/10 backdrop-blur-md",
      button: "bg-gradient-to-r from-purple-500/95 to-cyan-500/95 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl shadow-xl",
      qrText: "text-cyan-600 dark:text-cyan-400",
    },
    gradient: {
      card: "bg-slate-900 border border-slate-800/50 rounded-3xl shadow-2xl text-white",
      accentBadge: "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-purple-500/30",
      badgeIcon: <Star className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />,
      amountText: "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent",
      recipientBox: "bg-slate-950/80 border border-slate-800 rounded-2xl",
      infoGrid: "bg-slate-950/60 border border-slate-850 rounded-2xl",
      button: "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-2xl shadow-lg shadow-purple-500/10 border border-purple-500/20",
      qrText: "text-cyan-400 hover:text-cyan-300",
    },
  };

  const themeStyles = styleMap[selectedTheme as 'modern' | 'minimal' | 'corporate' | 'glass' | 'gradient'] || styleMap.modern;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative backdrop blobs for glassmorphism */}
      {selectedTheme === 'glass' && (
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="absolute top-10 left-10 w-44 h-44 bg-purple-500/25 rounded-full blur-3xl pointer-events-none select-none animate-pulse" />
          <div className="absolute bottom-10 right-10 w-44 h-44 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none select-none" />
        </div>
      )}

      {/* Main Payment Card Container */}
      <div className={selectedTheme === 'gradient' ? "p-[2px] bg-gradient-to-tr from-purple-600 via-[#7C3AED] to-cyan-400 rounded-3xl shadow-xl" : ""}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("w-full overflow-hidden", themeStyles.card)}
        >
          {/* Top Section */}
          <div className="p-8 text-center border-b border-slate-100/60 dark:border-slate-800/40">
            <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-bold uppercase tracking-wider mb-6", themeStyles.accentBadge)}>
              {themeStyles.badgeIcon}
              Secure Invoice Request
            </div>
            
            <h2 className="text-xs font-bold text-slate-400 dark:text-[#CBD5E1]/70 uppercase tracking-[0.15em] mb-2">Amount Due</h2>
            <div className="flex items-baseline justify-center gap-2">
              <span className={cn("text-6xl sm:text-7xl font-extrabold tracking-tight", themeStyles.amountText)}>
                {payment.amount}
              </span>
              <span className="text-xl font-bold text-slate-400 dark:text-slate-500 uppercase">USDC</span>
            </div>
     
            <div className={cn("mt-8 p-4 rounded-2xl", themeStyles.recipientBox)}>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 select-none">Recipient Coordinate</p>
              <p className="text-xs font-mono text-slate-600 dark:text-[#CBD5E1] break-all">
                {payment.recipient}
              </p>
            </div>
          </div>
     
          {/* Middle Body Section */}
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-[#F8FAFC] mb-1.5">
                {payment.title || 'Payment Invoice'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-[#CBD5E1] leading-relaxed">
                {payment.description || 'No additional instructions provided for this transaction.'}
              </p>
            </div>
     
            <div className={cn("rounded-2xl p-4.5 space-y-3.5", themeStyles.infoGrid)}>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Settlement Chain</span>
                <span className="text-slate-950 dark:text-[#F8FAFC] font-bold">Arc Testnet</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Asset Class</span>
                <span className="text-slate-950 dark:text-[#F8FAFC] font-bold">USDC (ERC20)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Transaction Fee</span>
                <span className="text-[#22C55E] dark:text-[#22C55E] font-black">Near Zero</span>
              </div>
            </div>
     
            {/* Toggle QR code */}
            <div className="flex justify-center select-none">
              <button
                onClick={() => setShowQR(!showQR)}
                className={cn("text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer", themeStyles.qrText)}
              >
                <QrCode className="w-4 h-4" />
                {showQR ? 'Hide Invoice QR' : 'Show Invoice QR'}
              </button>
            </div>
     
            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={cn("flex flex-col items-center p-4.5 rounded-2xl border", themeStyles.recipientBox)}
                >
                  <div className="bg-white p-2.5 text-black rounded-xl shadow-xs">
                    <QRCodeSVG value={window.location.href} size={140} />
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">Checkout QR Code</span>
                </motion.div>
              )}
            </AnimatePresence>
     
            {writeError && (
              <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl flex gap-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">{(writeError as any).shortMessage || writeError.message}</p>
              </div>
            )}
     
            {isInvalidAmount && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl flex gap-3 text-amber-650 dark:text-amber-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">Invalid payment amount requested</p>
              </div>
            )}
     
            {isConnected && !isInvalidAmount && (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Paying <span className="font-black text-slate-900 dark:text-[#F8FAFC]">{payment.amount} USDC</span> to <span className="font-mono text-purple-600 dark:text-[#22D3EE]">{payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}</span>
              </p>
            )}
     
            {/* Pay Button Trigger */}
            {!isConnected ? (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className={cn("w-full py-4 font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer", themeStyles.button)}
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet to Settle
              </button>
            ) : (
              <button
                onClick={handlePay}
                disabled={isProcessing || isInvalidAmount}
                className={cn(
                  "w-full py-4 font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer",
                  themeStyles.button,
                  (isProcessing || isInvalidAmount) && "opacity-80 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isConfirming ? 'Securing Settlement...' : 'Constructing Tx...'}
                  </>
                ) : isInvalidAmount ? (
                  'Zero Amount Invalid'
                ) : (
                  'Approve & Settle'
                )}
              </button>
            )}
            
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium select-none">
              AutoPay settle endpoints are secured by the decentralized Arc protocol.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
