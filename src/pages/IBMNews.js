import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Product Launch',
    catColor: 'tag--blue',
    title: 'IBM Releases watsonx.ai 2.0 with Granite 3.1 Foundation Models',
    date: 'Jul 7, 2025',
    relevance: 'High',
    summary: 'IBM has released watsonx.ai 2.0 featuring the Granite 3.1 series including an 8B parameter model optimized for financial document understanding. The new release adds batch inference at 40% lower cost and a new AI governance dashboard aligned to EU AI Act requirements.',
    suggestedAction: 'Brief accounts on watsonx.ai 2.0 Granite 3.1 — financial document AI use case',
    dueDate: '2026-07-21',
  },
  {
    id: 2,
    category: 'Sales Play',
    catColor: 'tag--purple',
    title: 'New FY25 Q3 Sales Play: "AI-Ready Infrastructure" — Bundled OpenShift + watsonx',
    date: 'Jul 5, 2025',
    relevance: 'High',
    summary: 'IBM Sales has launched a new Q3 sales play targeting accounts with existing OpenShift deployments. The play bundles watsonx.ai inference at a 35% discount for OpenShift customers with 50+ nodes. Your accounts Siemens and Quest Diagnostics qualify.',
    suggestedAction: 'Engage Siemens and Quest Diagnostics on OpenShift + watsonx Q3 bundle pricing',
    dueDate: '2026-07-18',
  },
  {
    id: 3,
    category: 'Price Change',
    catColor: 'tag--orange',
    title: 'IBM MQ SaaS Pricing Update — New Capacity-Based Model Effective Aug 1',
    date: 'Jul 3, 2025',
    relevance: 'High',
    summary: 'IBM MQ as a Service moves to a capacity-based pricing model on August 1, 2025. Existing perpetual license customers converting before August 1 receive a 25% migration discount. Independence BlueCross and Siemens are eligible — initiate conversations now.',
    suggestedAction: 'Contact Independence BlueCross and Siemens about IBM MQ SaaS migration discount before Aug 1',
    dueDate: '2026-07-25',
  },
  {
    id: 4,
    category: 'Tech Preview',
    catColor: 'tag--teal',
    title: 'IBM Instana Adds Native OpenTelemetry OTLP Ingest — Generally Available Sept 2025',
    date: 'Jun 30, 2025',
    relevance: 'High',
    summary: 'Instana\'s upcoming September release adds native OTLP endpoint support, allowing customers to send OpenTelemetry traces directly to Instana without an agent. This eliminates the primary objection from accounts already invested in OTel instrumentation.',
    suggestedAction: 'Schedule Instana OTLP demo for accounts evaluating observability platforms',
    dueDate: '2026-08-01',
  },
  {
    id: 5,
    category: 'Product Launch',
    catColor: 'tag--blue',
    title: 'Red Hat OpenShift 4.16 Released — Enhanced AI/ML Workload Scheduling',
    date: 'Jun 25, 2025',
    relevance: 'Medium',
    summary: 'OpenShift 4.16 introduces GPU operator v24.9 with fractional GPU sharing and NUMA-aware scheduling for large model inference workloads. This significantly reduces infrastructure cost for watsonx model serving on OpenShift clusters.',
    suggestedAction: 'Brief Siemens and Quest on OpenShift 4.16 GPU scheduling for watsonx model serving',
    dueDate: '2026-07-30',
  },
  {
    id: 6,
    category: 'Sales Play',
    catColor: 'tag--purple',
    title: 'IBM Security — Q3 Campaign: "Guardium for DORA Compliance"',
    date: 'Jun 22, 2025',
    relevance: 'Medium',
    summary: 'IBM has launched a DORA-compliance-focused Guardium campaign targeting financial services accounts in the EU and US. New DORA readiness assessment tool available — request from your IBM Security partner for customer-facing use.',
    suggestedAction: 'Request Guardium DORA readiness assessment tool for Lincoln National and SEI Investments',
    dueDate: '2026-07-22',
  },
  {
    id: 7,
    category: 'Tech Preview',
    catColor: 'tag--teal',
    title: 'watsonx Orchestrate Adds 150 New Pre-Built Automations for Financial Services',
    date: 'Jun 18, 2025',
    relevance: 'Medium',
    summary: 'The Orchestrate library now includes 150 financial services automations covering trade reconciliation, loan origination, and advisor scheduling. Available in preview — request early access for POC accounts through your IBM product team.',
    suggestedAction: 'Request watsonx Orchestrate FinServ automation early access for SEI Investments POC',
    dueDate: '2026-07-20',
  },
  {
    id: 8,
    category: 'Price Change',
    catColor: 'tag--orange',
    title: 'IBM Consulting FS-Cloud Engagement Rates — FY25 H2 Rate Card Published',
    date: 'Jun 15, 2025',
    relevance: 'Medium',
    summary: 'IBM Consulting has published updated FY25 H2 rate cards for Financial Services Cloud engagements. Blended rates are up 4% YoY. Engagements proposed before July 31 can lock in H1 rates — relevant for Lincoln National architecture workshop.',
    suggestedAction: 'Propose Lincoln National FS-Cloud engagement before July 31 to lock H1 rates',
    dueDate: '2026-07-28',
  },
];

const RELEVANCE_STYLE = {
  High:   { tag: 'tag--red',  label: 'High Relevance' },
  Medium: { tag: 'tag--yellow', label: 'Medium Relevance' },
};

// ── Add to Tasks button ───────────────────────────────────────────────────────
function AddToTasksBtn({ actionText, dueDate }) {
  const { addTask, tasks } = useTaskContext();
  const alreadyAdded = tasks.some(t => t.title === actionText);
  const [added, setAdded] = useState(alreadyAdded);

  const handleAdd = () => {
    if (added) return;
    addTask({
      id: `news-${Date.now()}-${Math.random()}`,
      title: actionText,
      account: 'General',
      priority: 'Medium',
      dueDate: dueDate,
      status: 'Todo',
      done: false,
      assignedTo: 'pratham',
      source: 'user',
      type: 'Engagement',
    });
    setAdded(true);
  };

  return (
    <button onClick={handleAdd} disabled={added} style={{
      marginTop: 'var(--space-3)',
      padding: '5px 12px', fontSize: 12,
      background: added ? 'var(--color-bg-subtle)' : 'var(--ibm-blue-10)',
      border: `1px solid ${added ? 'var(--color-border)' : 'var(--ibm-blue-40)'}`,
      color: added ? 'var(--color-text-secondary)' : 'var(--ibm-blue-70)',
      cursor: added ? 'default' : 'pointer', fontFamily: 'var(--font-sans)',
      fontWeight: 600,
    }}>
      {added ? '✓ Added to Tasks' : '+ Add to Tasks'}
    </button>
  );
}

export default function IBMNews() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Resources</div>
        <h1 className="page-header__title">IBM News</h1>
        <p className="page-header__subtitle">Internal IBM updates relevant to your territory — product launches, price changes, and sales plays</p>
      </div>

      <div className="article-list">
        {NEWS_ITEMS.map(item => (
          <div key={item.id} className="news-item article-card">
            <div className="article-card__source-row">
              <span className={`tag ${item.catColor}`}>{item.category}</span>
              <span className="article-card__date">{item.date}</span>
              <span style={{ marginLeft: 'auto' }}>
                <span className={`tag ${RELEVANCE_STYLE[item.relevance].tag}`}>
                  {RELEVANCE_STYLE[item.relevance].label}
                </span>
              </span>
            </div>
            <div className="article-card__title">{item.title}</div>
            <div className="article-card__description">{item.summary}</div>
            <AddToTasksBtn actionText={item.suggestedAction} dueDate={item.dueDate} />
          </div>
        ))}
      </div>
    </div>
  );
}
