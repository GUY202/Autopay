import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Asterisk, 
  History, 
  QrCode, 
  Settings as SettingsIcon, 
  X, 
  Camera, 
  Sparkles, 
  Check, 
  RefreshCw, 
  User, 
  Network 
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'qr' | 'settings' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Settings states (placeholders)
  const [workspaceName, setWorkspaceName] = useState('My Workspace');
  const [defaultCurrency, setDefaultCurrency] = useState('USDC');
  const [isSaved, setIsSaved] = useState(false);

  // Mock scan QR states
  const [isScanning, setIsScanning] = useState(true);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleAction = (type: 'create' | 'recent' | 'qr' | 'settings') => {
    setIsOpen(false);
    if (type === 'create') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      setTimeout(() => {
        const element = document.getElementById('payment-form-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (type === 'recent') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      setTimeout(() => {
        const element = document.getElementById('transaction-history-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (type === 'qr') {
      setIsScanning(true);
      setScanSuccess(false);
      setActiveModal('qr');
    } else if (type === 'settings') {
      setIsSaved(false);
      setActiveModal('settings');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setActiveModal(null);
    }, 1500);
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setTimeout(() => {
        setActiveModal(null);
      }, 1500);
    }, 2500);
  };

  return (
    <>
      {/* Backdrop for open FAB menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button & Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
        {/* Floating Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-950/10 p-3 min-w-[200px] flex flex-col gap-1"
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-50 dark:border-slate-800/60 mb-1.5">
                Quick Access
              </div>

              <button
                onClick={() => handleAction('create')}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-purple-600 dark:hover:text-[#22D3EE] transition-all text-left cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-500 dark:text-[#22D3EE]" />
                Create Payment
              </button>

              <button
                onClick={() => handleAction('recent')}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-purple-600 dark:hover:text-[#22D3EE] transition-all text-left cursor-pointer"
              >
                <History className="w-4 h-4 text-purple-500 dark:text-[#22D3EE]" />
                Recent Payments
              </button>

              <button
                onClick={() => handleAction('qr')}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-purple-600 dark:hover:text-[#22D3EE] transition-all text-left cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-purple-500 dark:text-[#22D3EE]" />
                Scan QR Code
              </button>

              <button
                onClick={() => handleAction('settings')}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-purple-600 dark:hover:text-[#22D3EE] transition-all text-left cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 text-purple-500 dark:text-[#22D3EE]" />
                Workspace Settings
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Action Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-colors duration-200",
            isOpen 
              ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" 
              : "bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-slate-950 shadow-cyan-500/20"
          )}
          aria-label="Toggle floating menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {isOpen ? <X className="w-6 h-6 text-white" /> : <Asterisk className="w-7 h-7 text-slate-900" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Modal overlays for QR & Settings */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeModal === 'qr' ? (
                    <QrCode className="w-5 h-5 text-purple-600 dark:text-[#22D3EE]" />
                  ) : (
                    <SettingsIcon className="w-5 h-5 text-purple-600 dark:text-[#22D3EE]" />
                  )}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeModal === 'qr' ? 'Scan AutoPay QR' : 'Workspace Settings'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {activeModal === 'qr' && (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="relative w-48 h-48 border-2 border-dashed border-[#22D3EE] rounded-2xl flex items-center justify-center overflow-hidden mb-6 bg-slate-50 dark:bg-[#0F172A]">
                      {isScanning ? (
                        <>
                          <div className="absolute inset-x-0 top-0 h-1 bg-[#22D3EE] animate-bounce shadow-md shadow-cyan-400" />
                          <Camera className="w-12 h-12 text-slate-400 dark:text-slate-600 animate-pulse" />
                        </>
                      ) : scanSuccess ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                            <Check className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-emerald-500">QR Code Detected!</span>
                        </div>
                      ) : (
                        <QrCode className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                      )}
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-6">
                      {isScanning 
                        ? "Point your camera at any AutoPay QR code to automatically parse the payment invoice link."
                        : scanSuccess 
                          ? "Redirecting you to the payment workspace..."
                          : "Simulate a real-time QR code scan using your local camera interface."
                      }
                    </p>

                    {isScanning ? (
                      <button
                        onClick={simulateScan}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Simulate Scan Detection
                      </button>
                    ) : !scanSuccess ? (
                      <button
                        onClick={() => setIsScanning(true)}
                        className="px-6 py-2.5 bg-[#22D3EE] hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Scan Again
                      </button>
                    ) : null}
                  </div>
                )}

                {activeModal === 'settings' && (
                  <form onSubmit={handleSaveSettings} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Workspace Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={workspaceName}
                          onChange={(e) => setWorkspaceName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-[#22D3EE] text-sm dark:text-white"
                        />
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Default Settlement Token
                      </label>
                      <div className="relative">
                        <select
                          value={defaultCurrency}
                          onChange={(e) => setDefaultCurrency(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-[#22D3EE] text-sm dark:text-white cursor-pointer"
                        >
                          <option value="USDC">USDC (USD Coin)</option>
                          <option value="USDT">USDT (Tether)</option>
                          <option value="EURC">EURC (Euro Coin)</option>
                        </select>
                        <Network className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Settings are saved locally on this device. Your AutoPay instance automatically syncs workspace preferences across sessions.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaved}
                      className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 dark:bg-[#7C3AED] dark:hover:bg-purple-600 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Preferences Saved!
                        </>
                      ) : (
                        'Save Preferences'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
