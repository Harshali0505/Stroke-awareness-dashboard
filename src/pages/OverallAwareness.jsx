import React from 'react';
import PageContainer from '../components/PageContainer';
import { useStaticData } from '../data/useStaticData';
import KpiCard from '../components/KpiCard';
import GenericPieChart from '../components/charts/GenericPieChart';
import GenericHistogram from '../components/charts/GenericHistogram';
import Section from '../components/Section';
import ChartPanel from '../components/ChartPanel';
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

  if (
    kpiLoading ||
    analyticsLoading ||
    scoreLoading ||
    scoreSummaryLoading ||
    knowStrokeLoading
  ) {
    return (
      <PageContainer
        title="1. Overview (The Awareness Problem)"
        description="Establishing context and showing the overall stroke awareness gap among survey participants."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading overview insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="1. Overview (The Awareness Problem)"
      description="Establishing context and showing the overall stroke awareness gap among survey participants."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Key indicators">
        <div className="who-kpi-row">
          <KpiCard
            title="Total Participants"
            value={kpiData?.totalRespondents}
            subtitle="Total survey participants"
          />

          <KpiCard
            title="Low Awareness %"
            value={
              typeof kpiData?.lowPercent === 'number'
                ? `${kpiData.lowPercent}%`
                : '—'
            }
            subtitle="Limited stroke awareness"
          />

          <KpiCard
            title="Medium Awareness %"
            value={
              typeof kpiData?.moderatePercent === 'number'
                ? `${kpiData.moderatePercent}%`
                : '—'
            }
            subtitle="Partial stroke awareness"
          />

          <KpiCard
            title="High Awareness %"
            value={
              typeof kpiData?.highPercent === 'number'
                ? `${kpiData.highPercent}%`
                : '—'
            }
            subtitle="Good stroke awareness"
          />

        </div>
      </Section>

      <Section
        title="Distributions"
        helperText="Hover over a category to see participant count and share."
      >
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Awareness Category Distribution"
            helperText="Share of participants by low, medium, and high awareness."
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
          </ChartPanel>

          <ChartPanel
            title="Self-reported knowledge of stroke"
            helperText="Participants reporting whether they know what a brain stroke is."
          >
            <GenericPieChart
              data={knowStrokeData}
              labelKey="response"
              valueKey="percentage"
              innerRadius={50}
              width={420}
              height={360}
              interaction="hover"
              colors={["#0f766e", "#14b8a6", "#2dd4bf", "#99f6e4"]}
            />
          </ChartPanel>
        </div>
      </Section>

      <Section title="Why stroke awareness is critical?">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Brain stroke is a medical emergency requiring immediate action to prevent long-term disability or death. The data below shows a significant portion of the public lacks baseline knowledge of what a stroke is. This dashboard explores our survey data to identify who is most vulnerable and where awareness campaigns should focus.
        </p>
      </Section>

      <Section title="Explore deeper">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          The following pages break down this data to form a comprehensive view: identifying who needs the most help, how lifestyle choices corelate with awareness, specific public knowledge gaps regarding symptoms, and emergency actions.
        </p>
      </Section>

      <Section title="Key Analytical Insights">
        <div className="who-kpi-row">
          <KpiCard
            title="Warning"
            value="42.5%"
            subtitle="Aware individuals still delay action"
            trend="down"
            icon="🚨"
          />
          <KpiCard
            title="No Link"
            value="Zero"
            subtitle="Awareness vs Lifestyle Risk"
            icon="⚠️"
          />
          <KpiCard
            title="Clusters"
            value="4"
            subtitle="Distinct behavioral population segments identified"
            icon="👥"
          />
        </div>
      </Section>
    </PageContainer>
  );
};

export default OverallAwareness;
