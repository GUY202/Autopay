import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut, Loader2, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-slate-100 dark:border-slate-800/60 bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#7C3AED] to-[#22D3EE] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/15 transform group-hover:scale-105 transition-all duration-200">
            <span className="text-white font-extrabold text-lg select-none">A</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-[#F8FAFC] transition-colors">
            AutoPay
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-[#F9FAFB] hover:bg-gray-100/60 dark:hover:bg-[#111827]/60 rounded-xl transition-all duration-150"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl px-3.5 py-1.5 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
                </span>
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-[#CBD5E1]">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-150 cursor-pointer"
                title="Disconnect"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              disabled={isPending}
              className={cn(
                "flex items-center gap-2 px-4.5 py-2.5 bg-purple-600 dark:bg-[#7C3AED] text-white rounded-xl font-semibold text-sm hover:bg-purple-700 dark:hover:bg-purple-600/90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-xs cursor-pointer",
                isPending && "cursor-not-allowed"
              )}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
