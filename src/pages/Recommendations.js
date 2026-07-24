import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const CROSSSELL = [
  {
    account: 'QUEST DIAGNOSTICS',
    currentProducts: ['IBM Cloud Pak for Data', 'IBM watsonx.data'],
    recommended: 'IBM TRIRIGA',
    reasoning: 'Quest is expanding its lab network with 3 new facilities in FY2027. TRIRIGA\'s facility optimization capabilities directly align with their capital project management needs. Brian Torres (VP Data) has approved a pilot scoping meeting for Aug 14 and has Q3 budget.',
    confidence: 84,
    suggestedAction: 'Schedule IBM TRIRIGA scoping call with Brian Torres — Quest Diagnostics lab expansion',
    dueDate: '2026-07-31',
  },
  {
    account: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY',
    currentProducts: ['IBM OpenPages', 'IBM Financial Crimes Insight'],
    recommended: 'IBM Guardium',
    reasoning: 'Lincoln National\'s Guardium POC (Phase 1 complete) confirmed SOX compliance use case across 12 Db2 and 4 Oracle schemas. Sandra Osei is driving Phase 2 approval. Kevin Marsh (CISO) certification issue resolved Jul 3 — Phase 2 kick-off imminent.',
    confidence: 91,
    suggestedAction: 'Follow up with Sandra Osei on Guardium Phase 2 kick-off approval — Lincoln National',
    dueDate: '2026-07-20',
  },
  {
    account: 'INDEPENDENCE BLUECROSS',
    currentProducts: ['IBM Watson Assistant', 'IBM Cloud Pak for Integration'],
    recommended: 'IBM DataStage',
    reasoning: 'DataStage POC Phase 1 showed 34% claims processing improvement. Tara Williams is pushing for production by Q1 2027. Natural expansion from existing CP4I integration layer — reduces total integration footprint and strengthens renewal position.',
    confidence: 87,
    suggestedAction: 'Send DataStage Phase 2 contract proposal to Tara Williams — Independence BlueCross',
    dueDate: '2026-07-22',
  },
  {
    account: 'SELECT MEDICAL CORP',
    currentProducts: ['IBM Security QRadar', 'IBM Cloud'],
    recommended: 'IBM Verify',
    reasoning: 'Select Medical operates 400+ care facilities — zero-trust identity across that distributed footprint is a HIPAA compliance requirement. Lisa Trombetta confirmed IBM Verify is her #1 post-SOAR initiative. No competitive evaluation in progress.',
    confidence: 83,
    suggestedAction: 'Prepare IBM Verify zero-trust identity proposal for Lisa Trombetta — Select Medical',
    dueDate: '2026-07-25',
  },
  {
    account: 'RICOH',
    currentProducts: ['IBM FileNet Content Manager', 'IBM Cloud Pak for Business Automation'],
    recommended: 'watsonx Orchestrate',
    reasoning: 'Ricoh processes 280M+ documents annually. watsonx Orchestrate for document routing automation is a natural extension of their existing CP4BA deployment. David Okafor confirmed the digital transformation workshop for July is focused on AI-augmented workflows.',
    confidence: 85,
    suggestedAction: 'Present watsonx Orchestrate document automation demo to David Okafor — Ricoh',
    dueDate: '2026-07-28',
  },
];

const COMP_RISK = [
  {
    account: 'SUNGARD DATA SYSTEMS',
    competitor: 'Snowflake + AWS Aurora',
    affectedProducts: ['IBM Db2 on Cloud'],
    action: 'CRITICAL — health score 44, last contact 52 days ago. Michael Rath (CTO) is actively evaluating Snowflake Data Cloud and AWS Aurora as Db2 replacements. Executive sponsor meeting scheduled Jul 15. Lead with multi-year commit pricing at 20% discount + IBM Financing to lock renewal before Q3.',
    riskLevel: 'High',
    suggestedAction: 'Present multi-year Db2 commit pricing + IBM Financing to Michael Rath — SunGard Data',
    dueDate: '2026-07-13',
    priority: 'Critical',
  },
  {
    account: 'SEI INVESTMENTS',
    competitor: 'Microsoft Power Platform',
    affectedProducts: ['IBM Cloud Pak for Business Automation'],
    action: 'Carol Simmons (VP Tech) last engaged 31 days ago. Microsoft Power Automate and Power BI are embedded in SEI\'s Microsoft EA — zero-friction alternative to CP4BA. Re-engage with IBM Cognos reference from comparable asset management firm. Offer IBM Garage engagement to demonstrate differentiated AI-infused automation story.',
    riskLevel: 'High',
    suggestedAction: 'Re-engage Carol Simmons with IBM Cognos reference and IBM Garage offer — SEI Investments',
    dueDate: '2026-07-20',
    priority: 'High',
  },
  {
    account: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY',
    competitor: 'ServiceNow GRC',
    affectedProducts: ['IBM OpenPages'],
    action: 'ServiceNow GRC module is already in use for IT risk workflows at Lincoln National. Kevin Marsh (CISO) is evaluating consolidating all GRC on ServiceNow to eliminate IBM OpenPages licensing. Counter with OpenPages\' FINRA and SOX-specific depth and the Financial Crimes Insight integration story.',
    riskLevel: 'Medium',
    suggestedAction: 'Prepare OpenPages vs. ServiceNow GRC differentiation brief for Kevin Marsh — Lincoln National',
    dueDate: '2026-07-25',
    priority: 'Medium',
  },
  {
    account: 'SELECT MEDICAL CORP',
    competitor: 'Palo Alto Networks',
    affectedProducts: ['IBM Security QRadar'],
    action: 'Palo Alto Cortex XSOAR is being evaluated as an overlay to IBM QRadar. Accelerate IBM QRadar SOAR POC scoping (Jul 18 meeting) to demonstrate native IBM SOAR advantage. Reference healthcare SOAR customer (UPMC) where IBM outperformed Palo Alto on HIPAA playbook coverage.',
    riskLevel: 'Medium',
    suggestedAction: 'Accelerate QRadar SOAR POC and send UPMC healthcare reference — Select Medical Corp',
    dueDate: '2026-07-18',
    priority: 'High',
  },
];

const UPSELL = [
  {
    account: 'QUEST DIAGNOSTICS',
    currentState: 'IBM Cloud Pak for Data — Standard tier ($560K ARR)',
    upgrade: 'IBM Cloud Pak for Data — Enterprise tier',
    expectedValue: '$260,000 additional ARR',
    reasoning: 'Brian Torres confirmed CP4D usage growth of 40% YoY. Enterprise tier unlocks advanced governance, AutoAI, and Watson Studio Professional. Renewal in Jan 2027 — window to upgrade now and start Enterprise tier in Q4 with minimal friction.',
    suggestedAction: 'Send CP4D Enterprise tier upgrade proposal to Brian Torres — Quest Diagnostics',
    dueDate: '2026-07-31',
    priority: 'High',
  },
  {
    account: 'INDEPENDENCE BLUECROSS',
    currentState: 'IBM Watson Assistant — Base deployment (member services only)',
    upgrade: 'Watson Assistant — Member Portal + Provider Portal expansion',
    expectedValue: '$420,000 additional ARR',
    reasoning: 'Member portal expansion approved by James Nguyen. Provider portal is incremental — Tara Williams confirmed same integration pattern as member portal. 40% call deflection ROI already demonstrated in Phase 1. Renewal Aug 30 creates urgency.',
    suggestedAction: 'Present Watson Assistant Provider Portal expansion pricing to James Nguyen — Independence BlueCross',
    dueDate: '2026-07-30',
    priority: 'High',
  },
  {
    account: 'RICOH',
    currentState: 'IBM FileNet Content Manager 5.5 — on-premises perpetual',
    upgrade: 'IBM Cloud Pak for Content — SaaS on IBM Cloud',
    expectedValue: '$380,000 additional ARR',
    reasoning: 'FileNet modernization proposal submitted (close date Aug 30). Converts perpetual to recurring revenue. Eliminates patching overhead for Ricoh ops team. David Okafor\'s digital transformation mandate prioritizes cloud-first for infrastructure.',
    suggestedAction: 'Follow up on FileNet → Cloud Pak for Content SaaS migration proposal — Ricoh',
    dueDate: '2026-08-15',
    priority: 'Medium',
  },
  {
    account: 'SIEMENS',
    currentState: 'IBM Sterling Supply Chain SaaS — standard tier',
    upgrade: 'IBM Sterling Order Management — enterprise expansion',
    expectedValue: '$480,000 additional ARR',
    reasoning: 'Annika Brandt confirmed Siemens is expanding order management to 3 additional manufacturing divisions in FY2027. Existing SaaS contract is the natural upsell path. Turbonomic integration reduces cloud cost concern on expanded footprint.',
    suggestedAction: 'Present Sterling Order Management enterprise expansion to Annika Brandt — Siemens',
    dueDate: '2026-08-01',
    priority: 'Medium',
  },
];

// ── Add to Tasks button ───────────────────────────────────────────────────────
function AddToTasksBtn({ account, actionText, dueDate, priority = 'Medium' }) {
  const { addTask, tasks } = useTaskContext();
  const alreadyAdded = tasks.some(t => t.title === actionText);
  const [added, setAdded] = useState(alreadyAdded);

  const handleAdd = () => {
    if (added) return;
    addTask({
      id: `rec-${Date.now()}-${Math.random()}`,
      title: actionText,
      account: account,
      priority: priority,
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
      padding: '6px 14px', fontSize: 12,
      background: added ? 'var(--color-bg-subtle)' : 'var(--ibm-blue-60)',
      border: 'none',
      color: added ? 'var(--color-text-secondary)' : '#fff',
      cursor: added ? 'default' : 'pointer', fontFamily: 'var(--font-sans)',
      fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {added ? '✓ Added to Tasks' : '+ Add to Tasks'}
    </button>
  );
}

export default function Recommendations() {
  const [section, setSection] = useState('crosssell');

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">AI</div>
        <h1 className="page-header__title">AI Recommendations</h1>
        <p className="page-header__subtitle">Watson-powered insights for your accounts — cross-sell, competitive risk, and upsell</p>
      </div>

      <div className="tabs">
        <button className={`tab-button${section === 'crosssell' ? ' active' : ''}`} onClick={() => setSection('crosssell')}>
          Cross-sell ({CROSSSELL.length})
        </button>
        <button className={`tab-button${section === 'risk' ? ' active' : ''}`} onClick={() => setSection('risk')}>
          Competitive Risk ({COMP_RISK.length})
        </button>
        <button className={`tab-button${section === 'upsell' ? ' active' : ''}`} onClick={() => setSection('upsell')}>
          Upsell ({UPSELL.length})
        </button>
      </div>

      {section === 'crosssell' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {CROSSSELL.map((r, i) => (
            <div key={i} className="rec-card rec-card--crosssell card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{r.account}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>Current: {r.currentProducts.join(', ')}</div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="tag tag--blue">{r.recommended}</span>
                  <span className="tag tag--green">{r.confidence}% confidence</span>
                  <AddToTasksBtn account={r.account} actionText={r.suggestedAction} dueDate={r.dueDate} />
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6, background: 'var(--ibm-blue-10)', padding: 'var(--space-3)', borderLeft: '3px solid var(--ibm-blue-60)' }}>
                {r.reasoning}
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'risk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {COMP_RISK.map((r, i) => (
            <div key={i} className="rec-card rec-card--risk card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{r.account}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>Affected: {r.affectedProducts.join(', ')}</div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="tag tag--red">{r.competitor}</span>
                  <span className={`tag ${r.riskLevel === 'High' ? 'tag--red' : 'tag--yellow'}`}>Risk: {r.riskLevel}</span>
                  <AddToTasksBtn account={r.account} actionText={r.suggestedAction} dueDate={r.dueDate} priority={r.priority} />
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6, background: '#fff1f1', padding: 'var(--space-3)', borderLeft: '3px solid var(--ibm-red-60)' }}>
                <strong>Recommended action:</strong> {r.action}
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'upsell' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {UPSELL.map((r, i) => (
            <div key={i} className="rec-card rec-card--upsell card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{r.account}</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="tag tag--purple">{r.expectedValue}</span>
                  <AddToTasksBtn account={r.account} actionText={r.suggestedAction} dueDate={r.dueDate} priority={r.priority} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Current State</div>
                  <div style={{ fontSize: 'var(--font-size-sm)' }}>{r.currentState}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ibm-blue-60)', marginBottom: 4 }}>Recommended Upgrade</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{r.upgrade}</div>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6, background: '#f6f2ff', padding: 'var(--space-3)', borderLeft: '3px solid var(--ibm-purple-60)' }}>
                {r.reasoning}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
