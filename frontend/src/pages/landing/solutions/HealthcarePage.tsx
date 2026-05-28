import React from "react";
import { Link } from "react-router-dom";
import { ToolsMarquee } from "../../../components/landing/solutions/ToolsMarquee";
import { ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

import { Layout } from "../../../components/landing/Layout";

export const HealthcarePage = () => {
  return (
    <Layout>
    <main className="min-h-screen bg-white pt-24 font-body text-gray-600">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-32 flex flex-col items-center text-center overflow-hidden">
        
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-10 animate-fade-in-up transition-transform hover:scale-105">
          For Healthcare Providers &middot; Clinical & Admin Teams
        </div>
        
        <h1 className="text-3xl md:text-6xl lg:text-7xl font-display font-medium text-gray-900 tracking-tight mb-8 max-w-4xl animate-fade-in-up leading-[1.1]" style={{ animationDelay: "100ms" }}>
          Your clinicians use AI to save time.<br/>You need to know it's HIPAA compliant.<br/>
          <span className="text-emerald-600">Devise secures both.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mb-12 animate-fade-in-up font-light" style={{ animationDelay: "200ms" }}>
          Full visibility into AI usage across clinical and admin workflows. Protect PHI while scaling healthcare AI.
        </p>
        
        <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <Link to="/demo" className="bg-emerald-600 text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
            Get a Demo
          </Link>
        </div>

        {/* Clean Clinical Image Integration */}
        <div className="mt-24 w-full max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 animate-fade-in-up bg-white p-4" style={{ animationDelay: "400ms" }}>
          <div className="rounded-[1.5rem] overflow-hidden border border-gray-50">
            <img src="/images/healthcare_clean_airy_1779894747929.png" alt="Devise AI Tracking Dashboard for Healthcare" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      <div className="border-y border-gray-100 bg-gray-50/50 py-4">
        <ToolsMarquee />
      </div>

      {/* The Compliance Question */}
      <section className="py-16 md:py-32 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-4">The Compliance Question</h2>
          <h3 className="text-3xl md:text-5xl font-display font-medium text-gray-900 mb-6 tracking-tight">
            AI Exposure Summary — <span className="text-emerald-600">Q2 2026</span>
          </h3>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Generated automatically. Updated in real time. HIPAA audit-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white rounded-[2rem] aspect-square flex flex-col items-center justify-center p-6 md:p-10 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-xl transition-shadow">
            <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">942</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">AI tools in use</div>
          </div>
          <div className="bg-white rounded-[2rem] aspect-square flex flex-col items-center justify-center p-6 md:p-10 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-emerald-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl md:text-5xl font-light text-emerald-600 mb-2">318</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide px-4">Unapproved for PHI</div>
          </div>
          <div className="bg-rose-50 rounded-[2rem] aspect-square flex flex-col items-center justify-center p-6 md:p-10 text-center shadow-[0_10px_40px_-10px_rgba(225,29,72,0.1)] border border-rose-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl md:text-5xl font-light text-rose-600 mb-2">41</div>
            <div className="text-sm font-medium text-rose-600 uppercase tracking-wide px-4">Data leakage risks</div>
          </div>
        </div>
      </section>

      {/* Before the Regulator Finds It */}
      <section className="bg-gray-50 py-16 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
            <h2 className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-4">Risk Mitigation</h2>
            <h3 className="text-3xl md:text-5xl font-display font-medium text-gray-900 tracking-tight">
              Stop shadow AI <span className="text-emerald-600">before trust is broken.</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Without Devise */}
            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <h4 className="text-2xl font-medium text-gray-900">Without Devise</h4>
              </div>
              <ul className="space-y-8 text-gray-600">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-rose-50 flex flex-shrink-0 items-center justify-center text-xs text-rose-500">✕</div>
                  <span className="font-light">Patient histories pasted into public LLMs</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-rose-50 flex flex-shrink-0 items-center justify-center text-xs text-rose-500">✕</div>
                  <span className="font-light">No visibility into unapproved medical transcribers</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-rose-50 flex flex-shrink-0 items-center justify-center text-xs text-rose-500">✕</div>
                  <span className="font-light">Shadow AI invisible to compliance team</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-rose-100 flex flex-shrink-0 items-center justify-center text-xs text-rose-600">✕</div>
                  <span className="text-rose-600 font-medium">HIPAA violation discovered during audit</span>
                </li>
              </ul>
            </div>

            {/* With Devise */}
            <div className="bg-emerald-600 rounded-[2rem] p-8 md:p-12 text-white shadow-xl shadow-emerald-900/10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-full bg-emerald-500/50 text-white flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-2xl font-medium text-white">With Devise</h4>
              </div>
              <ul className="space-y-8 text-emerald-50">
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-white" />
                  <span className="font-light">Every AI tool checked against BAA requirements</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-white" />
                  <span className="font-light">Real-time alerts for unapproved transcription tools</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-white" />
                  <span className="font-light">Steer clinicians to approved, secure enterprise AI tools</span>
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
      <section className="bg-white py-20 md:py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-gray-900 mb-8 tracking-tight">
            Don't let a clinical workflow tool cause a <span className="text-emerald-600">HIPAA violation.</span>
          </h2>
          <p className="text-xl text-gray-500 mb-12 font-light">
            Dedicated risk onboarding. HIPAA audit trail from day one. Live in 60 days.
          </p>
          <Link to="/demo" className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
            Secure Your Workflows <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
    </Layout>
  );
};
