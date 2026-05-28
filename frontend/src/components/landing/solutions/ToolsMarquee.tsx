import React from "react";

const tools = [
  "ChatGPT", "Claude", "Gemini", "Copilot", "Midjourney", "Cursor",
  "Notion AI", "Perplexity", "Stable Diffusion", "Runway", "Grammarly",
  "Descript", "Tome", "Loom AI", "Gamma", "Adobe Firefly", "Canva AI",
  "Replit", "v0", "Bolt", "Lovable", "Windsurf"
];

export const ToolsMarquee = () => {
  return (
    <div className="w-full bg-[#12100E] text-white py-12 md:py-20 border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <h3 className="text-xs tracking-[0.2em] font-bold text-gray-500 uppercase">
          Detecting 6,500+ AI tools across your org
        </h3>
      </div>
      
      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden w-full group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 py-2">
          {/* We duplicate the list to create a seamless infinite scroll effect */}
          {[...tools, ...tools, ...tools].map((tool, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 hover:border-brand-orange/50 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-brand-orange" />
              <span className="font-medium text-sm tracking-wide text-gray-300">{tool}</span>
            </div>
          ))}
        </div>
        
        {/* Gradients to fade out edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#12100E] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#12100E] to-transparent"></div>
      </div>
    </div>
  );
};
