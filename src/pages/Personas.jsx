import React from "react";
import PageContainer from "../components/PageContainer";
import ChartPanel from "../components/ChartPanel";
import InsightCard from "../components/InsightCard";

const Personas = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const personas = [
    {
      id: 'cluster-0',
      title: 'Cluster 0: The Baseline',
      population: '1,296',
      subtitle: 'The Knowledgeable & Healthy',
      severity: 'green',
      profile: 'High knowledge, low lifestyle risk.',
      description: 'These individuals are well-informed about stroke symptoms and maintain healthy lifestyle habits. They represent the "ideal" segment of the population.',
      strategy: 'Engage as community ambassadors to help spread awareness to other segments.'
    },
    {
      id: 'cluster-1',
      title: 'Cluster 1: The Willing',
      population: '1,504',
      subtitle: 'Uninformed but Proactive',
      severity: 'blue',
      profile: 'Low knowledge, but takes quick action.',
      description: 'They may not know all the medical signs of a stroke, but they have a strong instinct to seek help immediately when something feels wrong. Their gap is purely educational.',
      strategy: 'Provide clear, accessible health literacy materials to bridge their knowledge gap.'
    },
    {
      id: 'cluster-2',
      title: 'Cluster 2: The High-Risk',
      population: '1,619',
      subtitle: 'Low Awareness & Passive',
      severity: 'red',
      profile: 'The most vulnerable group.',
      description: 'This group combines low awareness with a tendency for slow responses and higher risk behaviors (e.g., smoking, physical inactivity).',
      strategy: 'High-priority target for intensive intervention and community-based health programs.'
    },
    {
      id: 'cluster-3',
      title: 'Cluster 3: The Paradox',
      population: '1,749',
      subtitle: 'Knowledgeable but Risky',
      severity: 'amber',
      profile: 'High knowledge, but high lifestyle risk.',
      description: 'A concerning segment that knows the risks and symptoms but fails to translate that knowledge into healthy habits or rapid action.',
      strategy: 'Focus on behavioral nudges and lifestyle coaching rather than just information.'
    }
  ];

  return (
    <PageContainer
      title="Behavioral Personas"
      description="Mapping the population into four distinct behavioral archetypes based on awareness, lifestyle risks, and emergency response propensity."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      pageHeaderMeta={{ sectionTag: 'SECTION 07', severity: 'good', severityLabel: 'ACTIONABLE' }}
    >
      
      {/* ZONE B — CRITICAL INSIGHTS */}
      <div className="zone-b">
        <InsightCard type="primary" title="Archetype Overview" severity="blue">
          Through multi-model clustering analysis (K-Means, GMM, etc.), we identified four significant groups within the community. These personas allow us to tailor public health interventions to specific needs rather than using a one-size-fits-all approach.
        </InsightCard>
      </div>

      {/* ZONE C — PERSONA CARDS */}
      <div className="zone-c">
        <div className="chart-grid-2">
          {personas.map((persona) => (
            <ChartPanel
              key={persona.id}
              title={persona.title}
              sectionTag={persona.population + " PEOPLE"}
              severity={persona.severity}
              callout={<span>{persona.subtitle}</span>}
              className="persona-card-wrapper"
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px', background: 'var(--bg-surface-3)', borderRadius: '8px', marginTop: '12px' }}>
                <div className="text-label" style={{ color: `var(--${persona.severity})`, marginBottom: '12px' }}><strong>PROFILE:</strong> {persona.profile}</div>
                <p className="text-body-sm text-secondary" style={{ flex: 1, marginBottom: '24px' }}>
                  {persona.description}
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <span className="text-body-sm" style={{ fontWeight: 600 }}>Focus Strategy: </span>
                  <span className="text-body-sm text-muted">{persona.strategy}</span>
                </div>
              </div>
            </ChartPanel>
          ))}
        </div>
      </div>

    </PageContainer>
  );
};

export default Personas;
