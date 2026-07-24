import React, { useState } from 'react';
import { useTaskContext, TEAM_MEMBERS } from '../context/TaskContext';

const PRIORITY_COLOR = { High: 'tag--red', Medium: 'tag--yellow', Low: 'tag--gray', Critical: 'tag--red' };
const STATUS_COLOR   = { 'Todo': 'tag--gray', 'In Progress': 'tag--blue', 'Done': 'tag--green' };
const FILTER_OPTIONS = ['All', 'Todo', 'In Progress', 'Done'];
const PRIORITY_LABELS = ['Critical', 'High', 'Medium', 'Low'];
const ACTION_TYPES = [
  'Follow-up', 'Renewal', 'EBR', 'POC', 'Proposal', 'Demo',
  'Contract', 'Technical', 'Workshop', 'Re-engagement', 'Review',
  'At-Risk', 'Engagement', 'Other',
];

// ── Account list from seed tasks ──────────────────────────────────────────────
const SEED_ACCOUNTS = [
  'SIEMENS', 'QUEST DIAGNOSTICS', 'LINCOLN NATIONAL', 'SUNGARD DATA',
  'INDEPENDENCE BLUECROSS', 'SELECT MEDICAL CORP', 'SEI INVESTMENTS',
  'RICOH', 'Other',
];

function NewTaskModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    account: SEED_ACCOUNTS[0],
    type: 'Follow-up',
    priority: 'Medium',
    dueDate: '',
    assignedTo: 'pratham',
    description: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Task title is required.'); return; }
    if (!form.dueDate)       { setError('Due date is required.');   return; }
    onSave(form);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-5)',
    }}>
      <div style={{
        background: '#fff', width: 520, maxWidth: '100%',
        border: '1px solid var(--color-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>New Task</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Create a task and assign it to your team
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: 'var(--color-text-secondary)', lineHeight: 1,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
          {error && (
            <div style={{ background: '#fff1f1', border: '1px solid var(--ibm-red-50)', color: 'var(--ibm-red-60)', padding: '8px 12px', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
              Task Title <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
            </label>
            <input
              type="text"
              className="account-selector__select"
              style={{ width: '100%', fontFamily: 'var(--font-sans)' }}
              placeholder="Describe the task…"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          {/* Company */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
              Company <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
            </label>
            <select className="account-selector__select" style={{ width: '100%' }}
              value={form.account} onChange={e => setForm(f => ({ ...f, account: e.target.value }))}>
              {SEED_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Type + Criticality */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>Action Type</label>
              <select className="account-selector__select" style={{ width: '100%' }}
                value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                Criticality <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
              </label>
              <select className="account-selector__select" style={{ width: '100%' }}
                value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                {PRIORITY_LABELS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Due Date + Assign To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                Due Date <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
              </label>
              <input type="date" className="account-selector__select" style={{ width: '100%', fontFamily: 'var(--font-sans)' }}
                value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>Assign To</label>
              <select className="account-selector__select" style={{ width: '100%' }}
                value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
                {TEAM_MEMBERS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}{m.isSelf ? ' (Me)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>Notes (optional)</label>
            <textarea rows={2} style={{
              width: '100%', padding: '8px 12px', fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-sm)', border: '1px solid var(--color-border)',
              resize: 'vertical', background: 'var(--color-bg)', color: 'var(--color-text-primary)',
              boxSizing: 'border-box',
            }}
              placeholder="Optional notes…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
            <button type="button" onClick={onClose} style={{
              padding: '8px 20px', background: 'none', border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', cursor: 'pointer',
              color: 'var(--color-text-secondary)',
            }}>Cancel</button>
            <button type="submit" style={{
              padding: '8px 20px', background: 'var(--ibm-blue-60)', border: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', cursor: 'pointer',
              color: '#fff', fontWeight: 600,
            }}>Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskContext();
  const [filter, setFilter]   = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);
  const counts   = FILTER_OPTIONS.reduce((acc, f) => {
    acc[f] = f === 'All' ? tasks.length : tasks.filter(t => t.status === f).length;
    return acc;
  }, {});

  const handleSave = (form) => {
    addTask({
      id: `task-${Date.now()}`,
      title: form.title,
      account: form.account,
      priority: form.priority,
      dueDate: form.dueDate,
      status: 'Todo',
      done: false,
      assignedTo: form.assignedTo,
      source: 'user',
      type: form.type,
    });
  };

  return (
    <div className="page-content">
      {showModal && <NewTaskModal onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div className="page-header__eyebrow">Activities</div>
            <h1 className="page-header__title">Tasks</h1>
            <p className="page-header__subtitle">
              {tasks.filter(t => !t.done).length} open · {tasks.filter(t => t.done).length} completed
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 18px', background: 'var(--ibm-blue-60)', border: 'none',
              color: '#fff', fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-sm)', fontWeight: 600, cursor: 'pointer',
              alignSelf: 'center',
            }}
          >
            + New Task
          </button>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-4)' }}>
        {FILTER_OPTIONS.map(f => (
          <button
            key={f}
            className={`tab-button${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} <span style={{ fontSize: 'var(--font-size-xs)', marginLeft: 4, opacity: 0.7 }}>({counts[f]})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {filtered.map(task => {
          const member = TEAM_MEMBERS.find(m => m.id === task.assignedTo);
          return (
            <div
              key={task.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-4)', border: '1px solid var(--color-border)',
                background: task.done ? 'var(--color-bg-subtle)' : 'var(--color-surface)',
                transition: 'background 0.1s',
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
                <span className={`tag ${PRIORITY_COLOR[task.priority] || 'tag--gray'}`}>{task.priority}</span>
                <span className={`tag ${STATUS_COLOR[task.status] || 'tag--gray'}`}>{task.status}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', minWidth: 80, textAlign: 'right' }}>
                  Due {task.dueDate}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--ibm-gray-50)', fontSize: 13, padding: '2px 4px',
                  }}
                >✕</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-state">No tasks in "{filter}"</div>
        )}
      </div>
    </div>
  );
}
