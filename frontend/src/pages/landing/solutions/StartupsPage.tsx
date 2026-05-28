import React from "react";
import { Link } from "react-router-dom";
import { ToolsMarquee } from "../../../components/landing/solutions/ToolsMarquee";
import { ArrowRight, Target, Activity, Zap, CheckCircle2 } from "lucide-react";
import { Layout } from "../../../components/landing/Layout";

export const StartupsPage = () => {
  return (
    <Layout>
    <main className="min-h-screen bg-[#050505] pt-24 font-body text-gray-300 selection:bg-brand-orange/30">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden bg-[#0a0806] px-6 border-b border-white/5">
        {/* Cinematic Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f95001]/15 via-[#f95001]/5 to-transparent blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse duration-10000" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#f95001] text-[10px] tracking-widest uppercase font-mono font-bold mb-12 shadow-2xl">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f95001] animate-pulse" />
          For Startups &middot; 20–200 Employees
        </div>
        
        <h1 className="text-5xl md:text-8xl lg:text-[110px] font-display text-white tracking-tighter mb-8 max-w-5xl leading-[0.9] drop-shadow-2xl">
          You told your team<br/>
          to use AI.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f95001] to-[#ff8c42] italic pr-4">Are they?</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-[#a09e9c] max-w-3xl mb-14 font-light leading-relaxed">
          Install Devise. See your entire team's AI usage in <span className="text-white font-medium border-b border-white/30 pb-0.5">60 seconds</span>.<br className="hidden md:block" />
          10x their effectiveness in <span className="text-white font-medium border-b border-white/30 pb-0.5">30 days</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            to="/demo" 
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-[#0a0806] text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-500 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,80,1,0.4)]"
          >
            <div className="absolute inset-0 bg-[#f95001] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Get a Demo</span>
          </Link>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="border-y border-white/5 bg-[#0a0a0a] py-6 flex flex-col items-center">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
          Detecting 6,500+ AI tools across your org
        </div>
        <ToolsMarquee />
      </div>

      {/* How It Works Section */}
      <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto bg-white rounded-3xl md:rounded-[3rem] mt-16 md:mt-24 shadow-2xl">
        <div className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-bold tracking-widest text-brand-orange uppercase mb-4">How It Works</h2>
          <h3 className="text-3xl md:text-6xl font-display font-bold text-brand-dark tracking-tight mb-6">
            From install to insight in <span className="text-brand-orange">five minutes</span>
          </h3>
          <p className="text-xl text-brand-gray">
            No SSO. No IT tickets. No onboarding calls. Download the app and Devise does the rest.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 px-4 md:px-8 pb-16">
          {/* Card 1 */}
          <div className="flex flex-col group">
            <div className="text-xs font-bold text-brand-orange mb-3 uppercase tracking-widest">Under 60s</div>
            <h4 className="text-2xl font-bold text-brand-dark mb-3">Your team, mapped</h4>
            <p className="text-brand-gray text-sm mb-8 flex-grow">
              Devise uses professional data to automatically reconstruct your org. No org chart upload, no HRIS integration. Every person, their role, and their department in under 60 seconds.
            </p>
            
            {/* Terminal Map UI */}
            <div className="bg-[#12100E] rounded-2xl p-6 text-gray-300 font-mono text-xs border border-gray-800 shadow-xl mt-auto">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 text-[10px] uppercase tracking-widest text-brand-orange">
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-brand-orange"/><div className="w-2 h-2 rounded-full bg-brand-orange opacity-50"/><div className="w-2 h-2 rounded-full bg-brand-orange opacity-20"/></div>
                Devise - Team Map
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2"><span>Engineering</span><span className="text-brand-orange">12</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span>Sales</span><span className="text-brand-orange">8</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span>Marketing</span><span className="text-brand-orange">6</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span>Product</span><span className="text-brand-orange">4</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span>Finance</span><span className="text-brand-orange">3</span></div>
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t border-white/10 text-white font-bold">
                <span>33 people mapped</span>
                <span className="bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded text-[10px]">LIVE</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col group">
            <div className="text-xs font-bold text-brand-orange mb-3 uppercase tracking-widest">1:00 – 5:00</div>
            <h4 className="text-2xl font-bold text-brand-dark mb-3">Your AI opportunity, scored</h4>
            <p className="text-brand-gray text-sm mb-8 flex-grow">
              Every role mapped to its actual tasks, scored for AI automatability. A complete AI Opportunity Assessment. Consultants charge six figures for this. You get it in 5 minutes.
            </p>
            
            {/* Opportunity UI */}
            <div className="bg-brand-cream border border-gray-200 rounded-2xl p-6 shadow-xl mt-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange" />
              <div className="text-[10px] uppercase tracking-widest font-bold text-brand-gray mb-6">AI Opportunity Assessment</div>
              <div className="text-5xl font-display font-bold text-brand-orange mb-2 tracking-tight">$2.1M<span className="text-2xl text-brand-dark font-normal">/year</span></div>
              <div className="text-xs text-brand-gray mb-8">automatable work identified</div>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-brand-gray">Engineering</span><span className="text-brand-orange">$840K</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-brand-gray">Sales</span><span className="text-brand-orange">$520K</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-brand-gray">Marketing</span><span className="text-brand-orange">$380K</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-brand-gray">Product</span><span className="text-brand-orange">$220K</span></div>
                <div className="flex justify-between">                     <span className="text-brand-gray">Finance</span><span className="text-brand-orange">$140K</span></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col group">
            <div className="text-xs font-bold text-brand-orange mb-3 uppercase tracking-widest">Day 1 – 30</div>
            <h4 className="text-2xl font-bold text-brand-dark mb-3">Adoption, climbing</h4>
            <p className="text-brand-gray text-sm mb-8 flex-grow">
              Devise starts working. Steering people to better tools, pushing workflows that work, coaching the ones who aren't using AI yet. You watch the adoption curve bend upward.
            </p>
            
            {/* Chart UI */}
            <div className="bg-[#12100E] rounded-2xl p-6 border border-gray-800 shadow-xl mt-auto">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 text-[10px] uppercase tracking-widest text-brand-orange">
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-brand-orange"/><div className="w-2 h-2 rounded-full bg-brand-orange opacity-50"/><div className="w-2 h-2 rounded-full bg-brand-orange opacity-20"/></div>
                Adoption - 30 Days
              </div>
              
              <div className="h-32 flex items-end gap-1 mb-4">
                {[12, 14, 15, 18, 20, 22, 28, 32, 35, 42, 48, 52, 58, 65, 75, 85, 95, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-brand-orange rounded-t-sm" style={{ height: `${h}%`, opacity: 0.4 + (i * 0.03) }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-6">
                <span>Day 1</span><span>Day 15</span><span>Day 30</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Org-wide adoption</span>
                <span className="text-xl font-bold text-brand-orange">22% → 61%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Engine Section */}
      <section className="py-16 md:py-32 px-6 max-w-5xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="text-xs font-bold tracking-widest text-brand-orange uppercase mb-4">The Engine</h2>
          <h3 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight mb-6">
            Devise doesn't just measure.<br/>It <span className="text-brand-orange">intervenes.</span>
          </h3>
          <p className="text-xl text-gray-400 max-w-3xl">
            Four layers of active intervention that take your team from "we bought AI tools" to "our people are measurably more productive because of AI."
          </p>
        </div>

        <div className="space-y-16">
          {/* Engine Card 1 */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center border-t border-white/5 pt-20">
            <div className="order-1">
              <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-display font-bold text-xl rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(249,80,1,0.2)]">1</div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Tool Steering</h4>
              <h5 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">Steer people to the tools you already pay for</h5>
              <p className="text-gray-400 text-base leading-relaxed">
                When someone on your team uses ChatGPT in the browser to debug code but you have unused Cursor licenses, Devise catches it and nudges them to switch. You stop wasting money. They get a better tool.
              </p>
            </div>
            <div className="order-2 bg-[#12100E] border border-white/10 rounded-2xl p-8 font-mono text-xs shadow-2xl relative group overflow-hidden hover:border-white/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-5 mb-5 text-brand-orange uppercase tracking-widest font-bold text-[10px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse shadow-[0_0_8px_rgba(249,80,1,0.8)]"/> Tool Steering</div>
                <span className="text-gray-600">Just now</span>
              </div>
              <p className="relative z-10 text-white font-bold mb-5 text-[13px] leading-relaxed">4 engineers using ChatGPT for code tasks. You have 6 unused Cursor seats.</p>
              <p className="relative z-10 text-gray-400 mb-8 text-[13px] leading-relaxed">Engineers who switched to Cursor saw 3x faster debugging. Nudging your team to switch.</p>
              <p className="relative z-10 text-gray-500 uppercase tracking-widest mb-8 text-[11px] border-l-2 border-brand-orange pl-3">$2,400/yr in unused licenses recovered</p>
              <button className="relative z-10 text-brand-orange uppercase tracking-widest font-bold text-[11px] hover:text-white transition-colors group-hover:translate-x-2 duration-300 flex items-center gap-2">View Details <span>→</span></button>
            </div>
          </div>

          {/* Engine Card 2 */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center border-t border-white/5 pt-20">
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-display font-bold text-xl rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(249,80,1,0.2)]">2</div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Workflow Discovery</h4>
              <h5 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">Find what's working and spread it to everyone</h5>
              <p className="text-gray-400 text-base leading-relaxed">
                Two people on your sales team built an AI prospecting workflow that saves 6 hours a week each. The other 8 salespeople don't know about it. Devise discovers it, packages it, and pushes it to the whole team.
              </p>
            </div>
            <div className="order-2 md:order-1 bg-[#12100E] border border-white/10 rounded-2xl p-8 font-mono text-xs shadow-2xl relative group overflow-hidden hover:border-white/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-5 mb-5 text-brand-orange uppercase tracking-widest font-bold text-[10px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse shadow-[0_0_8px_rgba(249,80,1,0.8)]"/> Workflow Found</div>
                <span className="text-gray-600">2h ago</span>
              </div>
              <p className="relative z-10 text-white font-bold mb-5 text-[13px] leading-relaxed">AI prospecting workflow discovered in Sales. 2 people saving 6 hrs/week each.</p>
              <p className="relative z-10 text-gray-400 mb-8 text-[13px] leading-relaxed">8 other salespeople doing this manually. Distributing the workflow now.</p>
              <p className="relative z-10 text-gray-500 uppercase tracking-widest mb-8 text-[11px] border-l-2 border-brand-orange pl-3">Estimated org-wide savings: 48 hrs/week</p>
              <button className="relative z-10 text-brand-orange uppercase tracking-widest font-bold text-[11px] hover:text-white transition-colors group-hover:translate-x-2 duration-300 flex items-center gap-2">View Workflow <span>→</span></button>
            </div>
          </div>

          {/* Engine Card 3 */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center border-t border-white/5 pt-20">
            <div className="order-1">
              <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-display font-bold text-xl rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(249,80,1,0.2)]">3</div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Personalized Coaching</h4>
              <h5 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">Teach each person what they're missing</h5>
              <p className="text-gray-400 text-base leading-relaxed">
                Your marketing lead uses ChatGPT daily for social copy but has never tried it for audience research - where the top marketers in your org get 3x leverage. Devise delivers a 3-minute micro-lesson.
              </p>
            </div>
            <div className="order-2 bg-[#12100E] border border-white/10 rounded-2xl p-8 font-mono text-xs shadow-2xl relative group overflow-hidden hover:border-white/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-5 mb-5 text-brand-orange uppercase tracking-widest font-bold text-[10px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse shadow-[0_0_8px_rgba(249,80,1,0.8)]"/> Coaching</div>
                <span className="text-gray-600">1d ago</span>
              </div>
              <p className="relative z-10 text-white font-bold mb-5 text-[13px] leading-relaxed">Marketing: AI used for copy but not research. Top marketers get 3x leverage.</p>
              <p className="relative z-10 text-gray-400 mb-8 text-[13px] leading-relaxed">Delivered micro-coaching to 4 marketers on AI-powered audience research.</p>
              <p className="relative z-10 text-gray-500 uppercase tracking-widest mb-8 text-[11px] border-l-2 border-brand-orange pl-3">Avg workflows per person: 2.1 → 5.7</p>
              <button className="relative z-10 text-brand-orange uppercase tracking-widest font-bold text-[11px] hover:text-white transition-colors group-hover:translate-x-2 duration-300 flex items-center gap-2">View Progress <span>→</span></button>
            </div>
          </div>

          {/* Engine Card 4 */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center border-t border-white/5 pt-20">
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-display font-bold text-xl rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(249,80,1,0.2)]">4</div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Friction Removal</h4>
              <h5 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">Catch people giving up and help them succeed</h5>
              <p className="text-gray-400 text-base leading-relaxed">
                Someone on ops pasted the same document into ChatGPT three times and gave up each time. The doc was too long for the context window. Devise detects the pattern and suggests Claude with a better approach.
              </p>
            </div>
            <div className="order-2 md:order-1 bg-[#12100E] border border-white/10 rounded-2xl p-8 font-mono text-xs shadow-2xl relative group overflow-hidden hover:border-white/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-5 mb-5 text-brand-orange uppercase tracking-widest font-bold text-[10px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse shadow-[0_0_8px_rgba(249,80,1,0.8)]"/> Friction Detected</div>
                <span className="text-gray-600">3h ago</span>
              </div>
              <p className="relative z-10 text-white font-bold mb-5 text-[13px] leading-relaxed">Ops team member abandoned 3 ChatGPT sessions on the same document.</p>
              <p className="relative z-10 text-gray-400 mb-8 text-[13px] leading-relaxed">Document exceeds context window. Suggested Claude with chunked approach.</p>
              <p className="relative z-10 text-green-500 uppercase tracking-widest mb-8 text-[11px] border-l-2 border-brand-orange pl-3">Session completed successfully</p>
              <button className="relative z-10 text-brand-orange uppercase tracking-widest font-bold text-[11px] hover:text-white transition-colors group-hover:translate-x-2 duration-300 flex items-center gap-2">View Resolution <span>→</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* The Math */}
      <section className="py-16 md:py-32 px-6 max-w-5xl mx-auto border-t border-white/10 text-center">
        <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">The Math</h2>
        <h3 className="text-3xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
          The ROI is <span className="text-brand-orange">obvious</span>
        </h3>
        <p className="text-lg text-gray-400 mb-20 max-w-2xl mx-auto">
          A 50-person startup spending $10/user/month on AI tools. Here's what Devise finds.
        </p>
        
        <div className="grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 text-left md:text-center">
          <div className="pt-8 md:pt-0 px-4">
            <div className="text-4xl md:text-7xl font-display font-bold text-brand-orange mb-4 tracking-tight">$6K</div>
            <div className="text-xs uppercase tracking-widest font-bold text-white mb-2">Annual AI Spend</div>
            <div className="text-sm text-gray-500">$10/user/month × 50 people on AI tools</div>
          </div>
          <div className="pt-8 md:pt-0 px-4">
            <div className="text-4xl md:text-7xl font-display font-bold text-white mb-4 tracking-tight">$380K</div>
            <div className="text-xs uppercase tracking-widest font-bold text-white mb-2">Automatable Work / Year</div>
            <div className="text-sm text-gray-500">Scored by role, task, and salary band</div>
          </div>
          <div className="pt-8 md:pt-0 px-4">
            <div className="text-4xl md:text-7xl font-display font-bold text-brand-orange mb-4 tracking-tight">63x</div>
            <div className="text-xs uppercase tracking-widest font-bold text-white mb-2">Potential ROI</div>
            <div className="text-sm text-gray-500">Even at 10% capture, that's 6x</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-16 max-w-lg mx-auto uppercase tracking-widest leading-loose">
          Every ROI figure is calculated from your team's actual roles, tasks, and compensation - not industry averages.
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-40 px-6 text-center relative overflow-hidden bg-brand-orange/5">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand-orange/20 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-6">For Startups</h2>
          <h3 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 tracking-tighter leading-[1.05]">
            Your team should be 10x more effective with AI.<br />
            <span className="text-brand-orange">Find out if they are.</span>
          </h3>
          <p className="text-xl text-gray-400 mb-12 font-light">
            No contracts. No IT involvement. See results in your first session.
          </p>
          <Link to="/demo" className="inline-flex items-center gap-2 bg-brand-orange text-white px-10 py-5 font-bold text-xl hover:bg-orange-600 transition-colors shadow-[0_0_40px_rgba(249,115,22,0.3)]">
            GET A DEMO
          </Link>
        </div>
      </section>
    </main>
    </Layout>
  );
};
