import React, { useState } from 'react';
import { useTaskContext, TEAM_MEMBERS } from '../context/TaskContext';

// ── Meetings Data ─────────────────────────────────────────────────────────────
const MEETINGS = [
  {
    id: 1, date: 'Jul 10, 2026', account: 'SIEMENS',
    attendees: 'Annika Brandt (Global IT Dir), Ravi Patel (Enterprise Architect), Pratham Shah (CSE), Ian Slater (CSE)',
    type: 'Technical', status: 'Completed',
    summary: 'Architecture review for IBM MAS + Sterling hybrid integration. Ravi Patel approved the MQ Uniform Cluster topology across IBM Cloud Frankfurt and Dallas regions. SOW for Turbonomic expansion reviewed — pending legal sign-off expected by Jul 18. Annika Brandt confirmed Q3 budget for MAS 8.11 expansion.',
    actions: [
      'Pratham Shah (CSE) to deliver final SOW redline to Siemens legal by Jul 14',
      'Provision IBM Cloud VPC in Frankfurt region for MAS 8.11 staging by Jul 21',
      'Schedule Turbonomic executive briefing with Annika Brandt for Aug 5',
    ],
  },
  {
    id: 2, date: 'Jul 9, 2026', account: 'INDEPENDENCE BLUECROSS',
    attendees: 'Tara Williams (Dir Integration), Marcus Bell (API Architect), James Nguyen (CDO), Ian Slater (CSE)',
    type: 'Technical', status: 'Completed',
    summary: 'DataStage POC Phase 1 results reviewed — claims pipeline processing 34% faster with zero data loss. James Nguyen approved Phase 2 scope adding Watson Assistant knowledge base integration. Tara Williams pushing for production cut-over by Q1 2027. Watson Assistant renewal confirmed for Aug 30.',
    actions: [
      'Ian Slater (CSE) to provide Watson Assistant renewal pricing with 3-year option by Jul 15',
      'Tara Williams to provision DataStage Phase 2 environment by Jul 22',
      'Schedule HIPAA compliance sign-off meeting with InfoSec for Aug 1',
    ],
  },
  {
    id: 3, date: 'Jul 8, 2026', account: 'QUEST DIAGNOSTICS',
    attendees: 'Dr. Patricia Hale (CIO), Brian Torres (VP Data), Pratham Shah (CSE), Ian Slater (CSE)',
    type: 'Executive', status: 'Completed',
    summary: 'CP4D Enterprise tier upgrade formally approved by Brian Torres. Annual contract value increases to $820K on Sep renewal. Dr. Hale confirmed board presentation is Sep 12 — IBM TSL to prepare customer success story deck. TRIRIGA pilot scoping meeting set for Aug 14.',
    actions: [
      'Sadaf Sobhani (BSS) to coordinate CP4D Enterprise renewal contract draft by Jul 16',
      'Prepare customer success story deck referencing CP4D healthcare peer by Aug 30',
      'TRIRIGA scoping kick-off with Brian Torres team — Ian Slater (CSE) to confirm Aug 14 agenda by Jul 15',
    ],
  },
  {
    id: 4, date: 'Jul 5, 2026', account: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY',
    attendees: 'Sandra Osei (Dir Infrastructure), Pratham Shah (CSE)',
    type: 'Technical', status: 'Completed',
    summary: 'Guardium Phase 1 POC completed — scanning against 12 Db2 schemas and 4 Oracle schemas in non-prod. Sandra Osei confirmed SOX use case alignment. Kevin Marsh (CISO) still requiring formal IBM security certification documentation before Phase 2 approval.',
    actions: [
      'Pratham Shah (CSE) to follow up with Kevin Marsh directly on certification receipt by Jul 8',
      'Sandra Osei to schedule Phase 2 kick-off pending CISO approval — target Jul 20',
      'Sadaf Sobhani (BSS) to prepare OpenPages EBR deck for Enterprise Risk Mgmt expansion by Jul 18',
    ],
  },
  {
    id: 5, date: 'Jul 15, 2026', account: 'SUNGARD DATA SYSTEMS',
    attendees: 'Michael Rath (CTO), Pratham Shah (CSE), Sadaf Sobhani (BSS)',
    type: 'Executive', status: 'Upcoming',
    summary: 'Critical health score recovery meeting. Objective: address Snowflake and AWS Aurora competitive pressure. Michael Rath has not engaged in 52 days. Goal is to present multi-year Db2 commitment pricing with 20% discount and executive sponsor escalation if needed.',
    actions: [
      'Sadaf Sobhani (BSS) to prepare multi-year Db2 commit pricing with IBM Financing options — due Jul 13',
      'Pratham Shah (CSE) to prepare live Db2 vs Snowflake TCO comparison demo',
      'Request IBM executive sponsor (VP Sales) attendance if Rath is non-committal',
    ],
  },
  {
    id: 6, date: 'Jul 18, 2026', account: 'SELECT MEDICAL CORP',
    attendees: 'Lisa Trombetta (VP Security), Andre Brooks (SOC Dir), Pratham Shah (CSE), Ian Slater (CSE)',
    type: 'Technical', status: 'Upcoming',
    summary: 'QRadar SOAR Phase 1 scoping — review 12 HIPAA-specific playbooks. Objective: confirm go/no-go for full SOAR deployment before Nov renewal window. Lisa Trombetta identified this as her #1 H2 initiative.',
    actions: [
      'Pratham Shah (CSE) to finalize 12 HIPAA playbook documentation before meeting',
      'Ian Slater (CSE) to request IBM Verify demo slot for zero-trust identity pitch after SOAR discussion',
      'Ian Slater (CSE) to send Select Medical reference from healthcare SOAR customer (UPMC or BJC) by Jul 14',
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const PRIORITY_COLOR = { High: 'tag--red', Medium: 'tag--yellow', Low: 'tag--gray' };
const STATUS_COLOR   = { 'Todo': 'tag--gray', 'In Progress': 'tag--blue', 'Done': 'tag--green' };
const FILTER_OPTIONS = ['All', 'Todo', 'In Progress', 'Done'];
const STATUS_STYLE   = { Completed: { tag: 'tag--green' }, Upcoming: { tag: 'tag--blue' } };
const TYPE_STYLE     = { Executive: 'tag--purple', Technical: 'tag--teal', Discovery: 'tag--yellow' };

// ── Email helper ──────────────────────────────────────────────────────────────
function sendAssignmentEmail(member, task) {
  const subject = encodeURIComponent(`Task Assigned to You: ${task.title}`);
  const body = encodeURIComponent(
    `Hi ${member.name.split(' ')[0]},\n\n` +
    `A task has been assigned to you:\n\n` +
    `Task: ${task.title}\n` +
    `Account: ${task.account || '—'}\n` +
    `Priority: ${task.priority}\n` +
    `Due Date: ${task.dueDate || '—'}\n\n` +
    `Please log in to the IBM Client Intelligence Agent to view and update this task.\n\n` +
    `Best regards,\nIBM CIA Platform`
  );
  window.open(`mailto:${member.email}?subject=${subject}&body=${body}`);
}

// ── Assign Task Modal ─────────────────────────────────────────────────────────
function AssignTaskModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: '', account: '', priority: 'Medium', dueDate: '', assignedTo: 'pratham',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Task description is required.'); return; }

    const member = TEAM_MEMBERS.find(m => m.id === form.assignedTo);
    const task = {
      id: Date.now(),
      ...form,
      status: 'Todo',
      done: false,
      source: 'user',
    };
    onAdd(task);

    // Send assignment email
    if (member) sendAssignmentEmail(member, task);

    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: 'var(--space-5)',
    }}>
      <div style={{
        background: 'var(--color-surface)', width: '100%', maxWidth: 500,
        border: '1px solid var(--color-border)',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Assign New Task</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
          {error && (
            <div style={{ background: '#fff1f1', border: '1px solid var(--ibm-red-50)', color: 'var(--ibm-red-60)', padding: '8px 12px', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Task description */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
              Task Description <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-strong)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-base)', boxSizing: 'border-box' }}
              placeholder="Describe the task…"
            />
          </div>

          {/* Assign To + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                Assign To
              </label>
              <select
                value={form.assignedTo}
                onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                style={{ width: '100%', height: 36, padding: '0 8px', border: '1px solid var(--color-border-strong)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', background: '#fff' }}
              >
                {TEAM_MEMBERS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.isSelf ? ' (Me)' : ''} — {m.role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                Priority
              </label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                style={{ width: '100%', height: 36, padding: '0 8px', border: '1px solid var(--color-border-strong)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', background: '#fff' }}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Account + Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                Account
              </label>
              <input
                type="text"
                value={form.account}
                onChange={e => setForm(f => ({ ...f, account: e.target.value }))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-strong)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-base)', boxSizing: 'border-box' }}
                placeholder="Account name"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-strong)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-base)', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', background: 'var(--color-bg-subtle)', padding: '8px 12px' }}>
            An email notification will be sent to the assigned person.
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '8px 20px', border: '1px solid var(--color-border-strong)', background: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-base)', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit"
              style={{ padding: '8px 20px', border: 'none', background: 'var(--ibm-blue-60)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-base)', fontWeight: 500, cursor: 'pointer' }}>
              Assign & Notify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Team Management Page
// ════════════════════════════════════════════════════════════════════════════
export default function TeamManagement() {
  const { tasks, addTask, toggleTask } = useTaskContext();
  const [activeTab, setActiveTab]       = useState('team');
  const [taskFilter, setTaskFilter]     = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showModal, setShowModal]       = useState(false);

  const filteredTasks = tasks.filter(t => {
    const statusMatch   = taskFilter === 'All' || t.status === taskFilter;
    const assigneeMatch = assigneeFilter === 'all' || t.assignedTo === assigneeFilter;
    return statusMatch && assigneeMatch;
  });

  const taskCounts = FILTER_OPTIONS.reduce((acc, f) => {
    acc[f] = f === 'All' ? tasks.length : tasks.filter(t => t.status === f).length;
    return acc;
  }, {});

  return (
    <div className="page-content">
      {showModal && (
        <AssignTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />
      )}

      <div className="page-header">
        <div className="page-header__eyebrow">TSL Operations</div>
        <h1 className="page-header__title">Team Management</h1>
        <p className="page-header__subtitle">
          Manage your Customer Success Engineers and Brand Sales Specialist — assign tasks, track meetings, and coordinate activities
        </p>
      </div>

      <div className="tabs">
        <button className={`tab-button${activeTab === 'team'     ? ' active' : ''}`} onClick={() => setActiveTab('team')}>My Team</button>
        <button className={`tab-button${activeTab === 'tasks'    ? ' active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
        <button className={`tab-button${activeTab === 'meetings' ? ' active' : ''}`} onClick={() => setActiveTab('meetings')}>Meetings</button>
      </div>

      {/* ── Team Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'team' && (
        <div>
          <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
            {TEAM_MEMBERS.map(member => {
              const myTasks = tasks.filter(t => t.assignedTo === member.id);
              const open    = myTasks.filter(t => !t.done).length;
              const done    = myTasks.filter(t => t.done).length;
              return (
                <div key={member.id} className="card" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: member.color, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 'var(--font-size-md)',
                      flexShrink: 0,
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>
                        {member.name}
                        {member.isSelf && (
                          <span style={{ marginLeft: 8, fontSize: 'var(--font-size-xs)', color: 'var(--ibm-blue-60)', fontWeight: 400 }}>You</span>
                        )}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <span className={`tag ${member.tagClass}`}>{member.role}</span>
                    <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {member.roleLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                    <strong>Focus:</strong> {member.focus}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--ibm-blue-60)' }}>{open}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Open</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--ibm-green-50)' }}>{done}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Done</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{myTasks.length}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Total</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setActiveTab('tasks'); setShowModal(true); }}
              style={{ padding: '10px 24px', background: 'var(--ibm-blue-60)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-base)', fontWeight: 500, cursor: 'pointer' }}
            >
              + Assign New Task
            </button>
          </div>
        </div>
      )}

      {/* ── Tasks Tab ────────────────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
                {FILTER_OPTIONS.map(f => (
                  <button
                    key={f}
                    className={`tab-button${taskFilter === f ? ' active' : ''}`}
                    onClick={() => setTaskFilter(f)}
                    style={{ padding: 'var(--space-2) var(--space-4)' }}
                  >
                    {f} <span style={{ fontSize: 'var(--font-size-xs)', marginLeft: 4, opacity: 0.7 }}>({taskCounts[f]})</span>
                  </button>
                ))}
              </div>
              <select
                value={assigneeFilter}
                onChange={e => setAssigneeFilter(e.target.value)}
                style={{ height: 34, padding: '0 12px', border: '1px solid var(--color-border-strong)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', background: '#fff' }}
              >
                <option value="all">All Assignees</option>
                {TEAM_MEMBERS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}{m.isSelf ? ' (Me)' : ''} ({m.role})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{ padding: '8px 20px', background: 'var(--ibm-blue-60)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              + Assign Task
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {filteredTasks.map(task => {
              const member = TEAM_MEMBERS.find(m => m.id === task.assignedTo);
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                    padding: 'var(--space-4)', border: '1px solid var(--color-border)',
                    background: task.done ? 'var(--color-bg-subtle)' : 'var(--color-surface)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: 16, height: 16, cursor: 'pointer', flexShrink: 0, accentColor: 'var(--ibm-blue-60)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 500, fontSize: 'var(--font-size-base)',
                      textDecoration: task.done ? 'line-through' : 'none',
                      color: task.done ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                      marginBottom: 4,
                    }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {task.account}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {member && (
                      <span className={`tag ${member.tagClass}`}>
                        {member.name.split(' ')[0]}{member.isSelf ? ' (Me)' : ''}
                      </span>
                    )}
                    <span className={`tag ${PRIORITY_COLOR[task.priority]}`}>{task.priority}</span>
                    <span className={`tag ${STATUS_COLOR[task.status]}`}>{task.status}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', minWidth: 80, textAlign: 'right' }}>
                      Due {task.dueDate}
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredTasks.length === 0 && (
              <div className="empty-state">No tasks match the selected filters.</div>
            )}
          </div>
        </div>
      )}

      {/* ── Meetings Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'meetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {MEETINGS.map(m => (
            <div key={m.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{m.account}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {m.date} · {m.attendees}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <span className={`tag ${TYPE_STYLE[m.type] || 'tag--gray'}`}>{m.type}</span>
                  <span className={`tag ${STATUS_STYLE[m.status].tag}`}>{m.status}</span>
                </div>
              </div>
              <div style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  AI Summary
                </div>
                {m.summary}
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  Action Items
                </div>
                <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {m.actions.map((a, i) => (
                    <li key={i} style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.5, color: 'var(--color-text-primary)' }}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
