import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../../components/landing/Layout";

export const EnterprisePage = () => {
  return (
    <Layout>
      <main className="bg-[#0a0806] min-h-screen font-body text-gray-300 selection:bg-[#f95001]/30">
        
        {/* HERO SECTION */}
        <section className="relative px-6 pt-32 md:pt-40 pb-16 md:pb-32 flex flex-col items-center text-center">
          <div className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-bold mb-12">
            For Enterprise &middot; 1,000+ Employees
          </div>
          
          <h1 className="text-4xl md:text-7xl font-display text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Your board wants to know<br />if AI is working.<br />
            <span className="text-[#f95001] italic">Give them the answer.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#a09e9c] max-w-2xl mt-8 font-light">
            Org-wide AI visibility, adoption at scale, and board-ready ROI proof. <br className="hidden md:block"/> 90 days.
          </p>
          
          <div className="mt-12">
            <Link 
              to="/demo" 
              className="bg-[#f95001] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#e04800] transition-colors inline-block"
            >
              Get a Demo
            </Link>
          </div>
        </section>

        {/* MARQUEE / TICKER SECTION */}
        <section className="py-12 border-y border-white/5 relative overflow-hidden bg-[#0a0806]">
          <div className="text-center text-[#a09e9c] text-xs font-mono mb-8">
            Detecting 6,500+ AI tools across your org
          </div>
          <div className="flex overflow-hidden relative w-full">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0806] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0806] to-transparent z-10" />
            
            <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 px-6 items-center">
                  {["ChatGPT", "Claude", "Gemini", "Copilot", "Midjourney", "Cursor", "Notion AI", "Perplexity", "Stable Diffusion", "Runway", "Grammarly", "Descript", "Tome", "Loom AI", "Gamma", "Adobe Firefly", "Canva AI", "Replit", "v0", "Bolt", "Lovable", "Windsurf"].map((tool) => (
                    <span key={tool} className="text-xl md:text-2xl font-display font-medium text-white">{tool}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEPLOYMENT TIMELINE */}
        <section className="bg-[#f9f8f6] text-[#0a0806] py-16 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#f95001] text-[10px] tracking-widest uppercase font-bold mb-6">
              Deployment
            </div>
            <h2 className="text-3xl md:text-6xl font-display tracking-tight leading-tight max-w-2xl mb-6">
              From procurement to proof in <span className="text-[#f95001]">90 days</span>
            </h2>
            <p className="text-[#605e5c] text-lg max-w-2xl mb-24">
              No endpoint agents. No browser extensions. Integrates with infrastructure you already run.
            </p>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {/* Week 1 */}
              <div className="flex flex-col">
                <div className="text-[#f95001] text-[10px] tracking-widest uppercase font-bold mb-6">Week 1</div>
                <h3 className="text-2xl font-display font-bold mb-4">Connected to your infrastructure</h3>
                <p className="text-[#605e5c] text-sm mb-8 leading-relaxed">
                  SSO/SCIM maps your org. Network connectors give AI tool visibility without touching endpoints.
                </p>
                <ul className="mt-auto space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> SSO/SCIM live
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Network connectors active
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Org mapped
                  </li>
                </ul>
              </div>

              {/* Week 2-4 */}
              <div className="flex flex-col">
                <div className="text-[#f95001] text-[10px] tracking-widest uppercase font-bold mb-6">Week 2–4</div>
                <h3 className="text-2xl font-display font-bold mb-4">Your AI landscape, mapped</h3>
                <p className="text-[#605e5c] text-sm mb-8 leading-relaxed">
                  Shadow AI surfaced across 6,500+ tools. AI opportunity assessment scored by department.
                </p>
                <ul className="mt-auto space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Shadow AI audit
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Opportunity assessment
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Benchmarks set
                  </li>
                </ul>
              </div>

              {/* Month 2-3 */}
              <div className="flex flex-col">
                <div className="text-[#f95001] text-[10px] tracking-widest uppercase font-bold mb-6">Month 2–3</div>
                <h3 className="text-2xl font-display font-bold mb-4">Adoption climbing, waste shrinking</h3>
                <p className="text-[#605e5c] text-sm mb-8 leading-relaxed">
                  All four interventions running. License consolidation underway. First board report generated.
                </p>
                <ul className="mt-auto space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Interventions active
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Savings quantified
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#605e5c]">
                    <div className="w-1.5 h-1.5 bg-[#f95001]" /> Board report delivered
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* THE ENGINE AT SCALE */}
        <section className="bg-[#0a0806] py-16 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="text-[#605e5c] text-[10px] tracking-widest uppercase font-bold mb-6">
                The Engine at Scale
              </div>
              <h2 className="text-3xl md:text-5xl font-display text-white tracking-tight mb-6">
                This is what the engine does in a <span className="text-[#f95001] italic">single week.</span>
              </h2>
              <p className="text-[#a09e9c] text-sm max-w-lg mx-auto">
                Real signals from real orgs. Every row is an intervention the engine ran automatically.
              </p>
            </div>

            <div className="border-t border-white/5">
              {[
                { cat: "Steering", dept: "Engineering", desc: "187 engineers on ChatGPT for code. 340 unused Copilot seats.", impact: "$680K saved" },
                { cat: "Discovery", dept: "Legal", desc: "AI contract review workflow found in London. Distributed to 247 lawyers.", impact: "2,964 hrs/wk" },
                { cat: "Coaching", dept: "Finance", desc: "500 people coached on AI forecasting. Top performers get 4x leverage.", impact: "2.1 → 5.7 workflows" },
                { cat: "Friction", dept: "Operations", desc: "340 abandoned AI sessions detected. Context limits, wrong tools, skill gaps.", impact: "23% → 4%" },
                { cat: "Steering", dept: "Marketing", desc: "12 marketers using Jasper. Enterprise Copilot license unused.", impact: "$28K saved" },
                { cat: "Discovery", dept: "Sales", desc: "AI prospecting workflow spreading from 2 reps to entire team of 45.", impact: "270 hrs/wk" }
              ].map((row, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-full md:w-32 text-[#f95001] text-[10px] tracking-widest uppercase font-bold mb-2 md:mb-0">
                    {row.cat}
                  </div>
                  <div className="w-full md:w-40 text-[#605e5c] text-[10px] tracking-widest uppercase font-bold mb-4 md:mb-0">
                    {row.dept}
                  </div>
                  <div className="flex-1 text-sm text-white font-light pr-4 mb-4 md:mb-0">
                    {row.desc}
                  </div>
                  <div className="text-[#f95001] text-xs font-mono font-bold whitespace-nowrap text-right md:text-left">
                    {row.impact}
                  </div>
                </div>
              ))}
              <div className="py-6 text-center text-[#605e5c] text-xs font-mono">
                + 47 more interventions this week
              </div>
            </div>
          </div>
        </section>

        {/* THE MATH */}
        <section className="py-16 md:py-32 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="text-[#605e5c] text-[10px] tracking-widest uppercase font-bold mb-6">
                The Math
              </div>
              <h2 className="text-3xl md:text-5xl font-display text-white tracking-tight">
                The ROI at scale is <span className="text-[#f95001]">undeniable</span>
              </h2>
              <p className="text-[#a09e9c] text-sm mt-6">
                5,000 employees spending $20/user/month on AI tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 border-t border-white/5">
              <div className="flex flex-col items-center text-center p-12 border-b md:border-b-0 md:border-r border-white/5">
                <div className="text-4xl md:text-6xl font-display font-light text-[#f95001] mb-6">$1.2M</div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[#605e5c] mb-2">Annual AI Spend</div>
                <div className="text-xs text-[#a09e9c] font-light">$20/user/month × 5,000 people</div>
              </div>
              
              <div className="flex flex-col items-center text-center p-12 border-b md:border-b-0 md:border-r border-white/5">
                <div className="text-4xl md:text-6xl font-display font-light text-white mb-6">$19M</div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[#605e5c] mb-2">Automatable Work / Year</div>
                <div className="text-xs text-[#a09e9c] font-light">Scored by role, task, and salary band</div>
              </div>

              <div className="flex flex-col items-center text-center p-12">
                <div className="text-4xl md:text-6xl font-display font-light text-[#f95001] mb-6">16x</div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[#605e5c] mb-2">Potential ROI</div>
                <div className="text-xs text-[#a09e9c] font-light">Even at 10% capture, that's $1.9M</div>
              </div>
            </div>

            <p className="text-center text-[#605e5c] text-xs font-light mt-12 max-w-2xl mx-auto">
              Every ROI figure is calculated from your organization's actual roles, tasks, and compensation — not industry averages.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-32 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-[#f95001] text-[10px] tracking-widest uppercase font-bold mb-12">
              FAQs
            </div>
            
            <div className="space-y-0">
              {/* Active FAQ */}
              <div className="border-b border-white/10 py-8">
                <h3 className="text-xl font-display font-bold text-white mb-4">How does deployment work at enterprise scale?</h3>
                <p className="text-[#a09e9c] text-sm leading-relaxed max-w-3xl">
                  SSO/SCIM for identity, network connectors for visibility. No endpoint agents. Phased rollout by department. Fully deployed within 4 weeks.
                </p>
              </div>

              {/* Inactive FAQs */}
              <div className="border-b border-white/10 py-8">
                <h3 className="text-xl font-display font-bold text-white opacity-60 hover:opacity-100 transition-opacity cursor-pointer">What about security and compliance?</h3>
              </div>
              <div className="border-b border-white/10 py-8">
                <h3 className="text-xl font-display font-bold text-white opacity-60 hover:opacity-100 transition-opacity cursor-pointer">How does it integrate with our existing tools?</h3>
              </div>
              <div className="border-b border-white/10 py-8">
                <h3 className="text-xl font-display font-bold text-white opacity-60 hover:opacity-100 transition-opacity cursor-pointer">What does the board report look like?</h3>
              </div>
              <div className="border-b border-white/10 py-8">
                <h3 className="text-xl font-display font-bold text-white opacity-60 hover:opacity-100 transition-opacity cursor-pointer">How does procurement work?</h3>
              </div>
            </div>

            <div className="mt-12 text-center text-sm text-[#a09e9c]">
              Have more questions? <Link to="/demo" className="text-white underline underline-offset-4 hover:text-[#f95001]">Book a demo</Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA WITH HORIZON GLOW */}
        <section className="relative pt-20 md:pt-40 pb-10 md:pb-20 px-6 text-center overflow-hidden flex flex-col items-center">
          {/* Horizon Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#4a1c02] via-[#2d1203] to-transparent opacity-80 pointer-events-none -z-10" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[1200px] h-64 bg-[#f95001] rounded-[100%] blur-[120px] opacity-40 pointer-events-none -z-10" />

          <div className="text-[#f95001] text-[10px] tracking-widest uppercase font-bold mb-12">
            For Enterprise
          </div>
          <h2 className="text-3xl md:text-6xl font-display text-white tracking-tight max-w-4xl leading-tight mb-8">
            Your AI investment should have a number attached to it.<br />
            <span className="text-[#f95001] italic">We'll show you the number.</span>
          </h2>
          <p className="text-[#a09e9c] text-sm font-light mb-12">
            Dedicated onboarding. Security review package. Board-ready in 90 days.
          </p>
          <Link 
            to="/demo" 
            className="bg-[#f95001] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#e04800] transition-colors shadow-[0_0_40px_rgba(249,80,1,0.2)]"
          >
            Get a Demo
          </Link>
        </section>

      </main>
    </Layout>
  );
};
