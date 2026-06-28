export default function Footer() {
  return (
    <footer className="py-8 border-t border-slate-200 dark:border-slate-800/60 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <a
            href="https://x.com/arc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-900 dark:text-slate-100 hover:text-[#22D3EE] transition-colors"
          >
            Arc (@arc)
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span>X:</span>
          <a
            href="https://x.com/autopay_?s=11"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-900 dark:text-slate-100 hover:text-[#22D3EE] transition-colors"
          >
            @autopay_
          </a>
        </div>
        <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
        <span>Built by AutoPay Team</span>
      </div>
    </footer>
  );
}
