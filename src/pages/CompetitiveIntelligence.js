import React, { useState, useEffect } from 'react';
import { fetchCompetitiveNews } from '../services/api';
import { formatRelativeDate } from '../components/Helpers';
import { useTaskContext } from '../context/TaskContext';

const COMPETITORS = [
  'Microsoft', 'AWS', 'Google Cloud', 'OpenAI', 'Anthropic',
  'Oracle', 'Salesforce', 'ServiceNow', 'Snowflake', 'Databricks',
  'SAP', 'Dell Technologies', 'HPE', 'VMware', 'Palo Alto Networks',
  'CrowdStrike', 'Splunk', 'Datadog', 'Cisco', 'Accenture',
];

const BATTLECARDS = [
  {
    competitor: 'Microsoft / Azure',
    winRate: '54%',
    category: 'Cloud & AI',
    differentiator: 'IBM open standards & governance vs. Microsoft proprietary stack dependency',
    strengths: ['Microsoft 365/Teams installed base creates stickiness', 'Azure Active Directory as default enterprise identity', 'Co-sell motion with Copilot/OpenAI relationship', 'Aggressive enterprise discounting'],
    ibmAdvantages: ['Watsonx AI governance and explainability built-in for regulated industries', 'IBM Security (QRadar, Guardium) outperforms Sentinel in depth and SIEM maturity', 'Red Hat OpenShift avoids Azure-only Kubernetes lock-in', 'IBM zSystems for mission-critical regulated workloads'],
    url: 'https://www.microsoft.com/en-us/azure',
  },
  {
    competitor: 'Amazon Web Services',
    winRate: '61%',
    category: 'Cloud & AI',
    differentiator: 'IBM hybrid-by-design architecture vs. AWS cloud-first lock-in',
    strengths: ['Largest global cloud footprint & ecosystem', 'Aggressive startup credits and marketplace incentives', 'Mature managed services: RDS, EKS, Lambda, SageMaker'],
    ibmAdvantages: ['OpenShift runs on ANY cloud — true multi-cloud portability', 'IBM Consulting accelerates time-to-value vs. DIY AWS builds', 'IBM zSystems for regulated, mission-critical workloads AWS cannot host', 'Watsonx AI governance not available on SageMaker'],
    url: 'https://aws.amazon.com/',
  },
  {
    competitor: 'Google Cloud',
    winRate: '58%',
    category: 'Cloud & AI',
    differentiator: 'IBM enterprise trust and hybrid reach vs. Google\'s cloud-native focus',
    strengths: ['Vertex AI and Gemini are cutting-edge AI platforms', 'BigQuery dominant for cloud data warehousing', 'Strong data analytics and ML tooling'],
    ibmAdvantages: ['IBM\'s 30-year enterprise relationships and regulated-industry expertise', 'Watsonx governance framework for explainability compliance', 'IBM Consulting provides outcome-based delivery Google Professional Services cannot match'],
    url: 'https://cloud.google.com/',
  },
  {
    competitor: 'OpenAI',
    winRate: '67%',
    category: 'AI Platforms',
    differentiator: 'IBM\'s governed, auditable AI vs. OpenAI\'s general-purpose models',
    strengths: ['GPT-4o is the industry benchmark for LLM capability', 'Rapid enterprise adoption and developer mindshare', 'ChatGPT Enterprise growing quickly in financial services'],
    ibmAdvantages: ['Watsonx.governance provides full audit trail required for FINRA, HIPAA, SOX', 'IBM trains models on curated enterprise data — not scraped public data', 'On-premises and hybrid deployment IBM watsonx; OpenAI is cloud-only'],
    url: 'https://openai.com/enterprise',
  },
  {
    competitor: 'Anthropic',
    winRate: '71%',
    category: 'AI Platforms',
    differentiator: 'IBM\'s enterprise deployment flexibility vs. Anthropic\'s API-first approach',
    strengths: ['Claude 3.5 Sonnet is best-in-class for complex reasoning', 'Strong safety and constitutional AI positioning', 'Growing enterprise partnership with AWS'],
    ibmAdvantages: ['IBM watsonx can be deployed fully on-premises — Anthropic requires API calls', 'Watsonx governance layer not available in Anthropic offering', 'IBM Consulting wraps watsonx with implementation, Anthropic is self-service'],
    url: 'https://www.anthropic.com/',
  },
  {
    competitor: 'Salesforce',
    winRate: '68%',
    category: 'CRM & Automation',
    differentiator: 'IBM enterprise integration depth vs. Salesforce CRM-centric world view',
    strengths: ['Dominant CRM market share in financial services and insurance', 'Einstein/Agentforce AI add-on gaining strong momentum', 'Low-code automation with Flow Builder and broad ISV ecosystem'],
    ibmAdvantages: ['IBM MQ and App Connect for robust, high-volume enterprise messaging', 'Watsonx Orchestrate addresses multi-system automation Salesforce cannot reach', 'IBM\'s open data model avoids Salesforce data silo and licensing problems'],
    url: 'https://www.salesforce.com/products/artificial-intelligence/',
  },
  {
    competitor: 'ServiceNow',
    winRate: '59%',
    category: 'CRM & Automation',
    differentiator: 'IBM\'s cross-domain integration vs. ServiceNow\'s ITSM-centric platform',
    strengths: ['Market leader in ITSM and IT operations management', 'Now Assist AI embedded across IT, HR, and Finance', 'Strong platform stickiness and renewal rates'],
    ibmAdvantages: ['IBM watsonx Orchestrate extends automation beyond IT/HR to business operations', 'IBM\'s open integration layer connects disparate systems ServiceNow cannot reach', 'Watsonx governance applies across all automation — ServiceNow governance is limited'],
    url: 'https://www.servicenow.com/now-platform/artificial-intelligence.html',
  },
  {
    competitor: 'Snowflake',
    winRate: '72%',
    category: 'Data & Analytics',
    differentiator: 'IBM integrated data + AI governance vs. Snowflake analytics-only story',
    strengths: ['Best-in-class cloud data warehouse performance and elasticity', 'Data sharing marketplace with third-party datasets', 'Strong BI tool integrations: Tableau, Power BI, Sigma'],
    ibmAdvantages: ['CP4D unifies data engineering, ML, and governance in one platform', 'Db2 Warehouse on-premises/hybrid matches Snowflake performance without egress costs', 'IBM OpenScale/Watson Studio provides AI lifecycle management Snowflake lacks'],
    url: 'https://www.snowflake.com/',
  },
  {
    competitor: 'Databricks',
    winRate: '64%',
    category: 'Data & Analytics',
    differentiator: 'IBM\'s governed enterprise platform vs. Databricks developer-centric open source',
    strengths: ['Lakehouse architecture is the industry\'s leading data + ML unified platform', 'Strong open-source community: Delta Lake, MLflow, Apache Spark', 'Unity Catalog growing as a governance layer'],
    ibmAdvantages: ['CP4D governance is more mature and audit-ready for regulated industries', 'IBM Consulting wraps platform with enterprise implementation and support', 'Watsonx.governance provides regulatory AI compliance Databricks Unity Catalog cannot match'],
    url: 'https://www.databricks.com/',
  },
  {
    competitor: 'Oracle',
    winRate: '55%',
    category: 'ERP & Database',
    differentiator: 'IBM\'s hybrid flexibility vs. Oracle\'s cloud lock-in strategy',
    strengths: ['Dominant Oracle DB installed base creates powerful lock-in', 'OCI pricing increasingly competitive against AWS', 'Oracle Fusion ERP deeply embedded in financial services'],
    ibmAdvantages: ['IBM Db2 and OpenShift offer a cloud-neutral Oracle migration path', 'IBM z16 mainframe outperforms Oracle Exadata for transaction-intensive workloads', 'IBM Consulting has certified Oracle-to-IBM migration practice with proven ROI'],
    url: 'https://www.oracle.com/cloud/',
  },
  {
    competitor: 'SAP',
    winRate: '52%',
    category: 'ERP & Database',
    differentiator: 'IBM\'s integration expertise vs. SAP\'s migration complexity and cost',
    strengths: ['SAP S/4HANA is the dominant ERP system globally', 'RISE with SAP simplifies cloud migration packaging', 'SAP AI Business Services embedded in ERP workflows'],
    ibmAdvantages: ['IBM Consulting is SAP\'s largest global partner — IBM can lead SAP transformations', 'IBM MQ and App Connect bridge SAP and non-SAP systems seamlessly', 'IBM AI can be layered onto SAP without requiring full S/4HANA migration'],
    url: 'https://www.sap.com/products/erp.html',
  },
  {
    competitor: 'Dell Technologies',
    winRate: '57%',
    category: 'Infrastructure',
    differentiator: 'IBM\'s software-defined platform vs. Dell\'s hardware-centric approach',
    strengths: ['APEX multi-cloud bundles offer attractive TCO for mid-market', 'Strong refresh cycle leverage with existing Dell installed base', 'PowerStore and PowerFlex are competitive hybrid storage platforms'],
    ibmAdvantages: ['IBM Power Systems outperform x86 for Oracle, SAP, and DB2 workloads', 'IBM Storage Scale and FlashSystem offer differentiated performance for AI training', 'IBM Consulting drives outcome-based engagements Dell VMware Professional Services cannot match'],
    url: 'https://www.dell.com/en-us/dt/apex/index.htm',
  },
  {
    competitor: 'HPE',
    winRate: '60%',
    category: 'Infrastructure',
    differentiator: 'IBM\'s vertical specialization vs. HPE\'s horizontal infrastructure play',
    strengths: ['GreenLake as-a-service model resonates with CFO CapEx-to-OpEx mandates', 'Aruba networking creates a full-stack edge-to-cloud story', 'Strong mid-market and SME installed base for servers and storage'],
    ibmAdvantages: ['IBM Power Systems for mission-critical regulated workloads HPE ProLiant cannot host', 'IBM zSystems offers unmatched RAS (Reliability, Availability, Serviceability) vs. HPE', 'IBM Consulting delivers business transformation — GreenLake is infrastructure-only'],
    url: 'https://www.hpe.com/us/en/greenlake.html',
  },
  {
    competitor: 'VMware / Broadcom',
    winRate: '69%',
    category: 'Infrastructure',
    differentiator: 'IBM\'s open hybrid cloud vs. VMware\'s virtualization lock-in post-Broadcom',
    strengths: ['vSphere dominates enterprise virtualization with massive installed base', 'NSX is the leading network virtualization platform', 'Post-Broadcom pricing backlash is creating churn — and VMware bundles are forcing upsells'],
    ibmAdvantages: ['Red Hat OpenShift provides a VMware migration destination with Kubernetes-native infrastructure', 'IBM Cloud VMware Solutions smooth the transition for existing VMware customers', 'IBM pricing predictability vs. Broadcom\'s aggressive licensing changes'],
    url: 'https://www.broadcom.com/products/software/vmware',
  },
  {
    competitor: 'Palo Alto Networks',
    winRate: '56%',
    category: 'Security',
    differentiator: 'IBM\'s integrated security + AI vs. Palo Alto\'s network-centric platform',
    strengths: ['Cortex XDR is a leading endpoint + cloud detection platform', 'Prisma Cloud dominates CSPM for AWS/Azure/GCP environments', 'Strong partner ecosystem and MSSP relationships'],
    ibmAdvantages: ['IBM QRadar SIEM + SOAR provides deeper threat intelligence and automated response', 'IBM Guardium is purpose-built for data security compliance PANW does not address', 'IBM X-Force threat intelligence is one of the world\'s largest threat databases'],
    url: 'https://www.paloaltonetworks.com/cortex',
  },
  {
    competitor: 'CrowdStrike',
    winRate: '51%',
    category: 'Security',
    differentiator: 'IBM\'s compliance-grade security vs. CrowdStrike\'s endpoint-first approach',
    strengths: ['Falcon platform is the market leader in endpoint detection and response (EDR)', 'CrowdStrike\'s threat intelligence is top-tier for adversary tracking', 'FedRAMP High authorization opens government market'],
    ibmAdvantages: ['IBM QRadar provides SIEM-level visibility across hybrid cloud CrowdStrike Falcon does not cover', 'IBM Guardium protects databases and data-at-rest — CrowdStrike is endpoint only', 'IBM Security Consulting delivers managed security outcomes vs. tool-only licensing'],
    url: 'https://www.crowdstrike.com/platform/falcon-xdr/',
  },
  {
    competitor: 'Splunk / Cisco',
    winRate: '58%',
    category: 'Security',
    differentiator: 'IBM\'s AI-driven SOC vs. Splunk\'s log aggregation-centric approach',
    strengths: ['Post-Cisco acquisition offers unified network + security operations', 'Splunk SIEM has deep market penetration in enterprise SOCs', 'Cisco\'s network telemetry adds unique visibility other SIEMs lack'],
    ibmAdvantages: ['IBM QRadar SIEM+SOAR automation reduces analyst workload more than Splunk Enterprise Security', 'IBM watsonx AI threat analysis provides context Splunk SPL queries require manual tuning for', 'IBM Security Consulting-led MDR services outperform Splunk\'s professional services'],
    url: 'https://www.splunk.com/en_us/products/enterprise-security.html',
  },
  {
    competitor: 'Datadog',
    winRate: '63%',
    category: 'Observability',
    differentiator: 'IBM Turbonomic\'s AI-driven cost optimization vs. Datadog\'s observability-only play',
    strengths: ['Datadog APM is the developer favorite for cloud-native observability', 'Expanding into AIOps with Watchdog and Bits AI features', 'Strong land-and-expand with per-host pricing model'],
    ibmAdvantages: ['IBM Turbonomic goes beyond monitoring — it autonomously RIGHT-SIZES resources in real time', 'IBM Instana provides full-stack observability with lower per-host cost at enterprise scale', 'IBM Consulting wraps Turbonomic with FinOps engagements Datadog does not offer'],
    url: 'https://www.datadoghq.com/product/apm/',
  },
  {
    competitor: 'Cisco',
    winRate: '55%',
    category: 'Networking & Security',
    differentiator: 'IBM\'s software-defined automation vs. Cisco\'s hardware-centric networking',
    strengths: ['Cisco dominates enterprise networking hardware and SD-WAN', 'Post-Splunk acquisition creates a unified security + networking story', 'Cisco Security Cloud is growing as a platform consolidation play'],
    ibmAdvantages: ['IBM NS1 Connect provides advanced DNS and traffic management beyond Cisco\'s scope', 'IBM Security Operations Center services combine Cisco telemetry with IBM QRadar AI analysis', 'IBM Consulting leads enterprise network modernization with open standards vs. Cisco lock-in'],
    url: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks.html',
  },
  {
    competitor: 'Accenture',
    winRate: '49%',
    category: 'Consulting',
    differentiator: 'IBM\'s product ownership + consulting integration vs. Accenture\'s pure services model',
    strengths: ['Accenture SynOps is a leading AI-driven managed operations platform', 'Global scale and industry depth across all verticals', 'Strong Google Cloud and Salesforce partnership ecosystem'],
    ibmAdvantages: ['IBM uniquely owns the underlying AI platform (watsonx) AND delivers consulting — Accenture cannot', 'IBM Consulting has proven watsonx implementation credentials in production at scale', 'IBM\'s outcome-based contracts with proprietary IP create stickier engagements than Accenture T&M'],
    url: 'https://www.accenture.com/us-en/services/technology/ai-artificial-intelligence',
  },
];

const CATEGORY_COLORS = {
  'Cloud & AI':         'tag--blue',
  'AI Platforms':       'tag--purple',
  'CRM & Automation':   'tag--teal',
  'Data & Analytics':   'tag--yellow',
  'ERP & Database':     'tag--orange',
  'Infrastructure':     'tag--gray',
  'Security':           'tag--red',
  'Observability':      'tag--green',
  'Networking & Security': 'tag--gray',
  'Consulting':         'tag--purple',
};

// ── Add to Tasks button ───────────────────────────────────────────────────────
function AddToTasksBtn({ title, competitor }) {
  const { addTask, tasks } = useTaskContext();
  const alreadyAdded = tasks.some(t => t.title === title);
  const [added, setAdded] = useState(alreadyAdded);

  const handleAdd = () => {
    if (added) return;
    const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    addTask({
      id: `ci-${Date.now()}-${Math.random()}`,
      title: `[${competitor}] ${title.slice(0, 80)}${title.length > 80 ? '…' : ''}`,
      account: 'General',
      priority: 'Medium',
      dueDate: defaultDue,
      status: 'Todo',
      done: false,
      assignedTo: 'pratham',
      source: 'user',
      type: 'Re-engagement',
    });
    setAdded(true);
  };

  return (
    <button onClick={handleAdd} disabled={added} style={{
      marginTop: 'var(--space-3)',
      padding: '3px 10px', fontSize: 11,
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

// ── Live News Section ────────────────────────────────────────────────────────
function LiveNewsSection({ filterComp }) {
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const comp = filterComp !== 'All' ? filterComp : null;
    fetchCompetitiveNews(comp, 14)
      .then(data => {
        setArticles(data.articles || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [filterComp]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 0' }}>
      <div style={{ width: 20, height: 20, border: '2px solid var(--ibm-blue-60)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Fetching live competitor news…</span>
    </div>
  );

  if (error) return (
    <div className="notification notification--error">
      Failed to load competitor news: {error}
    </div>
  );

  return (
    <div>
      {articles.length === 0 ? (
        <div className="empty-state">No recent news found for the selected competitor.</div>
      ) : (
        <div className="article-list">
          {articles.map((item, idx) => (
            <div key={idx} className="article-card">
              <div className="article-card__source-row">
                <span className="article-card__source">{item.competitor}</span>
                <span className="article-card__date">
                  {item.published_at ? formatRelativeDate(item.published_at) : item.date || ''}
                </span>
                <span style={{ marginLeft: 'auto' }}>
                  <span className={`tag ${item.relevance === 'Threat' ? 'tag--red' : 'tag--green'}`}>
                    {item.relevance || 'News'}
                  </span>
                </span>
              </div>
              <div className="article-card__title">
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-primary)' }}>
                  {item.title || item.headline}
                </a>
              </div>
              {item.description && (
                <div className="article-card__description">
                  <strong>{item.source}</strong> — {item.description || item.summary}
                </div>
              )}
              {item.url && item.url !== '#' && (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 'var(--font-size-xs)', color: 'var(--ibm-blue-60)', fontWeight: 600 }}>
                    Read full coverage →
                  </a>
                </div>
              )}
              <AddToTasksBtn title={item.title || item.headline || ''} competitor={item.competitor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function CompetitiveIntelligence() {
  const [tab, setTab]               = useState('news');
  const [filterComp, setFilterComp] = useState('All');
  const [expanded, setExpanded]     = useState(null);

  const filteredCards = filterComp === 'All'
    ? BATTLECARDS
    : BATTLECARDS.filter(b =>
        b.competitor.toLowerCase().includes(filterComp.toLowerCase()) ||
        b.category === filterComp
      );

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Intelligence</div>
        <h1 className="page-header__title">Competitive Intelligence</h1>
        <p className="page-header__subtitle">
          Live signals and IBM battlecards for all 20 key competitors in your territory
        </p>
      </div>

      {/* ── Competitor Filter Strip ── */}
      <div style={{ marginBottom: 'var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {['All', ...COMPETITORS].map(c => (
          <button
            key={c}
            onClick={() => setFilterComp(c)}
            style={{
              padding: '4px 12px',
              border: `1px solid ${filterComp === c ? 'var(--ibm-blue-60)' : 'var(--color-border)'}`,
              background: filterComp === c ? 'var(--ibm-blue-60)' : 'var(--color-surface)',
              color: filterComp === c ? '#fff' : 'var(--color-text-secondary)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: filterComp === c ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="tabs">
        <button className={`tab-button${tab === 'news' ? ' active' : ''}`} onClick={() => setTab('news')}>
          Live Competitor News
        </button>
        <button className={`tab-button${tab === 'battlecards' ? ' active' : ''}`} onClick={() => setTab('battlecards')}>
          Battlecards ({filteredCards.length})
        </button>
      </div>

      {tab === 'news' && <LiveNewsSection filterComp={filterComp} />}

      {tab === 'battlecards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredCards.length === 0 && (
            <div className="empty-state">No battlecards for the selected competitor.</div>
          )}
          {filteredCards.map(bc => (
            <div key={bc.competitor} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header — always visible */}
              <div
                onClick={() => setExpanded(expanded === bc.competitor ? null : bc.competitor)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-4) var(--space-5)', cursor: 'pointer',
                  background: expanded === bc.competitor ? 'var(--ibm-gray-10)' : 'var(--color-surface)',
                  borderBottom: expanded === bc.competitor ? '1px solid var(--color-border)' : 'none',
                  gap: 'var(--space-4)', flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1, minWidth: 0 }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{bc.competitor}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {bc.differentiator}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
                  <span className={`tag ${CATEGORY_COLORS[bc.category] || 'tag--gray'}`}>{bc.category}</span>
                  <span className="tag tag--green">Win Rate: {bc.winRate}</span>
                  <a href={bc.url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize: 'var(--font-size-xs)', color: 'var(--ibm-blue-60)', fontWeight: 600 }}>
                    Website ↗
                  </a>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {expanded === bc.competitor ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === bc.competitor && (
                <div style={{ padding: 'var(--space-5)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--ibm-red-60)', marginBottom: 'var(--space-3)' }}>
                      Their Strengths
                    </div>
                    <ul style={{ paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {bc.strengths.map((s, i) => (
                        <li key={i} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--ibm-green-60)', marginBottom: 'var(--space-3)' }}>
                      IBM Advantages
                    </div>
                    <ul style={{ paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {bc.ibmAdvantages.map((a, i) => (
                        <li key={i} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
