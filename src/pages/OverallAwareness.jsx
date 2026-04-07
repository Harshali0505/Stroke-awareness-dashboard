import React from 'react';
import PageContainer from '../components/PageContainer';
import { useStaticData } from '../data/useStaticData';
import KpiCard from '../components/KpiCard';
import GenericPieChart from '../components/charts/GenericPieChart';
import GenericHistogram from '../components/charts/GenericHistogram';
import Section from '../components/Section';
import ChartPanel from '../components/ChartPanel';
import KeyInsight from '../components/KeyInsight';
import GenericBarChart from '../components/charts/GenericBarChart';
import { CHART_COLORS } from '../constants/colors';

const OverallAwareness = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { data: kpiData, loading: kpiLoading } =
    useStaticData('/analytics/home-analytics.json');

  const { data: analyticsData, loading: analyticsLoading } =
    useStaticData("/analytics/overall-awareness.json");

  const { data: scoreData, loading: scoreLoading } =
    useStaticData('/analytics/awareness-score-distribution.json');

  const { data: scoreSummary, loading: scoreSummaryLoading } =
    useStaticData('/analytics/awareness-score-summary.json');

  const { data: knowStrokeData, loading: knowStrokeLoading } =
    useStaticData('/analytics/know-stroke.json');

  const { data: perceptionData, loading: perceptionLoading } =
    useStaticData('/analytics/perception-reality.json');

  const simpleComparisonData = React.useMemo(() => {
    if (!analyticsData || !knowStrokeData) return [];
    
    const actualHigh = analyticsData.find(d => d.label === "High Awareness")?.percentage || 0;
    const perceivedYes = knowStrokeData.find(d => d.response === "Yes")?.percentage || 0;

    return [
      {
        name: "Claimed Knowledge (Said Yes)",
        percentage: perceivedYes
      },
      {
        name: "Demonstrated Knowledge (High Score)",
        percentage: actualHigh
      }
    ];
  }, [analyticsData, knowStrokeData]);

  if (
    kpiLoading ||
    analyticsLoading ||
    scoreLoading ||
    scoreSummaryLoading ||
    knowStrokeLoading ||
    perceptionLoading
  ) {
    return (
      <PageContainer
        title="The Big Picture: Stroke Awareness"
        description={
          <>
            This dashboard presents a consolidated overview of stroke awareness levels across the surveyed population. It highlights overall knowledge distribution, self-reported familiarity, and readiness indicators to establish a baseline understanding.          </>
        }
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading overview insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="The Big Picture: Stroke Awareness"
      description={
        <>
          This dashboard presents a consolidated overview of stroke awareness levels across the surveyed population. It highlights overall knowledge distribution, self-reported familiarity, and readiness indicators to establish a baseline understanding.
        </>
      }
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Key indicators">
        <p style={{
          margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap'
        }}>
          The awareness is judged across factors like knowledge of stroke, risk factors, symptoms, and emergency response. A huge section of the respondents have low awareness about stroke and only a select few have high awareness, indicating substantial room for public health improvement.
        </p>
        <div className="who-kpi-row">
          <KpiCard
            title="Total Participants"
            value={kpiData?.totalRespondents}
            subtitle="Total survey participants"
            severity="neutral"
          />

          <KpiCard
            title="Percentage of people with low awareness"
            value={
              typeof kpiData?.lowPercent === 'number'
                ? `${kpiData.lowPercent}%`
                : '—'
            }
            subtitle="Limited stroke awareness"
            severity="danger"
          />

          <KpiCard
            title="Percentage of people with medium awareness"
            value={
              typeof kpiData?.moderatePercent === 'number'
                ? `${kpiData.moderatePercent}%`
                : '—'
            }
            subtitle="Partial stroke awareness"
            severity="warning"
          />

          <KpiCard
            title="Percentage of people with high awareness"
            value={
              typeof kpiData?.highPercent === 'number'
                ? `${kpiData.highPercent}%`
                : '—'
            }
            subtitle="Good stroke awareness"
            severity="success"
          />

        </div>
      </Section>

      <Section title="Glanceable Summary & Key Insights">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "12px", marginBottom: "32px" }}>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-color)", borderTop: "4px solid #ef4444", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", transition: "all 0.2s ease" }} className="hover-lift">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>THE ACTION GAP</div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-danger, #ef4444)", marginBottom: "12px", lineHeight: 1 }}>42.5%</div>
            <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>of individuals who actually <strong>know what a stroke is</strong> still fail to state they would seek immediate emergency medical help when noticing symptoms.</div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-color)", borderTop: "4px solid #3b82f6", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", transition: "all 0.2s ease" }} className="hover-lift">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>LIFESTYLE CORRELATION</div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#3b82f6", marginBottom: "12px", lineHeight: 1 }}>None</div>
            <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Statistical testing shows total independence. <strong>Healthy and unhealthy individuals</strong> are both equally misinformed about stroke risks and symptoms.</div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-color)", borderTop: "4px solid #10b981", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", transition: "all 0.2s ease" }} className="hover-lift">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>DATA PROFILES</div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#10b981", marginBottom: "12px", lineHeight: 1 }}>4 Segments</div>
            <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Cluster analysis identified exactly four distinct demographic profiles representing how stroke knowledge predictably distributes in the broader public.</div>
          </div>

        </div>
      </Section>

      <Section
        title="Awareness Distribution"
        helperText="Hover over a category to see participant count and share."
      >
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Awareness Category Distribution (Actual)"
            helperText="Share of participants objectively scoring as low, medium, or high awareness."
          >
            <GenericPieChart
              data={analyticsData}
              labelKey="label"
              valueKey="percentage"
              innerRadius={0}
              width={420}
              height={360}
              interaction="hover"
              showOuterLabels={false}
            />
            <br></br>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              This pie chart shows the reality of stroke awareness based on objective scoring across multiple different critical criteria.
            </p>
          </ChartPanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            {perceptionData && perceptionData.distribution && (
              (() => {
                const yesTotal = perceptionData.distribution.filter(d => d.know_stroke === "Yes").reduce((sum, d) => sum + d.count, 0);
                const yesHigh = perceptionData.distribution.find(d => d.know_stroke === "Yes" && d.category === "High Awareness")?.count || 0;
                const yesLowMod = yesTotal - yesHigh;
    
                const total = perceptionData.total_participants;
                const percentSaidYes = ((yesTotal / total) * 100).toFixed(0);
                const percentYesButLowMod = ((yesLowMod / yesTotal) * 100).toFixed(1);
                const percentYesHigh = ((yesHigh / yesTotal) * 100).toFixed(1);
    
                return (
                  <>
                    <KeyInsight>
                      <strong>The Perception–Reality Gap:</strong> {percentSaidYes}% of respondents proudly stated they understood stroke risks. However, when objectively scored, {percentYesButLowMod}% of those confident individuals fell directly into the Low or Moderate awareness categories. People dramatically overestimate how much they know.
                    </KeyInsight>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <KpiCard
                        title="Claimed Awareness"
                        value={`${percentSaidYes}%`}
                        subtitle="claimed they know what a stroke is"
                        severity="neutral"
                      />
                      <KpiCard
                        title="Overestimated Reality"
                        value={`${percentYesButLowMod}%`}
                        subtitle="of those who said 'Yes' failed tests"
                        severity="danger"
                      />
                      <KpiCard
                        title="True Awareness"
                        value={`${percentYesHigh}%`}
                        subtitle="of those who said 'Yes' scored High"
                        severity="success"
                      />
                    </div>
                  </>
                );
              })()
            )}
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default OverallAwareness;
