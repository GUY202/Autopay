/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/wagmi';
import Home from './pages/Home';
import Pay from './pages/Pay';
import Success from './pages/Success';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] font-sans selection:bg-purple-100 dark:selection:bg-[#7C3AED]/20 transition-colors duration-300">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-12">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/pay" element={<Pay />} />
                  <Route path="/success" element={<Success />} />
                </Routes>
              </main>
              <Footer />
              <FloatingActionButton />
            </div>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

