import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign, PieChart, Wallet, CreditCard, ChevronRight, TrendingDown
} from "lucide-react";
import { Layout } from "../../components/landing/Layout";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.1 } }
};

export const SpendPage = () => {
  return (
    <Layout>
      <main className="bg-[#030303] min-h-screen text-gray-300 font-body selection:bg-green-500/30 overflow-hidden pt-24">
        
        {/* HERO SECTION */}
        <section className="relative px-6 py-16 md:py-32 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-xs tracking-widest uppercase font-bold mb-8">
              <DollarSign size={14} /> Devise Spend
            </motion.div>
            
            <motion.h1 variants={FADE_UP} className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight mb-8 leading-[1.05]">
              Stop wasting money.<br />
              <span className="text-green-500 italic">On unused AI seats.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-light">
              Identify zombie subscriptions, consolidate enterprise agreements, and track every dollar spent on AI across your entire organization.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/demo" 
                className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform active:scale-95 hover:bg-green-500 shadow-[0_0_30px_-5px_rgba(22,163,74,0.4)]"
                style={{ transitionDuration: '160ms', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                Book a Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* MOCK UI HERO - ROI & SPEND TRACKING */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="w-full max-w-5xl mx-auto mt-24 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-left"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Financial Oversight</div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Wallet size={16} /> <span className="text-xs uppercase font-bold tracking-widest">Total AI Spend (YTD)</span>
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">$842,500</div>
                <div className="text-xs text-red-400 font-bold flex items-center gap-1">+14% vs Last Qtr</div>
                
                {/* Visual Line */}
                <div className="mt-8 h-8 w-full border-b border-white/10 relative">
                  <div className="absolute bottom-0 left-0 h-full w-[80%] bg-gradient-to-t from-red-500/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 h-0.5 w-[80%] bg-red-500" />
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/5 p-6 rounded-xl border-t-2 border-t-green-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingDown size={16} /> <span className="text-xs uppercase font-bold tracking-widest">Wasted Spend Prevented</span>
                  </div>
                  <span className="text-xs font-mono bg-green-500/20 text-green-400 px-2 py-1 rounded">THIS MONTH</span>
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 relative z-10">$48,200</div>
                
                <div className="space-y-2 mt-6 relative z-10">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Unused ChatGPT Plus Seats</span>
                    <span className="text-white">-$12,400</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Duplicate Claude Pro Subs</span>
                    <span className="text-white">-$8,600</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </motion.div>
        </section>

        {/* BENTO GRID */}
        <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="mb-20">
            <h2 className="text-[10px] font-bold tracking-widest text-green-500 uppercase mb-4">Financial Intelligence</h2>
            <h3 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">Optimize contracts.<br />Eliminate waste.</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-8"><PieChart className="text-green-500" /></div>
                <h4 className="text-3xl font-display font-bold text-white mb-4">Zombie License Detection</h4>
                <p className="text-gray-400">Automatically identify users who haven't logged into their premium AI tools in the last 30 days. Reclaim those licenses or cancel them entirely.</p>
              </div>
              <div className="mt-12 -mx-12 -mb-12 opacity-50 group-hover:opacity-100 transition-opacity duration-500 flex justify-end">
                <div className="w-48 h-48 rounded-full border-[20px] border-green-500/20 border-t-green-500 border-l-green-500 rotate-45 mr-12 mb-[-2rem]" />
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }} className="bg-white text-[#0A0A0A] rounded-[2rem] p-8 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-8"><CreditCard className="text-black" /></div>
              <h4 className="text-2xl font-display font-bold mb-4">Shadow Purchasing</h4>
              <p className="text-gray-600 text-sm mb-8">Catch expensed AI subscriptions that bypass procurement and IT.</p>
              <div className="mt-auto space-y-2 font-mono text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <div className="flex justify-between items-center pb-2 border-b border-black/10"><span>Midjourney (Stripe)</span><span className="text-red-500">$1,200</span></div>
                <div className="flex justify-between items-center pb-2 border-b border-black/10"><span>Anthropic</span><span className="text-red-500">$840</span></div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* DARK CTA */}
        <section className="py-20 md:py-40 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-green-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }} className="max-w-3xl mx-auto border border-white/10 bg-black/50 backdrop-blur-xl p-8 md:p-16 rounded-3xl md:rounded-[3rem]">
            <h2 className="text-3xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">Reclaim your AI budget.</h2>
            <p className="text-xl text-gray-400 mb-12">Book a session to see how Devise cuts wasted spend.</p>
            <Link to="/demo" className="inline-flex bg-green-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-green-500 transition-transform active:scale-95 shadow-[0_0_40px_rgba(22,163,74,0.3)]">
              GET A DEMO
            </Link>
          </motion.div>
        </section>
      </main>
    </Layout>
  );
};
