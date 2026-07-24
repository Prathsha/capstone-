import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const MEETINGS = [
  {
    id: 1,
    date: 'Jul 10, 2026',
    account: 'SIEMENS',
    attendees: 'Annika Brandt (Global IT Dir), Ravi Patel (Enterprise Architect), IBM TSL, IBM GTS SE',
    type: 'Technical',
    status: 'Completed',
    summary: 'Architecture review for IBM MAS + Sterling hybrid integration. Ravi Patel approved the MQ Uniform Cluster topology across IBM Cloud Frankfurt and Dallas regions. SOW for Turbonomic expansion reviewed — pending legal sign-off expected by Jul 18. Annika Brandt confirmed Q3 budget for MAS 8.11 expansion.',
    actions: [
      { text: 'IBM TSL to deliver final SOW redline to Siemens legal by Jul 14', dueDate: '2026-07-14' },
      { text: 'Provision IBM Cloud VPC in Frankfurt region for MAS 8.11 staging by Jul 21', dueDate: '2026-07-21' },
      { text: 'Schedule Turbonomic executive briefing with Annika Brandt for Aug 5', dueDate: '2026-08-05' },
    ],
  },
  {
    id: 2,
    date: 'Jul 9, 2026',
    account: 'INDEPENDENCE BLUECROSS',
    attendees: 'Tara Williams (Dir Integration), Marcus Bell (API Architect), James Nguyen (CDO), IBM TSL + Data SE',
    type: 'Technical',
    status: 'Completed',
    summary: 'DataStage POC Phase 1 results reviewed — claims pipeline processing 34% faster with zero data loss. James Nguyen approved Phase 2 scope adding Watson Assistant knowledge base integration. Tara Williams pushing for production cut-over by Q1 2027. Watson Assistant renewal confirmed for Aug 30.',
    actions: [
      { text: 'IBM to provide Watson Assistant renewal pricing with 3-year option by Jul 15', dueDate: '2026-07-15' },
      { text: 'Tara Williams to provision DataStage Phase 2 environment by Jul 22', dueDate: '2026-07-22' },
      { text: 'Schedule HIPAA compliance sign-off meeting with InfoSec for Aug 1', dueDate: '2026-08-01' },
    ],
  },
  {
    id: 3,
    date: 'Jul 8, 2026',
    account: 'QUEST DIAGNOSTICS',
    attendees: 'Dr. Patricia Hale (CIO), Brian Torres (VP Data), IBM TSL, IBM CP4D SE',
    type: 'Executive',
    status: 'Completed',
    summary: 'CP4D Enterprise tier upgrade formally approved by Brian Torres. Annual contract value increases to $820K on Sep renewal. Dr. Hale confirmed board presentation is Sep 12 — IBM TSL to prepare customer success story deck. TRIRIGA pilot scoping meeting set for Aug 14.',
    actions: [
      { text: 'IBM to send CP4D Enterprise renewal contract draft by Jul 16', dueDate: '2026-07-16' },
      { text: 'Prepare customer success story deck referencing CP4D healthcare peer by Aug 30', dueDate: '2026-08-30' },
      { text: 'TRIRIGA scoping kick-off with Brian Torres team — confirm Aug 14 agenda by Jul 15', dueDate: '2026-07-15' },
    ],
  },
  {
    id: 4,
    date: 'Jul 5, 2026',
    account: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY',
    attendees: 'Sandra Osei (Dir Infrastructure), IBM TSL, IBM Security SE',
    type: 'Technical',
    status: 'Completed',
    summary: 'Guardium Phase 1 POC completed — scanning against 12 Db2 schemas and 4 Oracle schemas in non-prod. Sandra Osei confirmed SOX use case alignment. Kevin Marsh (CISO) still requiring formal IBM security certification documentation before Phase 2 approval. IBM SE submitted certifications Jul 3.',
    actions: [
      { text: 'IBM Security SE to follow up with Kevin Marsh directly on certification receipt by Jul 8', dueDate: '2026-07-08' },
      { text: 'Sandra Osei to schedule Phase 2 kick-off pending CISO approval — target Jul 20', dueDate: '2026-07-20' },
      { text: 'IBM to prepare EBR deck for OpenPages Enterprise Risk Mgmt expansion by Jul 18', dueDate: '2026-07-18' },
    ],
  },
  {
    id: 5,
    date: 'Jul 15, 2026',
    account: 'SUNGARD DATA SYSTEMS',
    attendees: 'Michael Rath (CTO), IBM TSL, IBM Client Engineering',
    type: 'Executive',
    status: 'Upcoming',
    summary: 'Critical health score recovery meeting. Objective: address Snowflake and AWS Aurora competitive pressure. Michael Rath has not engaged in 52 days. Goal is to present multi-year Db2 commitment pricing with 20% discount and executive sponsor escalation if needed.',
    actions: [
      { text: 'Prepare multi-year Db2 commit pricing with IBM Financing options — due Jul 13', dueDate: '2026-07-13' },
      { text: 'Bring IBM Client Engineering for live Db2 vs Snowflake TCO comparison demo', dueDate: '2026-07-15' },
      { text: 'Request IBM executive sponsor (VP Sales) attendance if Rath is non-committal', dueDate: '2026-07-14' },
    ],
  },
  {
    id: 6,
    date: 'Jul 18, 2026',
    account: 'SELECT MEDICAL CORP',
    attendees: 'Lisa Trombetta (VP Security), Andre Brooks (SOC Dir), IBM TSL, IBM Security SE',
    type: 'Technical',
    status: 'Upcoming',
    summary: 'QRadar SOAR Phase 1 scoping — review 12 HIPAA-specific playbooks developed by IBM Security SE. Objective: confirm go/no-go for full SOAR deployment before Nov renewal window. Lisa Trombetta identified this as her #1 H2 initiative.',
    actions: [
      { text: 'IBM Security SE to finalize 12 HIPAA playbook documentation before meeting', dueDate: '2026-07-17' },
      { text: 'Request IBM Verify demo slot for zero-trust identity pitch after SOAR discussion', dueDate: '2026-07-18' },
      { text: 'Send Select Medical reference from healthcare SOAR customer (UPMC or BJC) by Jul 14', dueDate: '2026-07-14' },
    ],
  },
];

const STATUS_STYLE = { Completed: { tag: 'tag--green', label: 'Completed' }, Upcoming: { tag: 'tag--blue', label: 'Upcoming' } };
const TYPE_STYLE   = { Executive: 'tag--purple', Technical: 'tag--teal', Discovery: 'tag--yellow' };

// ── Small inline "Add to Tasks" button ───────────────────────────────────────
function AddToTasksButton({ account, actionText, dueDate }) {
  const { addTask, tasks } = useTaskContext();
  const alreadyAdded = tasks.some(t => t.title === actionText);
  const [added, setAdded] = useState(alreadyAdded);

  const handleAdd = () => {
    if (added) return;
    addTask({
      id: `meeting-${Date.now()}-${Math.random()}`,
      title: actionText,
      account: account,
      priority: 'Medium',
      dueDate: dueDate,
      status: 'Todo',
      done: false,
      assignedTo: 'pratham',
      source: 'user',
      type: 'Follow-up',
    });
    setAdded(true);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      style={{
        marginLeft: 8, padding: '2px 8px', fontSize: 11,
        background: added ? 'var(--color-bg-subtle)' : 'var(--ibm-blue-10)',
        border: `1px solid ${added ? 'var(--color-border)' : 'var(--ibm-blue-40)'}`,
        color: added ? 'var(--color-text-secondary)' : 'var(--ibm-blue-70)',
        cursor: added ? 'default' : 'pointer', fontFamily: 'var(--font-sans)',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {added ? '✓ Added' : '+ Add to Tasks'}
    </button>
  );
}

export default function Meetings() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Activities</div>
        <h1 className="page-header__title">Meetings</h1>
        <p className="page-header__subtitle">{MEETINGS.length} meetings — Q3 FY2026</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {MEETINGS.map(m => (
          <div key={m.id} className="meeting-card card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{m.account}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {m.date} · {m.attendees}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <span className={`tag ${TYPE_STYLE[m.type] || 'tag--gray'}`}>{m.type}</span>
                <span className={`tag ${STATUS_STYLE[m.status].tag}`}>{STATUS_STYLE[m.status].label}</span>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                AI Summary
              </div>
              {m.summary}
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                Action Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {m.actions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', flex: 1 }}>
                      <span style={{ color: 'var(--ibm-blue-60)', marginTop: 2, flexShrink: 0 }}>▶</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.5, color: 'var(--color-text-primary)' }}>{a.text}</span>
                    </div>
                    <AddToTasksButton account={m.account} actionText={a.text} dueDate={a.dueDate} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
