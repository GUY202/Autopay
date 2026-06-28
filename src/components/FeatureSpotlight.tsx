import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FilePlus, Share2, Wallet, CheckCircle2 } from 'lucide-react';

interface WorkflowStep {
  id: string;
  icon: typeof FilePlus;
  num: string;
  title: string;
  description: string;
}

const STEPS: WorkflowStep[] = [
  {
    id: 'create',
    icon: FilePlus,
    num: '01',
    title: 'Create Request',
    description: 'Select a workspace preset or enter custom details to generate a secure USDC payment link instantly.',
  },
  {
    id: 'share',
    icon: Share2,
    num: '02',
    title: 'Share Anywhere',
    description: 'Send the dynamic billing URL or present the high-fidelity QR code to your payer.',
  },
  {
    id: 'pay',
    icon: Wallet,
    num: '03',
    title: 'One-Click Pay',
    description: 'The payer connects their wallet on the optimized checkout page and approves the transaction.',
  },
  {
    id: 'complete',
    icon: CheckCircle2,
    num: '04',
    title: 'Instant Settle',
    description: 'Funds settle on the secure Arc Testnet within seconds, directly routing to your private key wallet.',
  },
];

export default function FeatureSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % STEPS.length);
      }, 3500); // Transitions every 3.5 seconds
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovered]);

  const activeStep = STEPS[activeIndex];
  const IconComponent = activeStep.icon;

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 px-4 select-none">
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#22D3EE] bg-cyan-950/20 px-3.5 py-1.5 rounded-full border border-cyan-950/30">
          How AutoPay Works
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F8FAFC] mt-4 font-sans tracking-tight">
          Automated Payment Workflows
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
          From payment creation to real-time blockchain settlement in four streamlined steps.
        </p>
      </div>

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/60 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-950/5 relative overflow-hidden"
      >
        {/* Subtle background gradient orb */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Horizontal Workflow Stepper */}
        <div className="relative flex items-center justify-between mb-12 max-w-2xl mx-auto">
          {/* Connector Line Background */}
          <div className="absolute inset-x-0 h-0.5 bg-slate-100 dark:bg-slate-800 top-1/2 -translate-y-1/2 left-4 right-4 z-0" />
          
          {/* Active Connector Progress Line */}
          <div 
            className="absolute h-0.5 bg-gradient-to-r from-purple-500 to-[#22D3EE] top-1/2 -translate-y-1/2 left-4 z-0 transition-all duration-500 ease-out"
            style={{ width: `${(activeIndex / (STEPS.length - 1)) * 90}%` }}
          />

          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <button
                key={step.id}
                onClick={() => setActiveIndex(index)}
                className="relative z-10 flex flex-col items-center focus:outline-none group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600 dark:bg-[#7C3AED] border-purple-500 text-white shadow-lg shadow-purple-500/25 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-purple-400 dark:hover:border-purple-500/50'
                  }`}
                >
                  <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                
                {/* Step Labels */}
                <span 
                  className={`absolute top-12 sm:top-14 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                    isActive 
                      ? 'text-purple-600 dark:text-[#22D3EE]' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Description Panel with Fade Transitions */}
        <div className="mt-14 min-h-[140px] flex items-center justify-center text-center max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-md">
                  STAGE {activeStep.num}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">
                {activeStep.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-[#CBD5E1] leading-relaxed">
                {activeStep.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots Indicator */}
        <div className="flex gap-2 justify-center items-center mt-6">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                i === activeIndex 
                  ? 'w-6 bg-gradient-to-r from-purple-500 to-[#22D3EE]' 
                  : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
              }`}
              aria-label={`Go to stage ${i + 1}`}
            />
          ))}
        </div>

        {isHovered && (
          <div className="absolute bottom-2.5 right-4 text-[9px] font-mono text-slate-400 select-none animate-pulse">
            ⏸ Paused
          </div>
        )}
      </div>
    </div>
  );
}
