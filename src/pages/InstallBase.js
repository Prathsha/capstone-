import React from 'react';

// The 9 real accounts
const ACCOUNTS = [
  'QUEST DIAGNOSTICS',
  'THE LINCOLN NATIONAL',
  'SIEMENS',
  'SEI INVESTMENTS',
  'INDEPENDENCE BLUECROSS',
  'SUNGARD DATA SYSTEMS',
  'SELECT MEDICAL CORP',
  'RICOH',
  'SAGENT M&C LLC',
];

const IBM_PORTFOLIO = [
  {
    product: 'IBM Watson Health / CP4D',
    category: 'AI & Analytics',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: true,  renewal: 'Sep 2026' },
      'THE LINCOLN NATIONAL':    { owned: false, renewal: null },
      'SIEMENS':                 { owned: false, renewal: null },
      'SEI INVESTMENTS':         { owned: false, renewal: null },
      'INDEPENDENCE BLUECROSS':  { owned: false, renewal: null },
      'SUNGARD DATA SYSTEMS':    { owned: false, renewal: null },
      'SELECT MEDICAL CORP':     { owned: false, renewal: null },
      'RICOH':                   { owned: false, renewal: null },
      'SAGENT M&C LLC':          { owned: false, renewal: null },
    },
  },
  {
    product: 'IBM OpenPages',
    category: 'GRC',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: false, renewal: null },
      'THE LINCOLN NATIONAL':    { owned: true,  renewal: 'Nov 2026' },
      'SIEMENS':                 { owned: false, renewal: null },
      'SEI INVESTMENTS':         { owned: false, renewal: null },
      'INDEPENDENCE BLUECROSS':  { owned: false, renewal: null },
      'SUNGARD DATA SYSTEMS':    { owned: false, renewal: null },
      'SELECT MEDICAL CORP':     { owned: false, renewal: null },
      'RICOH':                   { owned: false, renewal: null },
      'SAGENT M&C LLC':          { owned: true,  renewal: 'Oct 2026' },
    },
  },
  {
    product: 'IBM MAS (Maximo)',
    category: 'Asset Mgmt',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: false, renewal: null },
      'THE LINCOLN NATIONAL':    { owned: false, renewal: null },
      'SIEMENS':                 { owned: true,  renewal: 'Dec 2026' },
      'SEI INVESTMENTS':         { owned: false, renewal: null },
      'INDEPENDENCE BLUECROSS':  { owned: false, renewal: null },
      'SUNGARD DATA SYSTEMS':    { owned: false, renewal: null },
      'SELECT MEDICAL CORP':     { owned: false, renewal: null },
      'RICOH':                   { owned: false, renewal: null },
      'SAGENT M&C LLC':          { owned: false, renewal: null },
    },
  },
  {
    product: 'IBM CP4BA / Automation',
    category: 'Automation',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: false, renewal: null },
      'THE LINCOLN NATIONAL':    { owned: false, renewal: null },
      'SIEMENS':                 { owned: false, renewal: null },
      'SEI INVESTMENTS':         { owned: true,  renewal: 'Jan 2027' },
      'INDEPENDENCE BLUECROSS':  { owned: false, renewal: null },
      'SUNGARD DATA SYSTEMS':    { owned: false, renewal: null },
      'SELECT MEDICAL CORP':     { owned: false, renewal: null },
      'RICOH':                   { owned: true,  renewal: 'Feb 2027' },
      'SAGENT M&C LLC':          { owned: false, renewal: null },
    },
  },
  {
    product: 'IBM Watson Assistant',
    category: 'AI / Chatbot',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: false, renewal: null },
      'THE LINCOLN NATIONAL':    { owned: false, renewal: null },
      'SIEMENS':                 { owned: false, renewal: null },
      'SEI INVESTMENTS':         { owned: false, renewal: null },
      'INDEPENDENCE BLUECROSS':  { owned: true,  renewal: 'Aug 2026' },
      'SUNGARD DATA SYSTEMS':    { owned: false, renewal: null },
      'SELECT MEDICAL CORP':     { owned: false, renewal: null },
      'RICOH':                   { owned: false, renewal: null },
      'SAGENT M&C LLC':          { owned: false, renewal: null },
    },
  },
  {
    product: 'IBM Db2 on Cloud',
    category: 'Database',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: false, renewal: null },
      'THE LINCOLN NATIONAL':    { owned: false, renewal: null },
      'SIEMENS':                 { owned: false, renewal: null },
      'SEI INVESTMENTS':         { owned: false, renewal: null },
      'INDEPENDENCE BLUECROSS':  { owned: false, renewal: null },
      'SUNGARD DATA SYSTEMS':    { owned: true,  renewal: 'Oct 2026' },
      'SELECT MEDICAL CORP':     { owned: false, renewal: null },
      'RICOH':                   { owned: false, renewal: null },
      'SAGENT M&C LLC':          { owned: false, renewal: null },
    },
  },
  {
    product: 'IBM Security QRadar',
    category: 'Security',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: false, renewal: null },
      'THE LINCOLN NATIONAL':    { owned: false, renewal: null },
      'SIEMENS':                 { owned: false, renewal: null },
      'SEI INVESTMENTS':         { owned: false, renewal: null },
      'INDEPENDENCE BLUECROSS':  { owned: false, renewal: null },
      'SUNGARD DATA SYSTEMS':    { owned: false, renewal: null },
      'SELECT MEDICAL CORP':     { owned: true,  renewal: 'Nov 2026' },
      'RICOH':                   { owned: false, renewal: null },
      'SAGENT M&C LLC':          { owned: false, renewal: null },
    },
  },
  {
    product: 'IBM FileNet / Content',
    category: 'Content Mgmt',
    installs: {
      'QUEST DIAGNOSTICS':       { owned: false, renewal: null },
      'THE LINCOLN NATIONAL':    { owned: false, renewal: null },
      'SIEMENS':                 { owned: false, renewal: null },
      'SEI INVESTMENTS':         { owned: false, renewal: null },
      'INDEPENDENCE BLUECROSS':  { owned: false, renewal: null },
      'SUNGARD DATA SYSTEMS':    { owned: false, renewal: null },
      'SELECT MEDICAL CORP':     { owned: false, renewal: null },
      'RICOH':                   { owned: true,  renewal: 'Feb 2027' },
      'SAGENT M&C LLC':          { owned: false, renewal: null },
    },
  },
];

const THREAT_LEVEL = { High: 'tag--red', Medium: 'tag--yellow', Low: 'tag--gray' };

const COMP_FOOTPRINT = [
  {
    competitor: 'Microsoft / Azure',
    accounts: {
      'QUEST DIAGNOSTICS':      { present: true,  threat: 'Medium', products: 'Azure Health Data Services' },
      'THE LINCOLN NATIONAL':   { present: false, threat: null,    products: null },
      'SIEMENS':                { present: true,  threat: 'High',  products: 'Azure IoT Hub, Dynamics 365' },
      'SEI INVESTMENTS':        { present: true,  threat: 'High',  products: 'Power Automate, Power BI' },
      'INDEPENDENCE BLUECROSS': { present: false, threat: null,    products: null },
      'SUNGARD DATA SYSTEMS':   { present: false, threat: null,    products: null },
      'SELECT MEDICAL CORP':    { present: true,  threat: 'Medium',products: 'Defender for Cloud' },
      'RICOH':                  { present: true,  threat: 'Medium',products: 'SharePoint Online' },
      'SAGENT M&C LLC':         { present: false, threat: null,    products: null },
    },
  },
  {
    competitor: 'AWS',
    accounts: {
      'QUEST DIAGNOSTICS':      { present: false, threat: null,   products: null },
      'THE LINCOLN NATIONAL':   { present: false, threat: null,   products: null },
      'SIEMENS':                { present: false, threat: null,   products: null },
      'SEI INVESTMENTS':        { present: false, threat: null,   products: null },
      'INDEPENDENCE BLUECROSS': { present: true,  threat: 'High', products: 'Amazon Connect, Lex' },
      'SUNGARD DATA SYSTEMS':   { present: true,  threat: 'High', products: 'Aurora PostgreSQL' },
      'SELECT MEDICAL CORP':    { present: false, threat: null,   products: null },
      'RICOH':                  { present: false, threat: null,   products: null },
      'SAGENT M&C LLC':         { present: false, threat: null,   products: null },
    },
  },
  {
    competitor: 'Snowflake',
    accounts: {
      'QUEST DIAGNOSTICS':      { present: false, threat: null,   products: null },
      'THE LINCOLN NATIONAL':   { present: false, threat: null,   products: null },
      'SIEMENS':                { present: false, threat: null,   products: null },
      'SEI INVESTMENTS':        { present: false, threat: null,   products: null },
      'INDEPENDENCE BLUECROSS': { present: false, threat: null,   products: null },
      'SUNGARD DATA SYSTEMS':   { present: true,  threat: 'High', products: 'Snowflake Data Cloud' },
      'SELECT MEDICAL CORP':    { present: false, threat: null,   products: null },
      'RICOH':                  { present: false, threat: null,   products: null },
      'SAGENT M&C LLC':         { present: false, threat: null,   products: null },
    },
  },
  {
    competitor: 'Palo Alto Networks',
    accounts: {
      'QUEST DIAGNOSTICS':      { present: false, threat: null,    products: null },
      'THE LINCOLN NATIONAL':   { present: true,  threat: 'Medium',products: 'Cortex XDR' },
      'SIEMENS':                { present: false, threat: null,    products: null },
      'SEI INVESTMENTS':        { present: false, threat: null,    products: null },
      'INDEPENDENCE BLUECROSS': { present: false, threat: null,    products: null },
      'SUNGARD DATA SYSTEMS':   { present: false, threat: null,    products: null },
      'SELECT MEDICAL CORP':    { present: true,  threat: 'High',  products: 'Prisma Cloud, Cortex XSOAR' },
      'RICOH':                  { present: false, threat: null,    products: null },
      'SAGENT M&C LLC':         { present: false, threat: null,    products: null },
    },
  },
  {
    competitor: 'ServiceNow / UiPath',
    accounts: {
      'QUEST DIAGNOSTICS':      { present: false, threat: null,    products: null },
      'THE LINCOLN NATIONAL':   { present: true,  threat: 'Medium',products: 'ServiceNow GRC' },
      'SIEMENS':                { present: false, threat: null,    products: null },
      'SEI INVESTMENTS':        { present: true,  threat: 'High',  products: 'UiPath RPA Platform' },
      'INDEPENDENCE BLUECROSS': { present: false, threat: null,    products: null },
      'SUNGARD DATA SYSTEMS':   { present: false, threat: null,    products: null },
      'SELECT MEDICAL CORP':    { present: false, threat: null,    products: null },
      'RICOH':                  { present: false, threat: null,    products: null },
      'SAGENT M&C LLC':         { present: true,  threat: 'Medium',products: 'Wolters Kluwer OneSumX' },
    },
  },
];

function nearRenewal(dateStr) {
  if (!dateStr) return false;
  const [month, year] = dateStr.split(' ');
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const d = new Date(parseInt(year), months[month], 1);
  const diffMs = d - new Date();
  return diffMs > 0 && diffMs < 1000 * 60 * 60 * 24 * 120;
}

export default function InstallBase() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Technical</div>
        <h1 className="page-header__title">Install Base</h1>
        <p className="page-header__subtitle">IBM portfolio coverage and competitive footprint across your 9 accounts</p>
      </div>

      {/* IBM Portfolio */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', overflowX: 'auto' }}>
        <div className="card__header">
          <div className="card__title">IBM Portfolio Coverage</div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>⚠ = renewal within 120 days</span>
        </div>
        <table className="data-table install-base-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              {ACCOUNTS.map(a => <th key={a} style={{ fontSize: 10, whiteSpace: 'normal', minWidth: 80 }}>{a}</th>)}
            </tr>
          </thead>
          <tbody>
            {IBM_PORTFOLIO.map(row => (
              <tr key={row.product}>
                <td style={{ fontWeight: 600 }}>{row.product}</td>
                <td><span className="tag tag--gray">{row.category}</span></td>
                {ACCOUNTS.map(account => {
                  const inst = row.installs[account];
                  if (!inst || !inst.owned) return <td key={account} style={{ textAlign: 'center', color: 'var(--ibm-gray-40)' }}>—</td>;
                  const warn = nearRenewal(inst.renewal);
                  return (
                    <td key={account} style={{ textAlign: 'center' }}>
                      <span style={{ color: 'var(--ibm-green-50)', fontWeight: 700, fontSize: 16 }}>✓</span>
                      {warn
                        ? <div style={{ fontSize: 10, color: 'var(--ibm-orange-40)', marginTop: 2 }}>⚠ {inst.renewal}</div>
                        : inst.renewal && <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>{inst.renewal}</div>
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitive Footprint */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card__header"><div className="card__title">Competitive Footprint</div></div>
        <table className="data-table install-base-table">
          <thead>
            <tr>
              <th>Competitor</th>
              {ACCOUNTS.map(a => <th key={a} style={{ fontSize: 10, whiteSpace: 'normal', minWidth: 80 }}>{a}</th>)}
            </tr>
          </thead>
          <tbody>
            {COMP_FOOTPRINT.map(row => (
              <tr key={row.competitor}>
                <td style={{ fontWeight: 600 }}>{row.competitor}</td>
                {ACCOUNTS.map(account => {
                  const inst = row.accounts[account];
                  if (!inst || !inst.present) return <td key={account} style={{ textAlign: 'center', color: 'var(--ibm-gray-40)' }}>—</td>;
                  return (
                    <td key={account} style={{ textAlign: 'center' }}>
                      <span className={`tag ${THREAT_LEVEL[inst.threat] || 'tag--gray'}`} style={{ fontSize: 10 }}>{inst.threat}</span>
                      <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>{inst.products}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
