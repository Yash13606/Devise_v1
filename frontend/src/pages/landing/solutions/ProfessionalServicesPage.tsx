import React from "react";
import { Link } from "react-router-dom";
import { ToolsMarquee } from "../../../components/landing/solutions/ToolsMarquee";
import { ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";

import { Layout } from "../../../components/landing/Layout";

export const ProfessionalServicesPage = () => {
  return (
    <Layout>
    <main className="min-h-screen bg-[#F5F2EB] pt-24 font-serif text-[#111111]">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-32 max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 items-center">
        
        <div className="md:col-span-6 relative z-10">
          <div className="inline-block border border-[#111111] px-4 py-2 text-xs font-mono tracking-widest uppercase mb-12 animate-fade-in-up">
            For Consulting & Legal
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05] animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Your teams use AI.<br/>
            Your clients demand<br/>
            <span className="italic font-light text-[#A87B4E]">confidentiality.</span>
          </h1>
          
          <p className="text-xl md:text-2xl max-w-xl mb-12 font-sans font-light text-[#333333] animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Full visibility into AI usage across professional services. Protect client data while scaling AI adoption.
          </p>
          
          <div className="flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link to="/demo" className="bg-[#111111] text-[#F5F2EB] px-8 py-4 font-sans font-medium text-lg hover:bg-[#2A2A2A] transition-colors flex items-center gap-3">
              Get a Demo <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Editorial Image Wrapper - Asymmetric */}
        <div className="md:col-span-6 relative animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="absolute -inset-4 border border-[#E0D8C8] -z-10 translate-x-4 translate-y-4" />
          <img src="/images/profservices_editorial_1779894803440.png" alt="Devise Analytics for Professional Services" className="w-full h-[400px] md:h-[600px] object-cover grayscale-[0.2]" />
          <div className="absolute bottom-6 left-[-20%] bg-white p-6 shadow-2xl max-w-sm hidden lg:block border border-[#F5F2EB]">
            <p className="font-sans text-sm text-[#555] italic leading-relaxed">
              "The ability to prove to our enterprise clients that their strategy documents are not training public LLMs has become our biggest competitive advantage in RFPs this year."
            </p>
          </div>
        </div>
      </section>

      <div className="border-y border-[#E0D8C8] bg-white py-6">
        <ToolsMarquee />
      </div>

      {/* The Client Trust Question - Editorial Grid */}
      <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end mb-16 md:mb-24">
          <div className="md:col-span-8">
            <h3 className="text-4xl md:text-7xl font-medium tracking-tight">
              AI Exposure<br/>Summary — <span className="italic text-[#A87B4E]">Q2 2026</span>
            </h3>
          </div>
          <div className="md:col-span-4 font-sans font-light text-[#555]">
            <p>Generated automatically. Updated in real time. Client audit-ready down to the individual analyst.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-px bg-[#E0D8C8]">
          <div className="md:col-span-5 bg-[#F5F2EB] p-8 md:p-16 flex flex-col justify-between">
            <div className="font-mono text-sm tracking-widest uppercase mb-12">Total Footprint</div>
            <div>
              <div className="text-6xl md:text-8xl font-light tracking-tighter mb-4">942</div>
              <div className="font-sans text-lg text-[#555]">AI tools in active use across the firm</div>
            </div>
          </div>
          <div className="md:col-span-4 bg-[#F5F2EB] p-8 md:p-16 flex flex-col justify-between">
            <div className="font-mono text-sm tracking-widest uppercase mb-12 text-[#A87B4E]">Unapproved</div>
            <div>
              <div className="text-6xl md:text-8xl font-light tracking-tighter mb-4 text-[#A87B4E]">318</div>
              <div className="font-sans text-lg text-[#555]">Unapproved for client data</div>
            </div>
          </div>
          <div className="md:col-span-3 bg-[#111111] p-8 md:p-16 flex flex-col justify-between text-white">
            <div className="font-mono text-sm tracking-widest uppercase mb-12 opacity-50">Critical Risk</div>
            <div>
              <div className="text-6xl md:text-8xl font-light tracking-tighter mb-4 text-[#C19A6B]">41</div>
              <div className="font-sans text-lg opacity-80">Data leakage risks detected this week</div>
            </div>
          </div>
        </div>
      </section>

      {/* Before the Client Finds It */}
      <section className="bg-[#111111] py-16 md:py-32 px-6 text-[#F5F2EB]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24">
            <h3 className="text-4xl md:text-7xl font-medium tracking-tight">
              Stop shadow AI<br/>
              <span className="italic font-light text-[#C19A6B]">before trust is broken.</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            {/* Without Devise */}
            <div className="font-sans">
              <div className="border-b border-[#333] pb-6 mb-10 flex items-center gap-4">
                <AlertTriangle size={24} className="text-[#888]" />
                <h4 className="text-3xl font-serif">Without Devise</h4>
              </div>
              <ul className="space-y-8 font-light text-[#AAA] text-lg">
                <li className="flex items-start gap-6">
                  <span className="font-serif italic text-2xl text-[#666]">01.</span>
                  <span>Client strategy documents pasted into public LLMs</span>
                </li>
                <li className="flex items-start gap-6">
                  <span className="font-serif italic text-2xl text-[#666]">02.</span>
                  <span>No visibility into unapproved meeting transcribers during client interviews</span>
                </li>
                <li className="flex items-start gap-6">
                  <span className="font-serif italic text-2xl text-[#666]">03.</span>
                  <span>Shadow AI invisible to the risk management team</span>
                </li>
                <li className="flex items-start gap-6 text-[#F5F2EB]">
                  <span className="font-serif italic text-2xl text-[#F5F2EB]">04.</span>
                  <span className="font-medium">Confidentiality breach discovered by the client</span>
                </li>
              </ul>
            </div>

            {/* With Devise */}
            <div className="font-sans">
              <div className="border-b border-[#C19A6B] pb-6 mb-10 flex items-center gap-4">
                <ShieldCheck size={24} className="text-[#C19A6B]" />
                <h4 className="text-3xl font-serif text-[#C19A6B]">With Devise</h4>
              </div>
              <ul className="space-y-8 font-light text-[#DDD] text-lg">
                <li className="flex items-start gap-6">
                  <span className="font-serif italic text-2xl text-[#C19A6B]">01.</span>
                  <span>Every AI tool checked against specific client data agreements</span>
                </li>
                <li className="flex items-start gap-6">
                  <span className="font-serif italic text-2xl text-[#C19A6B]">02.</span>
                  <span>Real-time alerts for unapproved transcription tools entering calls</span>
                </li>
                <li className="flex items-start gap-6">
                  <span className="font-serif italic text-2xl text-[#C19A6B]">03.</span>
                  <span>Steer consultants to approved, secure enterprise AI tools automatically</span>
                </li>
                <li className="flex items-start gap-6">
                  <span className="font-serif italic text-2xl text-[#C19A6B]">04.</span>
                  <span className="font-medium text-white">Data leakage stopped before trust is broken</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-40 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-7xl font-medium mb-12 tracking-tight leading-[1.1]">
          Your clients will ask how you govern AI.<br />
          <span className="italic font-light text-[#A87B4E]">Have the answer ready.</span>
        </h2>
        <p className="text-xl font-sans font-light text-[#555] mb-16">
          Dedicated risk onboarding. Client audit trail from day one. Live in 60 days.
        </p>
        <Link to="/demo" className="inline-flex items-center gap-3 bg-[#111111] text-white px-10 py-5 font-sans font-medium text-lg hover:bg-[#2A2A2A] transition-colors shadow-2xl">
          Secure Your Firm <ArrowRight size={20} />
        </Link>
      </section>
    </main>
    </Layout>
  );
};
