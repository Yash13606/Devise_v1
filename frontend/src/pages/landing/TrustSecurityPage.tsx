import React from "react";

import { Layout } from "../../components/landing/Layout";

const TrustSecurityPage: React.FC = () => {
  return (
    <Layout>
    <main className="bg-white text-gray-900 font-body pt-24">
      {/* Hero */}
      <section className="bg-brand-orange text-white py-16 md:py-20 text-center animate-fade-in-up">
        <h1 className="text-3xl md:text-5xl font-display mb-4">Safeguarding – Trust & Security</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          The behavioral data Devise collects is sensitive by nature. The engine is built with enterprise‑grade security at every layer. Your data never trains models. Your employees never see the data source.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/demo" className="px-6 py-3 bg-white text-brand-orange rounded-md hover:bg-gray-100 transition">
            Get a Demo
          </a>
          <a href="/whitepaper" className="px-6 py-3 bg-brand-navy text-white rounded-md hover:bg-brand-navy/90 transition">
            Read the Whitepaper
          </a>
        </div>
      </section>

      {/* Phases */}
      <section className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Phase 1 */}
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-display mb-4">Phase 1 – Connectors</h2>
          <p className="mb-2">
            Devise connects to what you already run. Three deployment layers give the engine visibility into identity, network traffic, and business systems. Each connector unlocks a deeper level of intelligence.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Zero‑friction deployment. Startups install a Mac/Windows app in 60 seconds.</li>
            <li>Enterprises integrate through their existing identity providers and security infrastructure.</li>
            <li>No network routing changes required.</li>
          </ul>
        </div>
        {/* Phase 2 */}
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-display mb-4">Phase 2 – Behavioral Signals</h2>
          <p className="mb-2">
            Once connected, the engine observes AI tool usage across the entire organization. Not just one vendor's ecosystem. All 6,500+ AI tools.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Professional intelligence reconstructs your org chart without SSO or manual uploads.</li>
            <li>Instant team mapping, job‑to‑be‑done inference, and AI opportunity assessment.</li>
            <li>Cross‑company intelligence creates a data network effect.</li>
          </ul>
        </div>
        {/* Phase 3 */}
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-display mb-4">Phase 3 – The Sidekick</h2>
          <p className="mb-2">
            The Sidekick is the Act layer. It takes behavioral intelligence and actively drives adoption, efficiency, and skill development across the org.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Intelligent Tool Steering – intervene in real time when sub‑optimal tools are used.</li>
            <li>Workflow Discovery & Distribution – surface high‑performing AI workflows.</li>
            <li>Personalized AI Coaching – micro‑coaching based on actual usage patterns.</li>
            <li>Friction Detection & Removal – spot struggling employees and intervene.</li>
          </ul>
        </div>
        {/* Phase 4 */}
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-display mb-4">Phase 4 – The Loop</h2>
          <p className="mb-2">
            Devise owns the entire measurement loop. Observe the before state, perform the intervention, observe the after state, calculate the delta.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Time Savings – hours recovered per week, attributed to specific Sidekick interventions.</li>
            <li>License Optimization – redundant licenses identified and reclaimed.</li>
            <li>Adoption Velocity – percentage of workforce effectively using AI.</li>
            <li>Workflow Multiplication – distinct AI use cases per employee.</li>
            <li>Salary‑calibrated ROI – realistic value in monetary terms.</li>
          </ul>
        </div>
        {/* Phase 5 */}
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-display mb-4">Phase 5 – Trust & Security</h2>
          <p className="mb-2">
            The behavioral data Devise collects is sensitive by nature. The engine is built with enterprise‑grade security at every layer.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-6 bg-trust-card-bg text-white rounded-lg shadow-lg" aria-label="Privacy by design">
              <h3 className="font-display text-xl mb-2">Privacy by design</h3>
              <p>Professional intelligence powers the experience but is never surfaced to the end user.</p>
            </div>
            <div className="p-6 bg-trust-card-bg text-white rounded-lg shadow-lg" aria-label="SOC 2 Type II compliance">
              <h3 className="font-display text-xl mb-2">SOC 2 Type II compliance</h3>
              <p>Controls for security, availability, and confidentiality. Audited annually by independent third parties.</p>
            </div>
            <div className="p-6 bg-trust-card-bg text-white rounded-lg shadow-lg" aria-label="Data residency options">
              <h3 className="font-display text-xl mb-2">Data residency options</h3>
              <p>US, EU, and custom regional hosting. Enterprise customers specify exactly where their data lives.</p>
            </div>
            <div className="p-6 bg-trust-card-bg text-white rounded-lg shadow-lg" aria-label="SSO / SCIM provisioning">
              <h3 className="font-display text-xl mb-2">SSO / SCIM provisioning</h3>
              <p>Enterprise identity management through standard protocols. Automated provisioning tied to your identity provider.</p>
            </div>
          </ul>
        </div>
      </section>

      {/* Tool List */}
      <section className="bg-gray-50 py-12 animate-fade-in-up">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-display text-center mb-8">Supported AI Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              "ChatGPT",
              "Claude",
              "Gemini",
              "Copilot",
              "Midjourney",
              "Cursor",
              "Google Workspace",
              "Microsoft Entra ID",
            ].map((tool) => (
              <div key={tool} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
                <span className="font-medium">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    </Layout>
  );
};

export { TrustSecurityPage };
