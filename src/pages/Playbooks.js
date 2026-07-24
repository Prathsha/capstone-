import React, { useState } from 'react';

const PLAYBOOKS = {
  'Financial Services': {
    steps: [
      { step: 1, title: 'Executive Discovery', desc: 'Engage CIO/CTO with IBM\'s Financial Services Cloud regulatory compliance framework. Open with DORA, Basel IV, or SEC cybersecurity rule impact — establishes IBM as a risk management partner, not just a vendor.' },
      { step: 2, title: 'Technical Architecture Workshop', desc: 'Run a half-day architecture workshop with the client\'s enterprise architect. Map their current state (mainframe, middleware, cloud) to IBM portfolio touchpoints. Identify MQ, OpenShift, or Guardium gaps.' },
      { step: 3, title: 'Competitive Differentiation Briefing', desc: 'Address the AWS/Azure elephant in the room. Use the IBM Financial Services Cloud compliance pack as a differentiator — most hyperscalers cannot provide the same contractual data residency guarantees for regulated workloads.' },
      { step: 4, title: 'Proof of Concept', desc: 'Narrow POC to one high-value use case with measurable outcome. For FinServ: fraud detection model on watsonx.ai or document intelligence for audit trail summarization. Target 6-8 week POC with clear exit criteria.' },
      { step: 5, title: 'Business Case & Commercial', desc: 'Build ROI with IBM\'s FinServ Value Framework. Lead with risk reduction (audit cost, breach cost) over feature comparison. Bring IBM Financing options and multi-year ELA structure for budget flexibility.' },
    ],
    leadProducts: ['IBM watsonx.ai', 'Red Hat OpenShift', 'IBM MQ', 'IBM Guardium', 'IBM Financial Services Cloud'],
    objections: [
      { obj: '"We\'re already investing in Azure/AWS"', response: 'IBM OpenShift runs on Azure and AWS — this is additive, not a replacement. IBM\'s value is the hybrid control plane and enterprise governance that hyperscalers don\'t provide.' },
      { obj: '"IBM is too expensive"', response: 'IBM Financing can convert CapEx to OpEx. An ELA across MQ + OpenShift + Instana typically reduces per-product spend 20–35% vs. individual SKUs. Request an ELA sizing call.' },
      { obj: '"We have an internal AI team building on open-source"', response: 'Watsonx builds on open-source (Llama, Mistral, Granite) and adds enterprise governance, model versioning, and compliance explainability — exactly what internal teams need when moving from prototype to production.' },
    ],
    caseStudy: 'State Street — 85% reduction in audit report preparation time using watsonx document intelligence + IBM MQ for data pipeline reliability.',
  },
  Healthcare: {
    steps: [
      { step: 1, title: 'Compliance Anchor', desc: 'Open with HIPAA, HITECH, and FDA 21 CFR Part 11 compliance — IBM\'s regulated cloud deployments have pre-built compliance frameworks that reduce time-to-compliance by 40%.' },
      { step: 2, title: 'Clinical Data Platform Opportunity', desc: 'Identify HL7 FHIR integration needs. IBM Watson Health data ingestion pipelines + CP4D for clinical analytics is a strong landing zone for health systems modernizing from Epic or Cerner.' },
      { step: 3, title: 'Security Posture Assessment', desc: 'Run a Guardium Data Security assessment — healthcare is the #1 targeted sector for ransomware. Frame the conversation around protecting patient data, not just IT security.' },
      { step: 4, title: 'AI Use Case Identification', desc: 'Focus on clinical documentation, prior authorization automation, and supply chain optimization — these are the three highest-ROI healthcare AI use cases with fastest procurement approval cycles.' },
      { step: 5, title: 'Integration with EHR/EMR Systems', desc: 'Map IBM MQ + App Connect integration with the customer\'s EHR vendor. Epic and Cerner have certified IBM MQ connectors — this reduces technical risk significantly.' },
    ],
    leadProducts: ['Cloud Pak for Data', 'IBM Watson Health (Phynd)', 'IBM MQ', 'IBM Guardium', 'IBM Watson Assistant'],
    objections: [
      { obj: '"Epic/Oracle Health handles all our data"', response: 'IBM integrates with Epic and Oracle Health at the HL7 FHIR layer — we\'re an enhancement to your EHR investment, enabling analytics and AI capabilities Epic cannot provide natively.' },
      { obj: '"We\'re budget-constrained post-COVID"', response: 'IBM Financing and grant-eligible deployment options exist for non-profit health systems. Many of our engagements are funded through CMS Innovation Center grants for AI-assisted care delivery.' },
      { obj: '"AI in healthcare raises patient safety concerns"', response: 'IBM\'s AI governance toolkit includes model explainability, audit trails, and bias detection — exactly the controls FDA guidance on AI/ML-based SaMD requires.' },
    ],
    caseStudy: 'Cleveland Clinic — 62% reduction in prior authorization processing time using IBM RPA and Watson Assistant, saving $18M annually in administrative costs.',
  },
  Retail: {
    steps: [
      { step: 1, title: 'Supply Chain Disruption Entry Point', desc: 'Post-pandemic supply chain volatility remains top of mind for retail CIOs. Lead with IBM Sterling Supply Chain as the entry point — it has the most immediate ROI story for retail.' },
      { step: 2, title: 'Customer 360 & Personalization', desc: 'Map the customer\'s data estate — CDP, eComm platform, loyalty. CP4D can unify these data sources to enable watsonx-powered personalization that outperforms generic cloud ML tools.' },
      { step: 3, title: 'Store Technology Modernization', desc: 'Edge computing and IoT at the store level are growing. IBM Edge Application Manager + MQ creates a resilient store tech stack that works offline and syncs when connected.' },
      { step: 4, title: 'Loss Prevention AI', desc: 'Position watsonx.ai for inventory shrinkage detection and fraud prevention in point-of-sale transactions — two use cases with clear, measurable ROI that procurement can justify.' },
      { step: 5, title: 'Platform Consolidation Commercial', desc: 'Retail IT shops often run 5–7 point solutions for what IBM\'s hybrid cloud portfolio can consolidate. Build a consolidation story that reduces vendor count and management overhead.' },
    ],
    leadProducts: ['IBM Sterling Supply Chain', 'Cloud Pak for Data', 'IBM MQ', 'IBM Edge Application Manager', 'watsonx.ai'],
    objections: [
      { obj: '"Salesforce Commerce Cloud handles our customer data"', response: 'IBM integrates with Salesforce Commerce — CP4D can consume Salesforce data alongside your ERP and loyalty system data, providing analytics depth that Salesforce\'s native reporting cannot match.' },
      { obj: '"Snowflake is our data warehouse"', response: 'IBM CP4D can connect to Snowflake as a data source while adding AI governance, model management, and automated data lineage — capabilities Snowflake doesn\'t natively provide.' },
      { obj: '"We\'re moving everything to a single cloud"', response: 'Single-cloud strategies create concentration risk. IBM OpenShift gives you the flexibility to run on that preferred cloud while maintaining portability and avoiding lock-in.' },
    ],
    caseStudy: 'The North Face — 23% improvement in inventory forecasting accuracy using IBM Sterling + Watson AI, reducing overstock costs by $12M in the first year.',
  },
  Federal: {
    steps: [
      { step: 1, title: 'FedRAMP & IL Compliance Entry', desc: 'IBM Cloud Government is FedRAMP High Authorized and supports IL2–IL5 workloads. Lead every federal conversation with compliance posture — this is a gate, not a differentiator.' },
      { step: 2, title: 'Zero Trust Architecture Alignment', desc: 'Map the agency\'s CISA Zero Trust Maturity Model gaps to IBM\'s ZTA portfolio: QRadar for threat detection, Verify for identity, Guardium for data, OpenShift for application workload isolation.' },
      { step: 3, title: 'Modernization Act Alignment (Cloud Smart)', desc: 'Align proposal to OMB Cloud Smart policy — prioritize security, procurement efficiency, and workforce enablement. IBM\'s FedRAMP marketplace presence reduces agency ATO burden significantly.' },
      { step: 4, title: 'AI Executive Order Compliance', desc: 'Address the Biden/Executive Order on AI Safety requirements — watsonx\'s governance framework, model transparency, and bias detection directly align with federal AI procurement requirements taking effect in 2025.' },
      { step: 5, title: 'Co-Sell with SI Partners', desc: 'Federal wins almost always go through SIs (Booz Allen, Leidos, SAIC, Deloitte). Identify the incumbent SI and engage IBM\'s federal partner team to co-sell. Direct federal sales rarely succeed without SI alignment.' },
    ],
    leadProducts: ['IBM Cloud Government (FedRAMP)', 'IBM QRadar SIEM', 'Red Hat OpenShift (OCP4)', 'IBM Guardium', 'watsonx.ai (FedRAMP In Process)'],
    objections: [
      { obj: '"AWS GovCloud is the agency standard"', response: 'OpenShift runs on AWS GovCloud — IBM\'s value is the enterprise middleware layer (MQ, Guardium, QRadar) that AWS GovCloud doesn\'t include and agencies need for mission-critical operations.' },
      { obj: '"We\'re in a multi-year contract with another vendor"', response: 'IBM can insert as a complementary platform. Identify workloads not covered by the existing contract — often security operations, mainframe modernization, or AI are outside the current scope.' },
      { obj: '"IBM is not on our preferred contract vehicle"', response: 'IBM is on GSA Schedule, SEWP V, CIO-SP3, and multiple BPA vehicles. IBM\'s federal contracts team can identify the fastest path to a compliant procurement within your agency\'s preferred vehicle.' },
    ],
    caseStudy: 'U.S. Department of Homeland Security — IBM QRadar SIEM processes 2 million security events per second across 47 agencies with a 99.99% uptime SLA under a 5-year FedRAMP High deployment.',
  },
};

const INDUSTRIES = Object.keys(PLAYBOOKS);

export default function Playbooks() {
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const pb = PLAYBOOKS[industry];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Resources</div>
        <h1 className="page-header__title">Playbooks</h1>
        <p className="page-header__subtitle">Industry-specific engagement playbooks for IBM Technical Sales Leaders</p>
      </div>

      <div className="tabs">
        {INDUSTRIES.map(ind => (
          <button
            key={ind}
            className={`tab-button${industry === ind ? ' active' : ''}`}
            onClick={() => setIndustry(ind)}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Engagement Steps */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__header">
          <div className="card__title">Engagement Playbook — {industry}</div>
          <span className="tag tag--blue">{pb.steps.length} steps</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {pb.steps.map(s => (
            <div key={s.step} className="playbook-step" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--ibm-blue-60)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 'var(--font-size-sm)', flexShrink: 0,
              }}>
                {s.step}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Lead Products */}
        <div className="card">
          <div className="card__header"><div className="card__title">Lead Products</div></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {pb.leadProducts.map(p => (
              <span key={p} className="tag tag--blue" style={{ fontSize: 'var(--font-size-sm)', padding: '4px 10px' }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Case Study */}
        <div className="card">
          <div className="card__header"><div className="card__title">Reference Case Study</div></div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6, borderLeft: '3px solid var(--ibm-blue-60)', paddingLeft: 'var(--space-4)', fontStyle: 'italic' }}>
            {pb.caseStudy}
          </div>
        </div>
      </div>

      {/* Objections */}
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card__header">
          <div className="card__title">Common Objections & Responses</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {pb.objections.map((o, i) => (
            <div key={i} style={{ borderBottom: i < pb.objections.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: i < pb.objections.length - 1 ? 'var(--space-4)' : 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--ibm-red-60)', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                {o.obj}
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6, paddingLeft: 'var(--space-4)' }}>
                <span style={{ color: 'var(--ibm-green-60)', fontWeight: 600 }}>▶ </span>
                {o.response}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
