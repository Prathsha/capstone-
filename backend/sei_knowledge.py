"""
sei_knowledge.py
----------------
Static knowledge base about SEI (SEI Investments Company).
Imported by routers/chat.py and injected into every system prompt so the
agent is always an expert on this client — no API call required.
"""

SEI_KNOWLEDGE_BASE = """
## SEI KNOWLEDGE BASE

### Company Overview
- Full name: SEI Investments Company (SEI Global Services Inc.)
- Founded: ~56 years ago
- Market Cap: ~$10B
- Employees: ~5,000
- FY2025 Revenue: ~$2.3B (+8.1% YoY)

### Business Pillars
1. **Investment Managers (IMS)** — 35.5%, ~$815M revenue
   - Fund administration, accounting, compliance, alternatives operations.
2. **Advisors** — 25.1%, ~$577M revenue
   - Investment products, model portfolios, wealth platform tools for RIAs and planners.
3. **Private Banks** — 24.9%, ~$573M revenue
   - Wealth technology and investment processing infrastructure.
4. **Institutions** — 12.3%, ~$283M revenue
   - Retirement plans, nonprofits, healthcare systems, endowments.

### SEI Next (Innovation Group)
Mission: Identify emerging opportunities and integrate them into the business.
- Build: New products and technologies (crypto, tokenization).
- Invest: Startup investments (e.g., Avantos).
- Partner: Strategic partnerships, including Copilot-related ownership.

### Current IBM Relationship
- Annual IBM Spend: ~$3.3M
- IBM ELA renews: 2028
- Technology footprint: Mainframe, Sterling, MQ, Apptio

### IBM Consulting Engagement
- Focus: Operational efficiency and revenue-per-employee improvement.
- $40M gain-share engagement with IMS.
- Target: $125M in cost savings.

### IBM-SEI ESSO Agreement
- Customer: SEI Global Services Inc. | Provider: IBM
- Contract period: Dec 31, 2023 – Dec 31, 2029
- Payment schedule:
  - Dec 31, 2023: $8.82M
  - Jan 1, 2025: $2.22M
  - Jan 1, 2026: $2.25M
  - Jan 1, 2027: $2.40M
  - Jan 1, 2028: $2.55M
- Approximate total contract value: ~$18.24M

### Major IBM Software in SEI's Environment
Infrastructure:
- IBM MQ, IBM Sterling Connect:Direct, IBM Turbonomic
- IBM Cloud Pak for Business Automation, IBM DataStage, IBM ODM
- Host Access Client Package

Security & Governance:
- IBM AI Governance Express (already owned), IBM Security Guardium
- Security and Compliance Center

Mainframe:
- z/OS, COBOL, PL/1, CICS, Observability tools, Service Automation Suite

### SEI AI Situation
- Uses Microsoft Copilot and internal SEIGPT solution.
- ROI has not met expectations.
- Needs an agentic AI operating framework.
- Needs AI governance and risk management.
- Vendors engaging leadership: IBM, Microsoft, and xAI.

### IBM Responsible Technology / AI Governance
Core belief: Governance enables trust, speed, and AI ROI — not just compliance.

IBM Trust Principles:
1. AI should augment—not replace—human intelligence.
2. Data and insights belong to their creator.
3. AI systems must be transparent and explainable.

IBM Pillars of Trust: Fairness, Privacy, Explainability, Transparency, Robustness.

Major Enterprise AI Risks IBM addresses:
- Hallucinations, misuse, security vulnerabilities, explainability issues,
  lack of transparency, shadow AI, bias, model drift, privacy concerns, traceability.

### IBM Governance Framework
Organizational Governance: Strategy, policies, accountability, governance boards, risk assessments.
Technical Governance: Development, deployment, monitoring, lifecycle management, model governance.

Integrated Governance Program (IGP) covers:
- Responsible Technology, Privacy, Data Governance, Model Governance, AI Governance.

Integrated Governance Management System (IGMS) capabilities:
- Unified inventory, governance workflows, compliance automation,
  AI lifecycle management, enterprise visibility and dashboards.

Key tools: Trustbot (watsonx-powered), Risk Advisor (AI risk assessments), AI Risk Atlas (60+ risk categories).

IBM Governance Results:
- 5,500+ applications/processes governed; 2,000+ datasets and models cataloged.
- New compliance programs launched in 6 weeks; 58% faster third-party data clearance;
  62% faster internal data clearance.

### Most Important Strategic Insights for SEI
1. SEI's #1 objective is operational efficiency and cost reduction.
2. IBM is tied to a $125M cost-savings initiative — every recommendation should connect back to this.
3. SEI already has Copilot and SEIGPT but lacks a mature agentic AI framework — this is a key gap.
4. AI governance is a recognized enterprise gap at SEI.
5. SEI already owns IBM AI Governance Express through its enterprise software agreement — this is the fastest activation path.
6. IBM's recommended model: Responsible Technology Board + Integrated Governance Program + AI Risk Atlas + watsonx.governance.
7. Agentic AI governance, monitoring, compliance, and risk management are the highest-priority IBM expansion opportunities within SEI.
""".strip()
