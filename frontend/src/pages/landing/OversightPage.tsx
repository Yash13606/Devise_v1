import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldAlert, Eye, Lock, FileText, ChevronRight, Activity
} from "lucide-react";
import { Layout } from "../../components/landing/Layout";

// Animation utility
const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.1 } }
};

export const OversightPage = () => {
  return (
    <Layout>
      <main className="bg-[#030303] min-h-screen text-gray-300 font-body selection:bg-red-500/30 overflow-hidden pt-24">
        
        {/* HERO SECTION */}
        <section className="relative px-6 py-16 md:py-32 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs tracking-widest uppercase font-bold mb-8">
              <ShieldAlert size={14} /> Devise Oversight
            </motion.div>
            
            <motion.h1 variants={FADE_UP} className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight mb-8 leading-[1.05]">
              Govern AI usage.<br />
              <span className="text-red-500 italic">Before it governs you.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-light">
              Detect shadow AI, enforce granular policies, and map your entire organizational risk surface in real time.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/demo" 
                className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform active:scale-95 hover:bg-red-500 shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)]"
                style={{ transitionDuration: '160ms', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                Book a Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* MOCK UI HERO */}
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
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global Risk Feed</div>
            </div>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/10">
                <div className="flex items-start gap-4">
                  <Activity className="text-red-500 mt-0.5" size={16} />
                  <div>
                    <div className="text-white font-bold">PII Leak Detected</div>
                    <div className="text-gray-400 text-xs mt-1">Source: ChatGPT Web UI &middot; User: marketing_lead@corp.com</div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4 text-xs font-bold uppercase tracking-widest">
                  <span className="text-red-500">Critical</span>
                  <span className="text-gray-500">Just now</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
                <div className="flex items-start gap-4">
                  <Lock className="text-orange-500 mt-0.5" size={16} />
                  <div>
                    <div className="text-white font-bold">Unauthorized Tool Access</div>
                    <div className="text-gray-400 text-xs mt-1">App: Perplexity AI &middot; Group: Engineering</div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4 text-xs font-bold uppercase tracking-widest">
                  <span className="text-orange-500">Warning</span>
                  <span className="text-gray-500">2m ago</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </motion.div>
        </section>

        {/* BENTO GRID */}
        <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="mb-20">
            <h2 className="text-[10px] font-bold tracking-widest text-red-500 uppercase mb-4">The Platform</h2>
            <h3 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">Absolute visibility.<br />Zero blind spots.</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-8"><Eye className="text-red-500" /></div>
                <h4 className="text-3xl font-display font-bold text-white mb-4">Real-time Shadow AI Detection</h4>
                <p className="text-gray-400">Instantly map every AI tool being used across your network. No agents required. Find the tools your team bought with corporate cards before they become a liability.</p>
              </div>
              <div className="mt-12 -mx-12 -mb-12 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <div className="h-48 w-full bg-gradient-to-t from-red-500/20 to-transparent flex items-end justify-around pb-4 px-12">
                   {[40, 70, 45, 90, 65, 80, 50, 100, 60, 85].map((h, i) => (
                     <div key={i} className="w-8 bg-red-500/30 rounded-t-md" style={{ height: `${h}%` }} />
                   ))}
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }} className="bg-white text-[#0A0A0A] rounded-[2rem] p-8 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-8"><Lock className="text-black" /></div>
              <h4 className="text-2xl font-display font-bold mb-4">Granular Policy Enforcement</h4>
              <p className="text-gray-600 text-sm mb-8">Block non-compliant tools, restrict sensitive data inputs, and enforce guardrails at the network level.</p>
              <div className="mt-auto space-y-2 font-mono text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <div className="flex justify-between items-center pb-2 border-b border-black/10"><span>Rule: ChatGPT Web</span><span className="text-red-500">Blocked</span></div>
                <div className="flex justify-between items-center pb-2 border-b border-black/10"><span>Rule: GitHub Copilot</span><span className="text-green-600">Allowed</span></div>
                <div className="flex justify-between items-center"><span>Rule: PII Uploads</span><span className="text-red-500">Blocked</span></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }} className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-8"><ShieldAlert className="text-white" /></div>
              <h4 className="text-2xl font-display font-bold text-white mb-4">Framework Mapping</h4>
              <p className="text-gray-400 text-sm">Automatically map violations to global frameworks.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["NIST AI RMF", "OWASP Top 10", "ISO 42001"].map(fw => (
                  <span key={fw} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">{fw}</span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }} className="md:col-span-2 bg-gradient-to-br from-[#0A0A0A] to-red-950/20 border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between">
              <div className="max-w-md">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-8"><FileText className="text-red-500" /></div>
                <h4 className="text-3xl font-display font-bold text-white mb-4">Defensible Audit Trails</h4>
                <p className="text-gray-400">Generate board-ready reports and compliance logs with a single click.</p>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* DARK CTA */}
        <section className="py-20 md:py-40 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }} className="max-w-3xl mx-auto border border-white/10 bg-black/50 backdrop-blur-xl p-8 md:p-16 rounded-3xl md:rounded-[3rem]">
            <h2 className="text-3xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">Govern AI before it governs you.</h2>
            <p className="text-xl text-gray-400 mb-12">Book a session to see how Devise maps your risk surface.</p>
            <Link to="/demo" className="inline-flex bg-red-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-red-500 transition-transform active:scale-95 shadow-[0_0_40px_rgba(220,38,38,0.3)]">
              GET A DEMO
            </Link>
          </motion.div>
        </section>
      </main>
    </Layout>
  );
};
