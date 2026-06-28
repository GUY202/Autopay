import { useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import TransactionHistory from '../components/TransactionHistory';
import FeatureSpotlight from '../components/FeatureSpotlight';
import { motion } from 'motion/react';
import { useAccount } from 'wagmi';
import { 
  Coffee, 
  FileText, 
  Heart, 
  GraduationCap, 
  Gift, 
  ShoppingBag, 
  Sparkles 
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  desc: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { 
    id: 'quick', 
    label: 'Quick Payment', 
    icon: '☕', 
    iconColor: 'text-amber-500', 
    bgColor: 'bg-amber-500/10',
    title: '', 
    desc: '' 
  },
  { 
    id: 'invoice', 
    label: 'Invoice', 
    icon: '📄', 
    iconColor: 'text-blue-500', 
    bgColor: 'bg-blue-500/10',
    title: 'Invoice Payment', 
    desc: 'Payment for services rendered.' 
  },
  { 
    id: 'donation', 
    label: 'Donation', 
    icon: '❤️', 
    iconColor: 'text-rose-500', 
    bgColor: 'bg-rose-500/10',
    title: 'Support Our Project', 
    desc: 'Thank you for supporting us.' 
  },
  { 
    id: 'tuition', 
    label: 'Tuition', 
    icon: '🎓', 
    iconColor: 'text-indigo-500', 
    bgColor: 'bg-indigo-500/10',
    title: 'Tuition Payment', 
    desc: 'School tuition fees payment.' 
  },
  { 
    id: 'gift', 
    label: 'Gift', 
    icon: '🎁', 
    iconColor: 'text-purple-500', 
    bgColor: 'bg-purple-500/10',
    title: 'Send a Gift', 
    desc: 'A special gift token for you.' 
  },
  { 
    id: 'product', 
    label: 'Product Sale', 
    icon: '🛒', 
    iconColor: 'text-cyan-500', 
    bgColor: 'bg-cyan-500/10',
    title: 'Product Purchase', 
    desc: 'Payment for physical or digital items purchased.' 
  },
];

export default function Home() {
  const { isConnected } = useAccount();
  const [selectedActionId, setSelectedActionId] = useState('quick');
  const [prefill, setPrefill] = useState({
    title: '',
    desc: '',
    key: 'quick'
  });

  const handleSelectAction = (action: QuickAction) => {
    setSelectedActionId(action.id);
    setPrefill({
      title: action.title,
      desc: action.desc,
      key: `${action.id}-${Date.now()}` // Dynamic key to force re-render in form effect
    });

    // Smoothly scroll down to the payment form
    setTimeout(() => {
      const element = document.getElementById('payment-form-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Header Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12 max-w-3xl"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/10 text-purple-600 dark:text-[#22D3EE] rounded-full text-xs font-black tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          Arc Testnet Payment Workspace
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC] mb-4 leading-tight">
          Welcome back 👋 <br />
          <span className="bg-gradient-to-r from-purple-500 to-[#22D3EE] bg-clip-text text-transparent">
            What would you like to create today?
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-[#CBD5E1] max-w-xl mx-auto leading-relaxed">
          Select a template workspace preset below to pre-fill your USDC invoicing details or generate a custom payment flow.
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-4 mb-16 px-2"
      >
        {QUICK_ACTIONS.map((action) => {
          const isActive = selectedActionId === action.id;
          return (
            <motion.button
              key={action.id}
              onClick={() => handleSelectAction(action)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-start p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-purple-500/5 border-purple-500 dark:border-[#22D3EE] ring-1 ring-purple-500/10'
                  : 'bg-white dark:bg-[#1E293B] border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${action.bgColor}`}>
                <span>{action.icon}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm">
                {action.label}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                {action.id === 'quick' ? 'No template defaults' : action.title}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Payment Invoice Generator Form */}
      <div className="w-full relative py-6">
        <PaymentForm 
          prefillTitle={prefill.title} 
          prefillDesc={prefill.desc} 
          prefillKey={prefill.key} 
        />
      </div>

      {/* Transaction History Section */}
      {isConnected && (
        <motion.div
          id="transaction-history-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full border-t border-slate-100 dark:border-slate-800/60 pt-10 mt-16"
        >
          <TransactionHistory />
        </motion.div>
      )}

      {/* Horizontal Animated Workflow Section */}
      <div className="w-full border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-8">
        <FeatureSpotlight />
      </div>
    </div>
  );
}
