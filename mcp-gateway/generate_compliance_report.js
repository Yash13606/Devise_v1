require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateReport() {
  console.log("Generating SOC 2 and GDPR Compliance Evidence Report...");
  
  // 1. Fetch Firewall Policies
  const { data: policies } = await supabase.from('firewall_rules').select('*');
  
  // 2. Fetch Blocked Events (Evidence of Enforcement)
  const { data: blocks } = await supabase
    .from('detection_events')
    .select('*')
    .eq('is_blocked', true)
    .order('timestamp', { ascending: false })
    .limit(1000);
    
  // 3. Fetch Data Exposure Events (Evidence of PII/PHI Monitoring)
  const { data: exposures } = await supabase
    .from('detection_events')
    .select('*')
    .neq('data_type', 'clean')
    .order('timestamp', { ascending: false })
    .limit(1000);
    
  // 4. Fetch Audit Ledger
  const { data: ledger } = await supabase
    .from('mcp_audit_ledger')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);

  const report = {
    generated_at: new Date().toISOString(),
    frameworks: ["SOC 2 Type II", "GDPR", "HIPAA"],
    policies_enforced: policies ? policies.length : 0,
    enforcement_events: blocks ? blocks.length : 0,
    data_exposure_monitored: exposures ? exposures.length : 0,
    evidence: {
      policies: policies,
      blocks_sample: blocks ? blocks.slice(0, 10) : [],
      exposures_sample: exposures ? exposures.slice(0, 10) : [],
      audit_ledger: ledger ? ledger.slice(0, 10) : []
    }
  };

  fs.writeFileSync('compliance_evidence_report.json', JSON.stringify(report, null, 2));
  console.log("Report saved to compliance_evidence_report.json");
}

generateReport().catch(console.error);
