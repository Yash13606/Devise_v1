import React from "react";
import { Link } from "react-router-dom";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Shield, CheckCircle, ArrowRight, Plus, Minus, Building, 
  MapPin, Clock, Search, Zap, CheckCircle2, TrendingUp
} from "lucide-react";
import { Layout } from "../../components/landing/Layout";
import { OrangeWaveBackground } from "../../components/landing/OrangeWaveBackground";

const AI_TOOLS = [
  "ChatGPT", "Claude", "Gemini", "Copilot", "Midjourney", "Cursor",
  "Notion AI", "Perplexity", "Stable Diffusion", "Runway", "Grammarly",
  "Descript", "Tome", "Loom AI", "Gamma", "Adobe Firefly", "Canva AI",
  "Replit", "v0", "Bolt", "Lovable", "Windsurf"
];

const EngineTable = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-5xl mx-auto">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="py-4 px-6 font-semibold text-xs uppercase tracking-widest text-brand-gray w-48">Intervention Type</th>
            <th className="py-4 px-6 font-semibold text-xs uppercase tracking-widest text-brand-gray w-32">Department</th>
            <th className="py-4 px-6 font-semibold text-xs uppercase tracking-widest text-brand-gray">Event Signal</th>
            <th className="py-4 px-6 font-semibold text-xs uppercase tracking-widest text-brand-orange text-right w-40">Impact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[
            { type: "Steering", typeColor: "bg-orange-100 text-orange-700", dept: "Engineering", event: "187 engineers on ChatGPT for code. 340 unused Copilot seats.", impact: "$680K saved", impactColor: "text-green-600" },
            { type: "Discovery", typeColor: "bg-blue-100 text-blue-700", dept: "Legal", event: "AI contract review workflow found in London. Distributed to 247 lawyers.", impact: "2,964 hrs/wk", impactColor: "text-brand-dark" },
            { type: "Coaching", typeColor: "bg-purple-100 text-purple-700", dept: "Finance", event: "500 people coached on AI forecasting. Top performers get 4x leverage.", impact: "2.1→5.7 workflows", impactColor: "text-brand-dark" },
            { type: "Friction", typeColor: "bg-red-100 text-red-700", dept: "Operations", event: "340 abandoned AI sessions detected. Context limits, wrong tools, skill gaps.", impact: "23%→4%", impactColor: "text-brand-dark" },
            { type: "Steering", typeColor: "bg-orange-100 text-orange-700", dept: "Marketing", event: "12 marketers using Jasper. Enterprise Copilot license unused.", impact: "$28K saved", impactColor: "text-green-600" },
            { type: "Discovery", typeColor: "bg-blue-100 text-blue-700", dept: "Sales", event: "AI prospecting workflow spreading from 2 reps to entire team of 45.", impact: "270 hrs/wk", impactColor: "text-brand-dark" },
          ].map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="py-5 px-6 font-medium">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${row.typeColor}`}>
                  {row.type}
                </span>
              </td>
              <td className="py-5 px-6 font-semibold text-brand-dark">{row.dept}</td>
              <td className="py-5 px-6 text-brand-gray text-sm leading-relaxed">{row.event}</td>
              <td className="py-5 px-6 text-right font-extrabold text-[15px] flex items-center justify-end gap-1">
                <span className={row.impactColor}>{row.impact}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="bg-gray-50/50 border-t border-gray-100 p-4 text-center text-xs font-bold text-brand-gray uppercase tracking-widest">
      + 47 more interventions this week
    </div>
  </div>
);

export const EnterprisePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-transparent overflow-hidden">
        <OrangeWaveBackground />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange bg-brand-orange/10 px-4 py-1.5 rounded-full mb-6 border border-brand-orange/20 shadow-sm shadow-brand-orange/10">
            <Building size={14} /> For Enterprise · 1,000+ Employees
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-brand-dark leading-[1.1] tracking-tight">
            Your board wants to know <br className="hidden md:block" />
            <span className="text-brand-gray">if AI is working.</span><br />
            <span className="text-brand-orange">Give them the answer.</span>
          </h1>

          <p className="text-lg md:text-2xl text-brand-gray font-medium max-w-3xl mx-auto mt-6 leading-relaxed">
            Org-wide AI visibility, adoption at scale, and board-ready ROI proof. 90 days.
          </p>

          <div className="flex justify-center mt-10">
            <Link to="/demo" className="bg-brand-orange text-white rounded-full px-8 py-3.5 text-lg font-bold hover:bg-orange-600 transition-all hover:scale-105 shadow-xl shadow-brand-orange/20 flex items-center gap-2">
              Get a Demo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 bg-white border-y border-gray-100 overflow-hidden flex flex-col items-center relative z-10 shadow-sm">
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

      {/* Deployment Section */}
      <section className="py-24 px-6 bg-[#FAF9F5] relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded bg-brand-orange text-white text-[11px] font-black uppercase tracking-widest shadow-sm">
              Deployment
            </div>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">From procurement to proof in 90 days</h2>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              Lightweight OS-level agent. Zero network proxies. Zero routing changes. Integrates seamlessly with the MDM infrastructure you already run.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                time: "Week 1",
                title: "Connected to your infrastructure",
                desc: "SSO/SCIM maps your org. MDM pushes the lightweight agent silently. Zero network disruption.",
                checks: ["SSO/SCIM live", "OS Agents active", "Org mapped"]
              },
              {
                time: "Week 2–4",
                title: "Your AI landscape, mapped",
                desc: "Shadow AI surfaced across 6,500+ tools. AI opportunity assessment scored by department.",
                checks: ["Shadow AI audit", "Opportunity assessment", "Benchmarks set"]
              },
              {
                time: "Month 2–3",
                title: "Adoption climbing, waste shrinking",
                desc: "All four interventions running. License consolidation underway. First board report generated.",
                checks: ["Interventions active", "Savings quantified", "Board report delivered"]
              }
            ].map((phase, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-4 left-8 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                  {phase.time}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mt-4 mb-3">{phase.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed mb-6 h-20">{phase.desc}</p>
                <ul className="space-y-3">
                  {phase.checks.map((check, cIdx) => (
                    <li key={cIdx} className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                      <CheckCircle2 size={16} className="text-green-500" /> {check}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Engine at Scale Section */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-brand-orange/[0.03] rounded-bl-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded bg-brand-orange text-white text-[11px] font-black uppercase tracking-widest shadow-sm">
              The Engine at Scale
            </div>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">This is what the engine does in a single week.</h2>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              Real signals from real orgs. Every row is an intervention the engine ran automatically.
            </p>
          </div>

          <EngineTable />
        </div>
      </section>

      {/* The Math Section */}
      <section className="py-24 px-6 bg-brand-dark relative text-white overflow-hidden">
        {/* Subtle gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-[11px] font-black uppercase tracking-widest">
            The Math
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The ROI at scale is undeniable</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
            Based on 5,000 employees spending roughly $20/user/month on AI tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center">
              <div className="text-5xl font-extrabold text-white mb-2 tracking-tight">$1.2M</div>
              <div className="text-lg font-bold text-gray-300 mb-1">Annual AI Spend</div>
              <div className="text-xs text-gray-500">$20/user/month × 5,000 people</div>
            </div>
            <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center">
              <div className="text-5xl font-extrabold text-brand-orange mb-2 tracking-tight">$19M</div>
              <div className="text-lg font-bold text-gray-300 mb-1">Automatable Work / Year</div>
              <div className="text-xs text-gray-500">Scored by role, task, and salary band</div>
            </div>
            <div className="bg-gradient-to-br from-brand-orange to-brand-purple p-[2px] rounded-2xl">
              <div className="bg-[#1a1c23] rounded-[14px] p-8 h-full flex flex-col items-center justify-center">
                <div className="text-5xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
                  <TrendingUp className="text-brand-orange" size={36} /> 16x
                </div>
                <div className="text-lg font-bold text-brand-orange mb-1">Potential ROI</div>
                <div className="text-xs text-gray-400 font-medium">Even at 10% capture, that's $1.9M</div>
              </div>
            </div>
          </div>

          <div className="text-sm font-medium text-gray-400 max-w-3xl mx-auto bg-black/20 p-4 rounded-xl border border-white/5">
            Every ROI figure is calculated from your organization's actual roles, tasks, and compensation — not industry averages.
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[#FAF9F5] border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Enterprise FAQs</h2>
          </div>

          <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
            {[
              { 
                q: "How does deployment work at enterprise scale?", 
                a: "SSO/SCIM for identity, combined with a lightweight OS-level agent pushed via MDM. No network proxies or routing changes needed. Phased rollout by department. Fully deployed within 4 weeks." 
              },
              { 
                q: "What about security and compliance?", 
                a: "Devise uses Zero Content Capture (Privacy by Design). We only monitor process telemetry and network metadata. SOC 2 Type II certified, GDPR compliant, and ready for strict DPDP Act requirements." 
              },
              { 
                q: "How does it integrate with our existing tools?", 
                a: "Devise integrates out-of-the-box with Okta, Microsoft Entra, Splunk, Datadog, Microsoft Sentinel, and your existing GRC platforms via webhook and API." 
              },
              { 
                q: "What does the board report look like?", 
                a: "The board report provides an immediate executive summary of AI Exposure, quantifying tools in use, shadow AI gaps, and specific regulatory or policy flags — generated in real time and audit-ready." 
              },
              { 
                q: "How does procurement work?", 
                a: "We offer custom enterprise licensing based on seat count and data retention requirements. Dedicated onboarding, security reviews, and MSA negotiation are fully supported." 
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
            For Enterprise
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your AI investment should have a <span className="text-brand-orange">number</span> attached to it.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Dedicated onboarding. Security review package. Board-ready in 90 days.
          </p>
          
          <Link to="/demo" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white rounded-full px-8 py-4 font-bold text-lg hover:bg-orange-600 transition-transform hover:scale-105 shadow-xl shadow-brand-orange/20 w-full sm:w-auto">
            Get a Demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};
