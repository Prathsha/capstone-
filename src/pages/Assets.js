import React, { useState } from 'react';

const ASSETS = {
  Presentations: [
    { id: 1, title: 'IBM watsonx AI — Financial Services Value Proposition', type: 'Deck', updated: 'Jul 1, 2025',  desc: 'Executive-level pitch deck positioning watsonx.ai for regulatory compliance, fraud detection, and advisor productivity in financial services.' },
    { id: 2, title: 'Red Hat OpenShift — Hybrid Cloud Architecture Overview', type: 'Deck', updated: 'Jun 20, 2025', desc: 'Technical overview of OpenShift multi-cluster deployment patterns across IBM Cloud, AWS, and Azure with unified control plane.' },
    { id: 3, title: 'IBM MQ — Modernization for Cloud-Native Architectures',   type: 'Deck', updated: 'Jun 10, 2025', desc: 'Shows how IBM MQ bridges legacy mainframe messaging with Kubernetes-native event streaming for zero message loss.' },
    { id: 4, title: 'IBM Security Portfolio — Zero Trust Strategy',            type: 'Deck', updated: 'May 28, 2025', desc: 'End-to-end IBM security story including QRadar SIEM, Guardium data security, and Verify identity management.' },
  ],
  Battlecards: [
    { id: 5,  title: 'IBM vs. AWS — Cloud Platform Comparison',            type: 'Battlecard', updated: 'Jul 5, 2025',  desc: 'Head-to-head comparison of IBM hybrid cloud vs. AWS cloud-first. Covers TCO, compliance, and migration complexity.' },
    { id: 6,  title: 'watsonx vs. Azure AI Services',                      type: 'Battlecard', updated: 'Jun 30, 2025', desc: 'Competitive differentiation on AI governance, model transparency, and enterprise SLAs.' },
    { id: 7,  title: 'IBM Instana vs. Datadog — Observability Battlecard', type: 'Battlecard', updated: 'Jun 15, 2025', desc: 'Pricing model comparison, auto-instrumentation depth, and OpenShift-native integration advantages.' },
    { id: 8,  title: 'CP4D vs. Snowflake — Data Platform Comparison',      type: 'Battlecard', updated: 'Jun 5, 2025',  desc: 'Governance-first approach of Cloud Pak for Data vs. Snowflake\'s analytics-centric architecture.' },
  ],
  'Reference Architectures': [
    { id: 9,  title: 'Financial Services Hybrid AI Reference Architecture', type: 'Ref Arch', updated: 'Jun 28, 2025', desc: 'IBM-validated architecture for AI model serving on OpenShift with MQ integration to mainframe data sources.' },
    { id: 10, title: 'Regulated Industry Multi-Cloud Security Blueprint',   type: 'Ref Arch', updated: 'Jun 12, 2025', desc: 'Zero-trust architecture using Guardium, QRadar, and OpenShift SecurityContext Constraints across hybrid environments.' },
    { id: 11, title: 'Event-Driven Architecture with IBM MQ + Kafka',      type: 'Ref Arch', updated: 'May 30, 2025', desc: 'Pattern for bridging IBM MQ enterprise messaging with Apache Kafka for streaming analytics use cases.' },
    { id: 12, title: 'watsonx Orchestrate — Multi-Agent Automation Arch',  type: 'Ref Arch', updated: 'May 20, 2025', desc: 'Reference design for enterprise-scale AI agent orchestration across HR, Finance, and Operations workflows.' },
  ],
  'Case Studies': [
    { id: 13, title: 'Bank of America — OpenShift Migration Success Story',   type: 'Case Study', updated: 'Jul 2, 2025',  desc: '42% infrastructure cost reduction achieved over 18 months by migrating 1,200 microservices to OpenShift on IBM Cloud.' },
    { id: 14, title: 'State Street — watsonx.ai for Regulatory Reporting',    type: 'Case Study', updated: 'Jun 18, 2025', desc: 'Reduced SEC report preparation time from 3 days to 4 hours using watsonx document intelligence and Granite models.' },
    { id: 15, title: 'Nationwide Insurance — IBM MQ Reliability at Scale',    type: 'Case Study', updated: 'Jun 5, 2025',  desc: '99.9999% message delivery uptime across 14 production systems processing $2.3B in daily transactions.' },
    { id: 16, title: 'Fidelity Investments — CP4D Unified Data Governance',   type: 'Case Study', updated: 'May 15, 2025', desc: 'Consolidated 7 disparate data catalogs into CP4D, achieving full GDPR lineage tracing across 4 petabytes of data.' },
  ],
};

const TYPE_COLOR = {
  'Deck':       'tag--blue',
  'Battlecard': 'tag--red',
  'Ref Arch':   'tag--purple',
  'Case Study': 'tag--green',
};

const TABS = Object.keys(ASSETS);

export default function Assets() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Technical</div>
        <h1 className="page-header__title">Asset Library</h1>
        <p className="page-header__subtitle">Sales decks, battlecards, reference architectures, and case studies</p>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`tab-button${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {ASSETS[tab].map(asset => (
          <div key={asset.id} className="asset-card card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div className={`tag ${TYPE_COLOR[asset.type] || 'tag--gray'}`}>{asset.type}</div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{asset.updated}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)', lineHeight: 1.4 }}>
              {asset.title}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-4)', flex: 1 }}>
              {asset.desc}
            </div>
            <button
              style={{
                padding: '6px 16px',
                background: 'var(--color-interactive)',
                color: '#fff',
                border: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
