import React from "react";
import PageContainer from "../components/PageContainer";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import { FiUsers, FiTarget, FiAlertCircle, FiZap } from "react-icons/fi";
import radarImg from "../assets/radar_clusters.png";
import h1Img from "../assets/h1_awareness_action_bar.png";
import h2Img from "../assets/h2_urgency_risk_violin.png";

const Personas = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const personas = [
    {
      id: 'cluster-0',
      title: 'Cluster 0: The Baseline  1,296',
      subtitle: 'The Knowledgeable & Healthy',
      color: '#2dd4bf',   // Dashboard teal — positive
      icon: <FiUsers />,
      profile: 'High knowledge, low lifestyle risk.',
      description: 'These individuals are well-informed about stroke symptoms and maintain healthy lifestyle habits. They represent the \'ideal\' segment of the population.',
      strategy: 'Engage as community ambassadors to help spread awareness to other segments.'
    },
    {
      id: 'cluster-1',
      title: 'Cluster 1: The Willing -1,504',
      subtitle: 'Uninformed but Proactive',
      color: '#fbbf24',   // Dashboard amber — caution/moderate
      icon: <FiZap />,
      profile: 'Low knowledge, but takes quick action.',
      description: 'They may not know all the medical signs of a stroke, but they have a strong instinct to seek help immediately when something feels wrong. Their gap is purely educational.',
      strategy: 'Provide clear, accessible health literacy materials to bridge their knowledge gap.'
    },
    {
      id: 'cluster-2',
      title: 'Cluster 2: The High-Risk  1,619',
      subtitle: 'Low Awareness & Passive',
      color: '#f87171',   // Dashboard soft-red — alert/low
      icon: <FiAlertCircle />,
      profile: 'The most vulnerable group.',
      description: 'This group combines low awareness with a tendency for slow responses and higher risk behaviors (e.g., smoking, physical inactivity).',
      strategy: 'High-priority target for intensive intervention and community-based health programs.'
    },
    {
      id: 'cluster-3',
      title: 'Cluster 3: The Paradox  1,749',
      subtitle: 'Knowledgeable but Risky',
      color: '#818cf8',   // Indigo — contrasting accent
      icon: <FiTarget />,
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
    >
      <Section title="Archetype Overview">
        <p style={{ margin: "0 0 24px 0", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Through multi-model clustering analysis (K-Means, GMM, etc.), we identified four significant groups within the community. These personas allow us to tailor public health interventions to specific needs.
        </p>
        
        <div className="who-grid who-grid--two">
          {personas.map((persona) => (
            <div 
              key={persona.id}
              className="kpi-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                borderLeft: `6px solid ${persona.color}`,
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {(() => {
                    const t = String(persona.title ?? '');

                    // Extract a trailing population number (e.g. "1,296") even if formatting varies
                    const match = t.match(/(\d[\d,]*)\s*$/);
                    if (!match) {
                      return (
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{t}</h3>
                      );
                    }

                    const populationValue = match[1];
                    const leftRaw = t.slice(0, match.index ?? 0);
                    const left = leftRaw.replace(/[\s\-–—:]*$/, '').trim();
                    const right = populationValue;

                    return (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) auto',
                          columnGap: '14px',
                          alignItems: 'start'
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, minWidth: 0 }}>
                          {left}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.1, paddingTop: '2px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Population</span>
                          <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{right}</span>
                        </div>
                      </div>
                    );
                  })()}
                  <div style={{ color: persona.color, fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{persona.subtitle}</div>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Profile</div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>{persona.profile}</p>
              </div>
              
              <p style={{ margin: "0 0 16px 0", color: "var(--text-secondary)", fontSize: '14px', lineHeight: 1.5 }}>
                {persona.description}
              </p>
              
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Focus Strategy: </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{persona.strategy}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Statistical Validation: Research Diagrams">
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <ChartPanel 
            title="Cluster Characteristics (Radar Profile)"
            helperText="Multi-axis profile showing how each group scores across Awareness, Lifestyle Risk, Medical Risk, and Action propensity."
            fullWidth
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img 
                src={radarImg}
                alt="Radar Clusters Profile" 
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem' }} 
              />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The <strong>Radar Profile</strong> validates our 4-cluster model by showing how each segment occupies a unique space in the behavioral map. Cluster 0 (Baseline) dominates in awareness, while Cluster 2 (High-Risk) consistently lags across all positive metrics. Cluster 3 (The Paradox) shows a significant spike in risk factors despite high awareness.
              </p>
            </div>
          </ChartPanel>

          <div className="who-grid who-grid--two">
            <ChartPanel 
              title="Hypothesis 1: Awareness-Action Gap"
              helperText="Validating how higher awareness scores directly translate to pro-active emergency intent."
            >
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={h1Img}
                  alt="Awareness-Action Gap" 
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }} 
                />
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                  Our research confirms that individuals with <strong>High Awareness</strong> are nearly <strong>2x more likely</strong> to take proactive emergency action compared to low-awareness counterparts.
                </p>
              </div>
            </ChartPanel>

            <ChartPanel 
              title="Hypothesis 2: Risk-Urgency Paradox"
              helperText="Analyzing medical urgency levels among participants with high clinical risk factors."
            >
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={h2Img}
                  alt="Risk-Urgency Paradox" 
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }} 
                />
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                  The <strong>Paradox</strong> (Cluster 3) reveals that high knowledge of symptoms does not always decrease risky lifestyle behaviors, and age remains a major factor in perceived medical urgency.
                </p>
              </div>
            </ChartPanel>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Personas;
