import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * TaskContext
 * -----------
 * Single source of truth for tasks / pending action items.
 * Shared between Dashboard, Tasks page, and TeamManagement.
 *
 * Tasks have this shape:
 *   id, title, account, priority, dueDate, status, done,
 *   assignedTo (team member id or 'self'), source ('system' | 'user')
 */

const TaskContext = createContext(null);

// ── Real team members ─────────────────────────────────────────────────────────
export const TEAM_MEMBERS = [
  {
    id: 'pratham',
    name: 'Pratham Shah',
    role: 'CSE',
    roleLabel: 'Customer Success Engineer',
    email: 'Pratham.shah@ibm.com',
    focus: 'Customer Success & Technical Enablement',
    color: 'var(--ibm-blue-60)',
    tagClass: 'tag--blue',
    isSelf: true,
  },
  {
    id: 'ian',
    name: 'Ian Slater',
    role: 'CSE',
    roleLabel: 'Customer Success Engineer',
    email: 'Ian.Slater@ibm.com',
    focus: 'Customer Success & Technical Enablement',
    color: 'var(--ibm-purple-60)',
    tagClass: 'tag--purple',
  },
  {
    id: 'sadaf',
    name: 'Sadaf Sobhani',
    role: 'BSS',
    roleLabel: 'Brand Sales Specialist',
    email: 'Sadaf.Sobhani@ibm.com',
    focus: 'Brand Strategy & Sales Execution',
    color: 'var(--ibm-teal-50)',
    tagClass: 'tag--teal',
  },
];

// ── Initial task seed data ────────────────────────────────────────────────────
const SEED_TASKS = [
  { id: 1,  title: 'Deliver final SOW redline for MAS 8.11 expansion to Siemens legal',     account: 'SIEMENS',                priority: 'High',   dueDate: '2026-07-14', status: 'In Progress', assignedTo: 'pratham', done: false, source: 'system' },
  { id: 2,  title: 'Send CP4D Enterprise renewal contract draft to Quest Diagnostics',       account: 'QUEST DIAGNOSTICS',      priority: 'High',   dueDate: '2026-07-16', status: 'In Progress', assignedTo: 'ian',     done: false, source: 'system' },
  { id: 3,  title: 'Follow up with Kevin Marsh on Guardium security certification receipt',  account: 'LINCOLN NATIONAL',       priority: 'High',   dueDate: '2026-07-08', status: 'Done',        assignedTo: 'pratham', done: true,  source: 'system' },
  { id: 4,  title: 'Prepare multi-year Db2 commit pricing with IBM Financing options',       account: 'SUNGARD DATA',           priority: 'High',   dueDate: '2026-07-13', status: 'Done',        assignedTo: 'sadaf',   done: true,  source: 'system' },
  { id: 5,  title: 'Provide Watson Assistant renewal pricing with 3-year option',            account: 'INDEPENDENCE BLUECROSS', priority: 'Medium', dueDate: '2026-07-15', status: 'Todo',        assignedTo: 'ian',     done: false, source: 'system' },
  { id: 6,  title: 'Finalize 12 HIPAA QRadar SOAR playbooks before scoping meeting',        account: 'SELECT MEDICAL CORP',    priority: 'Medium', dueDate: '2026-07-17', status: 'In Progress', assignedTo: 'pratham', done: false, source: 'system' },
  { id: 7,  title: 'Send Select Medical healthcare SOAR reference (UPMC or BJC)',            account: 'SELECT MEDICAL CORP',    priority: 'Medium', dueDate: '2026-07-14', status: 'Todo',        assignedTo: 'ian',     done: false, source: 'system' },
  { id: 8,  title: 'Prepare OpenPages Enterprise Risk Mgmt expansion EBR deck',              account: 'LINCOLN NATIONAL',       priority: 'Low',    dueDate: '2026-07-18', status: 'Todo',        assignedTo: 'sadaf',   done: false, source: 'system' },
  { id: 9,  title: 'Confirm Aug 14 TRIRIGA scoping kick-off agenda with Brian Torres team', account: 'QUEST DIAGNOSTICS',      priority: 'Low',    dueDate: '2026-07-15', status: 'Todo',        assignedTo: 'ian',     done: false, source: 'system' },
  { id: 10, title: 'Schedule IBM Cognos re-engagement with Carol Simmons',                   account: 'SEI INVESTMENTS',        priority: 'Low',    dueDate: '2026-07-20', status: 'Todo',        assignedTo: 'sadaf',   done: false, source: 'system' },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(SEED_TASKS);

  const addTask = useCallback((task) => {
    setTasks(prev => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, done: !t.done, status: !t.done ? 'Done' : 'In Progress' }
        : t
    ));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used inside <TaskProvider>');
  return ctx;
}
