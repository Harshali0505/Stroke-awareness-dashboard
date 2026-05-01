import React, { useEffect } from "react";
import PageContainer from "../components/PageContainer";
import ChartPanel from "../components/ChartPanel";
import InsightCard from "../components/InsightCard";
import { useStaticData } from "../data/useStaticData";

const Personas = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { data: dashboardData, loading } = useStaticData("/analytics/dashboard-stats.json");

  useEffect(() => { document.title = 'Behavioral Personas | BrainLine Dashboard'; }, []);

  if (loading || !dashboardData) {
    return (
      <PageContainer
        title="Behavioral Personas"
        description="Mapping the population into four distinct behavioral archetypes based on awareness, lifestyle risks, and emergency response propensity."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageHeaderMeta={{ sectionTag: 'SECTION 07', severity: 'good', severityLabel: 'ACTIONABLE' }}
      >
        <p className="text-body text-muted">Loading personas...</p>
      </PageContainer>
    );
  }

  const dataPersonas = dashboardData.personas;

  // Existing descriptions and strategies from original file
  const metadata = {
    'cluster-0': {
      description: 'The "Hidden Risk" group. Predominantly older individuals who maintain unhealthy lifestyles and fail to perceive urgency in stroke symptoms. While they may eventually act, their response is often delayed by a lack of awareness.',
      strategy: 'Focus on high-priority medical interventions and targeted community health programs for older adults.',
      metrics: {
        awareness: '3.69',
        urgency: '0.00 (Zero)',
        action: '1.69 (Moderate)',
        risk: '+0.12 (High)',
        cat: '87% Low Awareness'
      }
    },
    'cluster-1': {
      description: 'The "Behavior Gap" segment. These individuals possess high knowledge and feel high urgency, yet they struggle to translate this awareness into healthy lifestyle choices.',
      strategy: 'Shift from information-heavy campaigns to behavioral nudges and lifestyle coaching to bridge the action gap.',
      metrics: {
        awareness: '6.45',
        urgency: '2.00 (Max)',
        action: '1.53 (Moderate)',
        risk: '+0.19 (High)',
        cat: '61% Moderate Awareness'
      }
    },
    'cluster-2': {
      description: 'The "Ideal" benchmark group. Mostly younger individuals who are well-informed, maintain low-risk lifestyles, and are highly responsive to emergency indicators.',
      strategy: 'Leverage this group as digital health advocates and peer-to-peer educators for younger demographics.',
      metrics: {
        awareness: '6.34',
        urgency: '1.88 (High)',
        action: '1.54 (High)',
        risk: '-0.30 (Low)',
        cat: '59% Moderate Awareness'
      }
    },
    'cluster-3': {
      description: 'The "Most Critical" group. This segment exhibits very low awareness across the board, coupled with almost zero perceived urgency or action propensity during stroke events.',
      strategy: 'Immediate, high-intensity public health intervention is required to build foundational awareness from scratch.',
      metrics: {
        awareness: '1.60',
        urgency: '0.06 (Zero)',
        action: '0.48 (Very Low)',
        risk: '-0.09 (Neutral)',
        cat: '99% Low Awareness'
      }
    }
  };

  const personas = dataPersonas.map(p => {
    // Convert cluster-0 -> Cluster 1, cluster-1 -> Cluster 2, etc.
    const clusterNum = parseInt(p.id?.replace('cluster-', ''), 10);
    const displayTitle = !isNaN(clusterNum)
      ? p.title?.replace(/Cluster\s*\d+/, `Cluster ${clusterNum + 1}`)
      : p.title;
    return {
      ...p,
      title: displayTitle,
      description: metadata[p.id]?.description || '',
      strategy: metadata[p.id]?.strategy || '',
      metrics: metadata[p.id]?.metrics || null
    };
  });

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

                {persona.metrics && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '12px', 
                    marginBottom: '24px',
                    padding: '12px',
                    background: 'var(--bg-surface)',
                    borderRadius: '6px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Awareness Score</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{persona.metrics.awareness}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Dominant Cat.</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{persona.metrics.cat}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Urgency Perception</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{persona.metrics.urgency}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Action Propensity</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{persona.metrics.action}</span>
                    </div>
                  </div>
                )}

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
