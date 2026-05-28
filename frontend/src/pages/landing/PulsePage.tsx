import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart, MousePointerClick, Users, Boxes, ChevronRight, BarChart3, TrendingUp
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

export const PulsePage = () => {
  return (
    <Layout>
      <main className="bg-[#030303] min-h-screen text-gray-300 font-body selection:bg-blue-500/30 overflow-hidden pt-24">
        
        {/* HERO SECTION */}
        <section className="relative px-6 py-16 md:py-32 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs tracking-widest uppercase font-bold mb-8">
              <LineChart size={14} /> Devise Pulse
            </motion.div>
            
            <motion.h1 variants={FADE_UP} className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight mb-8 leading-[1.05]">
              Measure AI ROI.<br />
              <span className="text-blue-500 italic">With actual data.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-light">
              Stop guessing if your AI investments are working. Track adoption, frequency, and real business impact across 6,500+ tools.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/demo" 
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform active:scale-95 hover:bg-blue-500 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]"
                style={{ transitionDuration: '160ms', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                Book a Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* MOCK UI HERO - ADOPTION METRICS */}
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
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Org-wide Adoption</div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Users size={16} /> <span className="text-xs uppercase font-bold tracking-widest">Active Users</span>
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2">4,291</div>
                <div className="text-xs text-blue-400 font-bold flex items-center gap-1"><TrendingUp size={12} /> +12% this month</div>
              </div>
              <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <BarChart3 size={16} /> <span className="text-xs uppercase font-bold tracking-widest">Avg Sessions/Wk</span>
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2">18.4</div>
                <div className="text-xs text-blue-400 font-bold flex items-center gap-1"><TrendingUp size={12} /> +5.2% this month</div>
              </div>
              <div className="bg-white/5 border border-white/5 p-6 rounded-xl border-t-2 border-t-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                <div className="flex items-center gap-2 text-blue-400 mb-2 relative z-10">
                  <MousePointerClick size={16} /> <span className="text-xs uppercase font-bold tracking-widest">Est. Hours Saved</span>
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2 relative z-10">12,450</div>
                <div className="text-xs text-gray-400 font-bold relative z-10">Based on standard workflow analysis</div>
              </div>
            </div>
            
            <div className="mt-6 h-32 flex items-end gap-2 border-b border-white/10 pb-2">
               {/* Abstract chart */}
               {[30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ height: 0 }} 
                   animate={{ height: `${h}%` }} 
                   transition={{ duration: 0.8, delay: 0.5 + (i * 0.05), ease: [0.23, 1, 0.32, 1] }}
                   className="flex-1 bg-blue-500/20 rounded-t-sm relative group cursor-crosshair hover:bg-blue-500/50 transition-colors"
                 />
               ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </motion.div>
        </section>

        {/* BENTO GRID */}
        <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="mb-20">
            <h2 className="text-[10px] font-bold tracking-widest text-blue-500 uppercase mb-4">Analytics Engine</h2>
            <h3 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">Prove the impact.<br />Scale the winners.</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-8"><Users className="text-blue-500" /></div>
                <h4 className="text-3xl font-display font-bold text-white mb-4">Deep Cohort Analysis</h4>
                <p className="text-gray-400">See exactly which teams are adopting AI and how often. Compare engineering vs. marketing, or senior vs. junior staff to target training and enablement.</p>
              </div>
              <div className="mt-12 -mx-12 -mb-12 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <div className="h-48 w-full bg-gradient-to-t from-blue-500/20 to-transparent flex items-end justify-around pb-4 px-12 gap-2">
                   <div className="w-full bg-blue-500/30 rounded-t-md h-[40%]" />
                   <div className="w-full bg-blue-500/60 rounded-t-md h-[80%]" />
                   <div className="w-full bg-blue-500/40 rounded-t-md h-[60%]" />
                   <div className="w-full bg-blue-500/90 rounded-t-md h-[100%]" />
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }} className="bg-white text-[#0A0A0A] rounded-[2rem] p-8 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-8"><Boxes className="text-black" /></div>
              <h4 className="text-2xl font-display font-bold mb-4">Tool Consolidation</h4>
              <p className="text-gray-600 text-sm mb-8">Identify redundant tools. If your team uses ChatGPT, Claude, and Gemini, see which one is actually driving engagement.</p>
              <div className="mt-auto space-y-2 font-mono text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <div className="flex justify-between items-center pb-2 border-b border-black/10"><span>ChatGPT Plus</span><span className="text-black">82% Usage</span></div>
                <div className="flex justify-between items-center pb-2 border-b border-black/10"><span>Claude Pro</span><span className="text-black">45% Usage</span></div>
                <div className="flex justify-between items-center"><span>Gemini Adv</span><span className="text-red-500">12% Usage</span></div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* DARK CTA */}
        <section className="py-20 md:py-40 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }} className="max-w-3xl mx-auto border border-white/10 bg-black/50 backdrop-blur-xl p-8 md:p-16 rounded-3xl md:rounded-[3rem]">
            <h2 className="text-3xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">Turn AI hype into ROI.</h2>
            <p className="text-xl text-gray-400 mb-12">Book a session to see how Devise measures real adoption.</p>
            <Link to="/demo" className="inline-flex bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-blue-500 transition-transform active:scale-95 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
              GET A DEMO
            </Link>
          </motion.div>
        </section>
      </main>
    </Layout>
  );
};
