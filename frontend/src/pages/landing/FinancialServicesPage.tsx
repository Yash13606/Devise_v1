import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Shield, CheckCircle, ArrowRight, Plus, Minus, X, AlertTriangle, EyeOff, Activity, FileText
} from "lucide-react";
import { Layout } from "../../components/landing/Layout";
import { OrangeWaveBackground } from "../../components/landing/OrangeWaveBackground";

const AI_TOOLS = [
  "ChatGPT", "Claude", "Gemini", "Copilot", "Midjourney", "Cursor",
  "Notion AI", "Perplexity", "Stable Diffusion", "Runway", "Grammarly",
  "Descript", "Tome", "Loom AI", "Gamma", "Adobe Firefly", "Canva AI",
  "Replit", "v0", "Bolt", "Lovable", "Windsurf"
];

const BoardQuestionMockup = () => (
  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-4xl mx-auto">
    <div className="bg-gray-50 border-b border-gray-100 p-4 md:px-8 py-5 flex items-center justify-between">
      <h3 className="font-bold text-brand-dark text-lg flex items-center gap-2">
        <Activity className="text-brand-orange" size={20} />
        AI Exposure Summary — Q2 2026
      </h3>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Board Report
      </div>
    </div>
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center">
          <div className="text-4xl font-extrabold text-brand-dark mb-1">847</div>
          <div className="text-sm font-semibold text-brand-gray uppercase tracking-wide">AI tools in use</div>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex flex-col justify-center">
          <div className="text-4xl font-extrabold text-red-600 mb-1 flex items-center gap-2">
            214 <EyeOff size={24} className="text-red-400" />
          </div>
          <div className="text-sm font-semibold text-red-700/80 uppercase tracking-wide">Without audit trail</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 flex flex-col justify-center">
          <div className="text-4xl font-extrabold text-brand-orange mb-1 flex items-center gap-2">
            23 <AlertTriangle size={24} className="text-orange-400" />
          </div>
          <div className="text-sm font-semibold text-orange-700/80 uppercase tracking-wide">Regulatory flags</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm font-medium text-brand-gray bg-gray-50 w-fit px-4 py-2 rounded-lg mx-auto">
        <CheckCircle size={16} className="text-green-500" />
        Generated automatically. Updated in real time. Audit-ready.
      </div>
    </div>
  </div>
);

export const FinancialServicesPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-transparent overflow-hidden">
        <OrangeWaveBackground />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange bg-brand-orange/10 px-4 py-1.5 rounded-full mb-6">
            <Shield size={14} /> For Financial Services
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-brand-dark leading-[1.1] tracking-tight">
            Your traders use AI. <br className="hidden md:block" />
            <span className="text-brand-gray">Your compliance team can't see it.</span><br />
            <span className="text-brand-orange">Devise can.</span>
          </h1>

          <p className="text-lg md:text-2xl text-brand-gray font-medium max-w-3xl mx-auto mt-6 leading-relaxed">
            Full visibility into AI usage across trading, advisory, and operations. SEC, FINRA, and PCI-DSS audit trails from day one.
          </p>

          <div className="flex justify-center mt-10">
            <Link to="/demo" className="bg-brand-orange text-white rounded-full px-8 py-3.5 text-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-brand-orange/20 flex items-center gap-2">
              Get a Demo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 bg-white border-y border-gray-100 overflow-hidden flex flex-col items-center">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          Detecting 6,500+ AI tools across your org
        </div>
        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {[...AI_TOOLS, ...AI_TOOLS, ...AI_TOOLS].map((tool, idx) => (
              <span key={idx} className="mx-6 text-xl font-bold text-gray-300">
                {tool}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}</style>
      </section>

      {/* The Board Question Section */}
      <section className="py-24 px-6 bg-[#FAF9F5] relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-4 rounded bg-brand-orange text-white text-[11px] font-black uppercase tracking-widest shadow-sm">
            The Board Question
          </div>
          <h2 className="text-4xl font-bold text-brand-dark mb-12">Will you pass your next examination?</h2>
          
          <BoardQuestionMockup />
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Before the Regulator Finds It</h2>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              Legacy DLP and network proxies miss shadow AI. Devise gives you the OS-level visibility required by modern compliance frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
            {/* Without Devise */}
            <div className="bg-gray-50 p-10 md:p-12 border-b md:border-b-0 md:border-r border-gray-100">
              <h3 className="text-2xl font-bold text-brand-gray mb-8 flex items-center gap-3">
                <X size={28} className="text-red-400" /> Without Devise
              </h3>
              <ul className="space-y-6">
                {[
                  "AI tools adopted without compliance review",
                  "No audit trail for AI-assisted decisions",
                  "Shadow AI invisible to risk team",
                  "Regulatory findings discovered during examination"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-brand-gray/80 font-medium text-lg">
                    <X size={24} className="text-red-300 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* With Devise */}
            <div className="bg-white p-10 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-bl-[100px] pointer-events-none" />
              <h3 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                <CheckCircle size={28} className="text-brand-orange" /> With Devise
              </h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "Every AI tool mapped to regulatory framework",
                  "Full audit trail for every AI interaction",
                  "Shadow AI surfaced and governed in real time",
                  "Issues caught and resolved before examination"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-brand-dark font-semibold text-lg">
                    <CheckCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[#FAF9F5] border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">FAQs for Financial Services</h2>
          </div>

          <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
            {[
              { 
                q: "How does Devise handle SEC and FINRA compliance requirements?", 
                a: "Every AI interaction is logged with full audit metadata: user, department, tool, timestamp, and data classification. Reports map directly to SEC examination priorities and FINRA supervisory requirements. Exportable to your existing GRC platform." 
              },
              { 
                q: "Where does our data reside?", 
                a: "Devise offers flexible deployment. You can use our managed cloud infrastructure or self-host the entire control plane within your VPC to ensure data never leaves your environment." 
              },
              { 
                q: "How are audit trails structured for regulatory examination?", 
                a: "Audit trails are structured immutably in our ledger, capturing the exact OS-level process attribution, network destination, and user identity, fully compliant with WORM storage requirements." 
              },
              { 
                q: "Can Devise generate regulatory reports automatically?", 
                a: "Yes. Devise includes one-click export for SOC 2 Type II, GDPR, and custom SEC examination request lists directly from the admin dashboard." 
              },
              { 
                q: "Does it integrate with our existing GRC and SIEM tools?", 
                a: "Yes. Devise pushes telemetry directly into Splunk, Datadog, Microsoft Sentinel, and major GRC platforms via our real-time webhook and API integrations." 
              }
            ].map((faq, i) => (
              <Accordion.Item 
                key={i} 
                value={`faq-${i}`} 
                className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden hover:border-brand-orange/20 transition-all duration-300 data-[state=open]:shadow-md data-[state=open]:border-brand-orange/30 group"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between p-5 text-left font-bold text-brand-dark hover:text-brand-orange transition-colors outline-none cursor-pointer">
                    {faq.q}
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-orange/10 shrink-0 ml-4 group-data-[state=open]:bg-brand-orange/10 group-data-[state=open]:rotate-180 duration-500">
                      <Plus className="text-gray-400 group-hover:text-brand-orange w-4 h-4 group-data-[state=open]:hidden transition-colors" />
                      <Minus className="text-brand-orange w-4 h-4 group-data-[state=closed]:hidden transition-colors" />
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                  <div className="p-5 pt-0 text-brand-gray leading-relaxed text-sm md:text-base border-t border-gray-50">
                    {faq.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 bg-brand-dark text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#1a1c23] to-[#2d201c] z-0" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-[11px] font-black uppercase tracking-widest">
            For Financial Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your regulators will ask about AI usage. <br/>
            <span className="text-brand-orange">Have the answer ready.</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Dedicated compliance onboarding. SEC/FINRA audit trail from day one. Live in 60 days.
          </p>
          
          <Link to="/demo" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white rounded-full px-8 py-4 font-bold text-lg hover:bg-orange-600 transition-transform hover:scale-105 shadow-xl shadow-brand-orange/20 w-full sm:w-auto">
            Get a Demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};
