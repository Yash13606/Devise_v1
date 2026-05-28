import React from "react";
import { Link } from "react-router-dom";
import { ToolsMarquee } from "../../../components/landing/solutions/ToolsMarquee";
import { ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

import { Layout } from "../../../components/landing/Layout";

export const FinancialServicesPage = () => {
  return (
    <Layout>
    <main className="min-h-screen bg-[#F5F7FA] pt-24 font-body text-slate-800">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-32 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E2E8F0] to-[#F5F7FA] -z-10" />
        <div className="absolute top-0 w-full h-[500px] bg-[url('/images/hero-dots.png')] opacity-5 mix-blend-multiply pointer-events-none -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-slate-600 text-sm font-medium mb-8 animate-fade-in-up">
          For Financial Services &middot; Banking & Wealth Management
        </div>
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-semibold text-slate-900 tracking-tight mb-8 max-w-5xl animate-fade-in-up leading-tight" style={{ animationDelay: "100ms" }}>
          Your teams are testing AI.<br/>The regulators are watching.<br/>
          <span className="text-blue-700 font-light italic">You need absolute control.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 animate-fade-in-up font-light" style={{ animationDelay: "200ms" }}>
          Full visibility into shadow AI, automated SEC/FINRA compliance, and data leakage prevention.
        </p>
        
        <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <Link to="/demo" className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-slate-900/20">
            Request Demo
          </Link>
        </div>

        {/* Cold Luxury Image Integration */}
        <div className="mt-24 w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-slate-400/30 border border-white/50 animate-fade-in-up relative" style={{ animationDelay: "400ms" }}>
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
          <img src="/images/finserve_cold_luxury_1779894687640.png" alt="Devise AI Tracking Dashboard for Finance" className="w-full h-auto object-cover" />
        </div>
      </section>

      <div className="border-y border-slate-200 bg-white shadow-sm relative z-10">
        <ToolsMarquee />
      </div>

      {/* The Board Question - Glassmorphism */}
      <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] -z-10" />

        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">The Board Question</h2>
          <h3 className="text-3xl md:text-5xl font-display font-medium text-slate-900 mb-6">
            Are we exposed?
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
            AI Exposure Summary — <span className="font-medium text-blue-700">Q2 2026</span>. Generated automatically.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 md:p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden">
            <div className="text-5xl md:text-6xl font-light text-slate-900 mb-4">942</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">AI tools in use</div>
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 md:p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="text-5xl md:text-6xl font-light text-blue-700 mb-4">318</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Unapproved for client data</div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 md:p-10 text-center shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            <div className="text-5xl md:text-6xl font-light text-white mb-4">41</div>
            <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Data leakage risks</div>
          </div>
        </div>
      </section>

      {/* Before the Regulator Finds It */}
      <section className="bg-white py-16 md:py-32 px-6 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-20 animate-fade-in-up">
            <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">Compliance Protocol</h2>
            <h3 className="text-3xl md:text-5xl font-display font-medium text-slate-900">
              Stop shadow AI <span className="text-blue-700 font-light italic">before the audit.</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Without Devise */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400/50 rounded-t-2xl" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <h4 className="text-2xl font-medium text-slate-900">Without Devise</h4>
              </div>
              <ul className="space-y-6 text-slate-600 font-light">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex flex-shrink-0 items-center justify-center text-xs shadow-sm">✕</div>
                  <span>Client financials pasted into public LLMs</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex flex-shrink-0 items-center justify-center text-xs shadow-sm">✕</div>
                  <span>No visibility into unapproved meeting transcribers on earnings calls</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex flex-shrink-0 items-center justify-center text-xs shadow-sm">✕</div>
                  <span>Shadow AI invisible to compliance team</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-red-50 border border-red-100 flex flex-shrink-0 items-center justify-center text-xs text-red-500 shadow-sm">✕</div>
                  <span className="text-red-600 font-medium">Compliance breach discovered during SEC audit</span>
                </li>
              </ul>
            </div>

            {/* With Devise */}
            <div className="bg-slate-900 rounded-2xl p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-2xl font-medium text-white">With Devise</h4>
              </div>
              <ul className="space-y-6 text-slate-300 font-light relative z-10">
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Every AI tool checked against FINRA data agreements</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Real-time alerts for unapproved transcription tools</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Steer analysts to approved, secure enterprise AI tools automatically</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-white" />
                  <span className="font-medium text-white">Data leakage stopped before trust is broken</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 md:py-32 px-6 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-display font-medium text-white mb-8 leading-tight">
            Don't let a $10/month AI tool cause a<br />
            <span className="text-blue-400 font-light italic">$10M compliance fine.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 font-light">
            Dedicated risk onboarding. Complete audit trail from day one. Live in 60 days.
          </p>
          <Link to="/demo" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-blue-50 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Protect Client Data <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
    </Layout>
  );
};
