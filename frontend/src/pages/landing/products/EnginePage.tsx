import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../../components/landing/Layout";

export const EnginePage = () => {
  const [activeSection, setActiveSection] = useState("01");

  // Simple scroll spy to highlight the active section in the sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["phase-1", "phase-2", "phase-3", "phase-4", "phase-5"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(id.split("-")[1].padStart(2, "0"));
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Layout>
      <main className="font-body text-gray-800 selection:bg-[#f95001]/30">
        
        {/* HERO SECTION (DARK) */}
        <section className="relative px-6 pt-32 md:pt-48 pb-16 md:pb-32 flex flex-col items-center justify-center text-center bg-[#0a0806] overflow-hidden min-h-screen">
          {/* Subtle glowing ambient orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#f95001]/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 text-[#f95001] text-[10px] tracking-widest uppercase font-mono font-bold mb-8 px-4 py-1.5 border border-[#f95001]/30 rounded-full bg-[#f95001]/10">
            The Devise Engine
          </div>
          
          <h1 className="relative z-10 text-5xl md:text-7xl font-display text-white tracking-tight leading-tight max-w-4xl mx-auto mb-8 drop-shadow-2xl">
            AI adoption engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a09e9c]">precision, depth, and proof.</span>
          </h1>
          
          <p className="relative z-10 text-base md:text-lg text-[#a09e9c] max-w-2xl mx-auto font-light leading-relaxed mb-12">
            The Devise Engine connects to your infrastructure, reads behavioral signals across 6,500+ AI tools, and runs a continuous loop of detection, intervention, and measurement.
          </p>
          
          <Link 
            to="/demo" 
            className="relative z-10 bg-white text-[#0a0806] px-10 py-4 text-xs font-semibold tracking-wide rounded-full hover:bg-[#f95001] hover:text-white transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,80,1,0.4)] hover:-translate-y-1"
          >
            Get a Demo
          </Link>
        </section>

        {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
        <section className="bg-[#f9f8f6] relative">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row relative">
            
            {/* STICKY SIDEBAR */}
            <aside className="hidden lg:block w-72 shrink-0 relative">
              <div className="sticky top-32 pl-8 pr-12 py-12">
                <div className="relative flex flex-col gap-8">
                  {[
                    { id: "01", label: "CONNECTORS", desc: "Integration Layer" },
                    { id: "02", label: "BEHAVIORAL SIGNALS", desc: "Data Processing" },
                    { id: "03", label: "THE SIDEKICK", desc: "Active Intervention" },
                    { id: "04", label: "THE LOOP", desc: "Continuous Feedback" },
                    { id: "05", label: "TRUST & SECURITY", desc: "Governance Foundation" }
                  ].map((item, idx) => (
                    <a 
                      key={item.id}
                      href={`#phase-${parseInt(item.id)}`}
                      className={`flex items-start gap-4 transition-all duration-300 group ${activeSection === item.id ? "opacity-100 translate-x-2" : "opacity-40 hover:opacity-100 hover:translate-x-1"}`}
                    >
                      <div className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-500 mt-0.5 ${
                        activeSection === item.id 
                          ? 'border-[#f95001] bg-[#f95001]/10 text-[#f95001]' 
                          : 'border-[#e5e4e2] text-[#a09e9c]'
                      }`}>
                        <span className="font-mono text-[9px] font-bold">{item.id}</span>
                      </div>
                      <div className="flex flex-col pt-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0a0806] group-hover:text-[#f95001] transition-colors">{item.label}</span>
                        <div className={`overflow-hidden transition-all duration-300 ${activeSection === item.id ? 'max-h-10 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <span className="text-[10px] text-[#605e5c] uppercase tracking-widest font-semibold">{item.desc}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* CONTENT AREA */}
            <div className="flex-1 border-l border-[#e5e4e2]">
              
              {/* PHASE 1: CONNECTORS */}
              <div id="phase-1" className="p-6 md:p-24 border-b border-[#e5e4e2] overflow-x-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 border border-[#e5e4e2] flex items-center justify-center">
                    <span className="text-[#f95001] font-mono text-[10px] font-bold">01</span>
                  </div>
                  <span className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold">Phase 1</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                  <h2 className="text-4xl md:text-5xl font-display text-[#0a0806]">Connectors</h2>
                  <div className="text-sm text-[#605e5c] leading-relaxed flex flex-col gap-6">
                    <p>Devise connects to what you already run. Three deployment layers give the engine visibility into identity, network traffic, and business systems. Each connector unlocks a deeper level of intelligence.</p>
                    <p>Zero-friction deployment. Startups install a Mac/Windows app in 60 seconds. Enterprises integrate through their existing identity providers and security infrastructure. No new agents on every endpoint. No browser extensions.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-24">
                  {["Microsoft", "Google", "Zscaler", "Palo Alto", "Netskope", "CrowdStrike", "F5", "Checkpoint", "Salesforce", "ServiceNow"].map(connector => (
                    <div key={connector} className="px-4 py-2 border border-black/5 bg-white shadow-sm rounded-xl text-[11px] font-semibold text-[#0a0806] flex items-center gap-2.5 hover:border-black/20 hover:shadow-md hover:-translate-y-0.5 cursor-default transition-all duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#f95001]" />
                      {connector}
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e5e4e2] pt-12">
                  <div className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold mb-12">Specification</div>
                  <div className="flex flex-col gap-12">
                    {[
                      { num: "1.1", title: "Identity provider integration", desc: "Connect through Microsoft Entra ID or Google Workspace. Maps your org chart instantly. Knows who's in engineering, sales, legal, and product without a CSV upload." },
                      { num: "1.2", title: "Network & security infrastructure", desc: "Integrate with Zscaler, Palo Alto, Netskope, CrowdStrike, F5, or Checkpoint. The engine reads network traffic patterns to detect AI tool usage across the entire org." },
                      { num: "1.3", title: "Business system connectors", desc: "Salesforce and ServiceNow integrations pipe AI usage data into existing workflows. ITSM tickets, compliance dashboards, executive reports." },
                      { num: "1.4", title: "Lightweight agent (Mac/Windows app)", desc: "For startups and small teams. Download, install, see everything in 60 seconds. No IT involvement. No MDM required." }
                    ].map(spec => (
                      <div key={spec.num} className="grid md:grid-cols-[100px_1fr] gap-4 md:gap-8 group p-6 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 border border-transparent hover:border-black/5 -mx-6">
                        <div className="flex">
                          <div className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center bg-white group-hover:border-[#f95001] group-hover:shadow-[0_0_15px_rgba(249,80,1,0.2)] transition-all duration-500">
                            <span className="text-[#f95001] font-mono text-[11px] font-bold">{spec.num}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <h4 className="text-sm font-bold text-[#0a0806] uppercase tracking-widest font-mono">{spec.title}</h4>
                          <p className="text-[#605e5c] text-sm leading-relaxed max-w-2xl">{spec.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHASE 2: BEHAVIORAL SIGNALS */}
              <div id="phase-2" className="p-6 md:p-24 border-b border-[#e5e4e2] overflow-x-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 border border-[#e5e4e2] flex items-center justify-center">
                    <span className="text-[#f95001] font-mono text-[10px] font-bold">02</span>
                  </div>
                  <span className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold">Phase 2</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                  <h2 className="text-4xl md:text-5xl font-display text-[#0a0806]">Behavioral Signals</h2>
                  <div className="text-sm text-[#605e5c] leading-relaxed flex flex-col gap-6">
                    <p>Once connected, the engine observes AI tool usage across the entire organization. Not just one vendor's ecosystem. All 6,500+ AI tools. Who's using what, how often, for what kinds of tasks, in what patterns.</p>
                    <p>The engine never starts cold. Professional intelligence from 800 million profiles enables instant team mapping and role-specific inference before observing a single AI session.</p>
                  </div>
                </div>

                <div className="mb-24 p-10 border border-black/5 bg-white rounded-3xl shadow-xl shadow-black/5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f95001]/10 text-[#f95001] text-[10px] tracking-widest uppercase font-mono font-bold mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f95001] animate-pulse" />
                    Powered by Professional Intelligence
                  </div>
                  <div className="text-xs font-mono text-[#a09e9c] uppercase tracking-widest mb-6">Detecting 6,500+ tools including</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm font-bold text-[#0a0806]">
                    {["ChatGPT", "Claude", "Gemini", "Copilot", "Cursor", "Midjourney", "Notion AI", "Perplexity", "Grammarly", "Replit", "v0", "Windsurf", "Runway", "Canva", "Bolt", "Lovable"].map(tool => (
                      <span key={tool} className="px-4 py-2 bg-[#f9f8f6] rounded-lg border border-[#e5e4e2] hover:border-black/20 transition-colors">{tool}</span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#e5e4e2] pt-12">
                  <div className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold mb-12">Specification</div>
                  <div className="flex flex-col gap-12">
                    {[
                      { num: "2.1", title: "Network-layer tool detection", desc: "Detects usage of 6,500+ AI tools by reading traffic patterns. No browser extensions. No API keys. Sees everything your employees use." },
                      { num: "2.2", title: "Instant team mapping", desc: "Professional intelligence reconstructs your org chart without SSO or manual uploads. Mapped by role, department, and seniority in under 60 seconds." },
                      { num: "2.3", title: "Jobs-to-be-done inference", desc: "From job title, seniority, and industry, the engine infers each person's specific tasks. A Senior Financial Analyst does predictable things. The engine knows before day one." },
                      { num: "2.4", title: "AI Opportunity Assessment", desc: "Scores every job to be done by automatability. Generates a complete assessment on day zero. What consultants charge six figures to produce manually, Devise generates in 5 minutes." },
                      { num: "2.5", title: "Cross-company intelligence", desc: "As the installed base grows, the engine benchmarks by role across all customers. Each new customer makes the engine smarter for everyone. A true data network effect." }
                    ].map(spec => (
                      <div key={spec.num} className="grid md:grid-cols-[100px_1fr] gap-4 md:gap-8 group p-6 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 border border-transparent hover:border-black/5 -mx-6">
                        <div className="flex">
                          <div className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center bg-white group-hover:border-[#f95001] group-hover:shadow-[0_0_15px_rgba(249,80,1,0.2)] transition-all duration-500">
                            <span className="text-[#f95001] font-mono text-[11px] font-bold">{spec.num}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <h4 className="text-sm font-bold text-[#0a0806] uppercase tracking-widest font-mono">{spec.title}</h4>
                          <p className="text-[#605e5c] text-sm leading-relaxed max-w-2xl">{spec.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHASE 3: THE SIDEKICK */}
              <div id="phase-3" className="p-6 md:p-24 border-b border-[#e5e4e2] overflow-x-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 border border-[#e5e4e2] flex items-center justify-center">
                    <span className="text-[#f95001] font-mono text-[10px] font-bold">03</span>
                  </div>
                  <span className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold">Phase 3</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-24">
                  <h2 className="text-4xl md:text-5xl font-display text-[#0a0806]">The Sidekick</h2>
                  <div className="text-sm text-[#605e5c] leading-relaxed flex flex-col gap-6">
                    <p>The Sidekick is the Act layer. It takes behavioral intelligence and uses it to actively drive adoption, efficiency, and skill development across the org. Not reporting. Intervention. It does things.</p>
                    <p>Four intervention types, sequenced by data maturity. Tool Steering ships first with existing network data. Workflow Discovery follows with customer density. Coaching and Friction Detection add sophistication over time.</p>
                  </div>
                </div>

                <div className="border-t border-[#e5e4e2] pt-12">
                  <div className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold mb-12">Specification</div>
                  <div className="flex flex-col gap-12">
                    {[
                      { num: "3.1", title: "Intelligent Tool Steering", desc: 'When someone uses a suboptimal tool, the Sidekick intervenes in real time. It sees both demand (what they\'re doing) and supply (what the org pays for). "Your org has Cursor for this. Engineers who switched saw 3x faster debugging."' },
                      { num: "3.2", title: "Workflow Discovery & Distribution", desc: 'Finds high-performing AI workflows built organically by pockets of employees. Packages them. Distributes to similar roles. "Your London legal team found an AI workflow for contract review. Try it."' },
                      { num: "3.3", title: "Personalized AI Coaching", desc: 'Micro-coaching based on actual usage patterns. Knows what the individual does, what good looks like for their role, and the gap. "Marketers using AI for audience research save 6 hrs/week. Here\'s a 3-minute setup."' },
                      { num: "3.4", title: "Friction Detection & Removal", desc: 'Spots struggling employees. High abandonment, repeated attempts, rapid tool-switching. Intervenes with specific fixes. "This document is too long for ChatGPT. Try Claude with this approach instead."' }
                    ].map(spec => (
                      <div key={spec.num} className="grid md:grid-cols-[100px_1fr] gap-4 md:gap-8 group p-6 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 border border-transparent hover:border-black/5 -mx-6">
                        <div className="flex">
                          <div className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center bg-white group-hover:border-[#f95001] group-hover:shadow-[0_0_15px_rgba(249,80,1,0.2)] transition-all duration-500">
                            <span className="text-[#f95001] font-mono text-[11px] font-bold">{spec.num}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <h4 className="text-sm font-bold text-[#0a0806] uppercase tracking-widest font-mono">{spec.title}</h4>
                          <p className="text-[#605e5c] text-sm leading-relaxed max-w-2xl">{spec.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHASE 4: THE LOOP */}
              <div id="phase-4" className="p-6 md:p-24 border-b border-[#e5e4e2] overflow-x-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 border border-[#e5e4e2] flex items-center justify-center">
                    <span className="text-[#f95001] font-mono text-[10px] font-bold">04</span>
                  </div>
                  <span className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold">Phase 4</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-24">
                  <h2 className="text-4xl md:text-5xl font-display text-[#0a0806]">The Loop</h2>
                  <div className="text-sm text-[#605e5c] leading-relaxed flex flex-col gap-6">
                    <p>Devise owns the entire measurement loop. Observe the before state. Perform the intervention. Observe the after state. Calculate the delta. The causal chain is never broken.</p>
                    <p>This is why Devise can prove ROI and nobody else can. Dashboards measure adoption at a point in time. Devise measures the impact of each specific intervention it performed.</p>
                  </div>
                </div>

                <div className="border-t border-[#e5e4e2] pt-12">
                  <div className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold mb-12">Specification</div>
                  <div className="flex flex-col gap-12">
                    {[
                      { num: "4.1", title: "Time Savings", desc: "Measured from before/after session patterns. Hours recovered per week, attributed to specific Sidekick interventions." },
                      { num: "4.2", title: "License Optimization", desc: "Redundant licenses identified. Unused purchased licenses activated through Tool Steering. Real dollars saved." },
                      { num: "4.3", title: "Adoption Velocity", desc: "Percentage of workforce effectively using AI, tracked over time. Power user density. Acceleration attributed to specific interventions." },
                      { num: "4.4", title: "Workflow Multiplication", desc: "Distinct AI use cases per employee. The compound effect of the loop measured over time." },
                      { num: "4.5", title: "Salary-calibrated ROI", desc: 'Every metric grounded in realistic loaded costs by role, seniority, and location. "200 hours saved for legal" also means "$47,000 in value."' }
                    ].map(spec => (
                      <div key={spec.num} className="grid md:grid-cols-[100px_1fr] gap-4 md:gap-8 group p-6 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 border border-transparent hover:border-black/5 -mx-6">
                        <div className="flex">
                          <div className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center bg-white group-hover:border-[#f95001] group-hover:shadow-[0_0_15px_rgba(249,80,1,0.2)] transition-all duration-500">
                            <span className="text-[#f95001] font-mono text-[11px] font-bold">{spec.num}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <h4 className="text-sm font-bold text-[#0a0806] uppercase tracking-widest font-mono">{spec.title}</h4>
                          <p className="text-[#605e5c] text-sm leading-relaxed max-w-2xl">{spec.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHASE 5: TRUST & SECURITY (DARK) */}
              <div id="phase-5" className="p-8 md:p-24 bg-[#0a0806] text-white overflow-x-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center">
                    <span className="text-[#f95001] font-mono text-[10px] font-bold">05</span>
                  </div>
                  <span className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold">Safeguarding</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-24">
                  <h2 className="text-4xl md:text-5xl font-display">Trust & Security</h2>
                  <div className="text-sm text-[#a09e9c] leading-relaxed flex flex-col gap-6">
                    <p>The behavioral data Devise collects is sensitive by nature. The engine is built with enterprise-grade security at every layer. Your data never trains models. Your employees never see the data source.</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-12">
                  <div className="text-[#a09e9c] text-[10px] tracking-widest uppercase font-mono font-bold mb-12">Specification</div>
                  <div className="flex flex-col gap-12">
                    {[
                      { num: "5.1", title: "Privacy by design", desc: 'Professional intelligence powers the experience but is never surfaced to the end user. Employees see "AI recommendations for your role." The data infers, it doesn\'t display.' },
                      { num: "5.2", title: "SOC 2 Type II compliance", desc: "Controls for security, availability, and confidentiality. Audited annually by independent third parties." },
                      { num: "5.3", title: "Data residency options", desc: "US, EU, and custom regional hosting. Enterprise customers specify exactly where their data lives." },
                      { num: "5.4", title: "SSO / SCIM provisioning", desc: "Enterprise identity management through standard protocols. Automated provisioning tied to your identity provider." }
                    ].map(spec => (
                      <div key={spec.num} className="grid md:grid-cols-[100px_1fr] gap-4 md:gap-8 group p-6 rounded-2xl hover:bg-[#1a1816] hover:shadow-lg hover:shadow-black/20 transition-all duration-500 border border-transparent hover:border-white/5 -mx-6">
                        <div className="flex">
                          <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-[#0a0806] group-hover:border-[#f95001] group-hover:shadow-[0_0_15px_rgba(249,80,1,0.2)] transition-all duration-500">
                            <span className="text-[#f95001] font-mono text-[11px] font-bold">{spec.num}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-widest font-mono">{spec.title}</h4>
                          <p className="text-[#a09e9c] text-sm leading-relaxed max-w-2xl">{spec.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FINAL CTA (LIGHT) */}
        <section className="bg-[#f9f8f6] py-32 px-6 text-center border-t border-[#e5e4e2]">
          <h2 className="text-4xl md:text-5xl font-display text-[#0a0806] mb-4">See the engine in action.</h2>
          <p className="text-sm text-[#605e5c] mb-12">30-minute walkthrough tailored to your stack.</p>
          <Link 
            to="/demo" 
            className="bg-[#f95001] text-white px-8 py-3 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-[#0a0806] transition-colors"
          >
            Get a Demo
          </Link>
        </section>

      </main>
    </Layout>
  );
};
