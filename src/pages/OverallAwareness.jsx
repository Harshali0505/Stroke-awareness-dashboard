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

  if (
    kpiLoading ||
    analyticsLoading ||
    scoreLoading ||
    scoreSummaryLoading
  ) {
    return (
      <PageContainer
        title="Stroke Awareness Dashboard – Overview"
        description="Overall snapshot of stroke awareness levels and score distribution across survey participants."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading overview insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Stroke Awareness Dashboard – Overview"
      description="Overall snapshot of stroke awareness levels and score distribution across survey participants."
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

          <KpiCard
            title="Average Awareness Score"
            value={
              typeof scoreSummary?.mean === 'number'
                ? scoreSummary.mean
                : kpiData?.avgAwarenessScore
            }
            subtitle="Mean awareness score"
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
            title="Awareness Score Distribution"
            helperText="Distribution of awareness scores (mean and median shown as reference lines)."
          >
            <GenericHistogram
              data={scoreData}
              xKey="score"
              valueKey="count"
              referenceLines={[
                {
                  key: 'mean',
                  x: typeof scoreSummary?.mean === 'number' ? scoreSummary.mean : null,
                  label:
                    typeof scoreSummary?.mean === 'number'
                      ? `Mean = ${scoreSummary.mean}`
                      : null,
                  color: CHART_COLORS.axis
                },
                {
                  key: 'median',
                  x:
                    typeof scoreSummary?.median === 'number'
                      ? scoreSummary.median
                      : null,
                  label:
                    typeof scoreSummary?.median === 'number'
                      ? `Median = ${scoreSummary.median}`
                      : null,
                  color: CHART_COLORS.axis,
                  strokeDasharray: '2 4'
                }
              ].filter((l) => typeof l.x === 'number')}
              width={620}
              height={320}
            />
          </ChartPanel>
        </div>
      </Section>

      <Section title="Methodology note">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Scores are derived from responses on symptoms, risk factors, and emergency actions.
        </p>
      </Section>

      <Section title="Explore deeper">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Next pages break down awareness by demographics, lifestyle, symptoms, and risk factors.
        </p>
      </Section>
    </PageContainer>
  );
};

export default OverallAwareness;
