import React from 'react';
import PageContainer from '../components/PageContainer';
import { useStaticData } from '../data/useStaticData';
import KpiCard from '../components/KpiCard';
import GenericPieChart from '../components/charts/GenericPieChart';
import Section from '../components/Section';
import ChartPanel from '../components/ChartPanel';
import InsightCard from '../components/InsightCard';

const OverallAwareness = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { data: kpiData, loading: kpiLoading } =
    useStaticData('/analytics/home-analytics.json');

  const { data: analyticsData, loading: analyticsLoading } =
    useStaticData("/analytics/overall-awareness.json");

  const { data: perceptionData, loading: perceptionLoading } =
    useStaticData('/analytics/perception-reality.json');

  if (kpiLoading || analyticsLoading || perceptionLoading) {
    return (
      <PageContainer
        title="The Big Picture: Stroke Awareness"
        description="This dashboard presents a consolidated overview of stroke awareness levels across the surveyed population."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageHeaderMeta={{ sectionTag: 'SECTION 01', severity: 'critical', severityLabel: 'CRITICAL' }}
      >
        <p className="text-body text-muted">Loading overview insights...</p>
      </PageContainer>
    );
  }

  // Pre-calculate perception reality numbers
  let percentSaidYes = '63';
  let percentYesButLowMod = '97.4';
  let percentYesHigh = '2.6';
  
  if (perceptionData && perceptionData.distribution) {
    const yesTotal = perceptionData.distribution.filter(d => d.know_stroke === "Yes").reduce((sum, d) => sum + d.count, 0);
    const yesHigh = perceptionData.distribution.find(d => d.know_stroke === "Yes" && d.category === "High Awareness")?.count || 0;
    const yesLowMod = yesTotal - yesHigh;

    const total = perceptionData.total_participants;
    if (yesTotal > 0 && total > 0) {
      percentSaidYes = ((yesTotal / total) * 100).toFixed(0);
      percentYesButLowMod = ((yesLowMod / yesTotal) * 100).toFixed(1);
      percentYesHigh = ((yesHigh / yesTotal) * 100).toFixed(1);
    }
  }

  return (
    <PageContainer
      title="The Big Picture: Stroke Awareness"
      description="This dashboard presents a consolidated overview of stroke awareness levels across the surveyed population. It highlights overall knowledge distribution, self-reported familiarity, and readiness indicators to establish a baseline understanding."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      pageHeaderMeta={{ sectionTag: 'SECTION 01', severity: 'critical', severityLabel: 'CRITICAL' }}
    >
      
      {/* ZERO B + TOP STATS */}
      <div className="zone-b">
        <div className="grid-4-col" style={{ marginBottom: '24px' }}>
          <KpiCard
            topLabel="TOTAL PARTICIPANTS"
            value={kpiData?.totalRespondents?.toLocaleString() || "6,168"}
            subtitle="Total surveyed population"
            severity="blue"
          />
          <KpiCard
            topLabel="CRITICAL · LOW AWARENESS"
            value={typeof kpiData?.lowPercent === 'number' ? `${kpiData.lowPercent}%` : '—'}
            subtitle="Limited stroke awareness"
            severity="red"
          />
          <KpiCard
            topLabel="MODERATE AWARENESS"
            value={typeof kpiData?.moderatePercent === 'number' ? `${kpiData.moderatePercent}%` : '—'}
            subtitle="Partial stroke awareness"
            severity="amber"
          />
          <KpiCard
            topLabel="HIGH AWARENESS"
            value={typeof kpiData?.highPercent === 'number' ? `${kpiData.highPercent}%` : '—'}
            subtitle="Good stroke awareness"
            severity="green"
          />
        </div>

        {/* ── PERCEPTION REALITY GAP — EYE CATCHING CALLOUT ── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--red-bg) 0%, var(--bg-surface) 60%)',
          border: '1px solid var(--red-border)',
          borderLeft: '5px solid var(--red)',
          borderRadius: '16px',
          padding: '28px 32px',
          display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap',
        }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(229,62,62,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          {/* Big stat */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '64px', fontWeight: 800, color: 'var(--red)', lineHeight: 1, letterSpacing: '-0.04em' }}>{percentYesButLowMod}%</div>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginTop: '4px', opacity: 0.8 }}>Overestimate Their Knowledge</div>
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--red-border)', flexShrink: 0, minHeight: '60px' }} />

          {/* Text */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)' }}>THE PERCEPTION–REALITY GAP</span>
            </div>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{percentSaidYes}% of respondents</span> proudly stated they understood stroke risks. But when objectively scored, <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--red)' }}>{percentYesButLowMod}%</span> of those confident individuals fell directly into the <strong>Low or Moderate</strong> awareness categories. Only <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--green)', fontWeight: 700 }}>{percentYesHigh}%</span> proved to have actual High Awareness.
            </p>
          </div>
        </div>
      </div>

      {/* ZONE C: CHARTS */}
      <div className="zone-c">
        <div className="chart-grid-1">
          <ChartPanel
            title="Awareness Category Distribution (Actual)"
            sectionTag="01.A"
            severityLabel="INFO"
            severity="blue"
            callout={
              <span>When scored objectively across symptoms, signs, and actions, the majority of the population drops into the <strong>Low</strong> category.</span>
            }
          >
            <GenericPieChart
              data={analyticsData}
              labelKey="label"
              valueKey="percentage"
              innerRadius={0}
            />
          </ChartPanel>
        </div>
      </div>

      {/* ZONE D: SUPPORTING INSIGHTS */}
      <div className="zone-d-divider text-label">
        ── ADDITIONAL FINDINGS ──
      </div>
      <div className="zone-d">
        <div className="grid-3-col">
          <InsightCard type="secondary" title="The Action Gap" severity="amber">
            <span className="highlight-span amber">42.5%</span> of individuals who actually know what a stroke is still fail to state they would seek immediate emergency medical help.
          </InsightCard>
          
          <InsightCard type="secondary" title="Lifestyle Correlation" severity="blue">
            Statistical testing shows total independence. Healthy and unhealthy individuals are both equally misinformed about stroke risks and symptoms.
          </InsightCard>
          
          <InsightCard type="secondary" title="Data Profiles" severity="green">
            Cluster analysis successfully isolated <span className="highlight-span blue">4 segments</span> representing how stroke knowledge predictably distributes in the public.
          </InsightCard>
        </div>
      </div>

    </PageContainer>
  );
};

export default OverallAwareness;
