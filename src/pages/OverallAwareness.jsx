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
        title="The Big Picture: Stroke Awareness"
        description={
          <>
            This section presents a consolidated overview of stroke awareness levels across the surveyed population. It highlights overall knowledge distribution, self-reported familiarity, and readiness indicators to establish a baseline understanding.          </>
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
          This section presents a consolidated overview of stroke awareness levels across the surveyed population. It highlights overall knowledge distribution, self-reported familiarity, and readiness indicators to establish a baseline understanding.
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
          />

          <KpiCard
            title="Percentage of people with low awareness"
            value={
              typeof kpiData?.lowPercent === 'number'
                ? `${kpiData.lowPercent}%`
                : '—'
            }
            subtitle="Limited stroke awareness"
          />

          <KpiCard
            title="Percentage of people with medium awareness"
            value={
              typeof kpiData?.moderatePercent === 'number'
                ? `${kpiData.moderatePercent}%`
                : '—'
            }
            subtitle="Partial stroke awareness"
          />

          <KpiCard
            title="Percentage of people with high awareness"
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
        title="Awareness Distribution"
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
              innerRadius={0}
              width={420}
              height={360}
              interaction="hover"
              showOuterLabels={false}
            />
          </ChartPanel>
        </div>
        <br></br>
        <p style={{
          margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap'
        }}>
          The gap between the percieved awareness and the actual awareness is a cause for concern. It indicates that there is a disconnect between what people know and what they actually understand about stroke. This gap suggests that there is a need for better education and awareness campaigns to bridge this gap and improve public understanding of stroke.
        </p>
      </Section>

      <Section title="Why stroke awareness is critical?">
        <p style={{
          margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap'
        }}>
          Stroke outcomes are highly time-sensitive. Early recognition and immediate medical response significantly improve survival and recovery rates. Awareness directly influences response time, making public knowledge a critical determinant of health outcomes.        </p>
      </Section>

      <Section title="Explore deeper">
        <div style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Subsequent sections examine demographic variation, lifestyle associations, symptom recognition accuracy, and identified knowledge gaps to provide a multidimensional analysis.          <ul>
            <li>the knowledge of stroke with respect to their demographic details</li>
            <li>how awareness and lifestyle choices correlate (if they do at all)</li>
            <li>knowledge gaps with respect to symptoms and risk factors</li>
            <li>awareness and action gap</li>
            <li>what is the source of knowledge</li>
          </ul>
        </div>
      </Section>

      <Section title="Key Analytical Insights">
        <div className="who-kpi-row">
          <KpiCard
            title="Awareness and Action Gap"
            value="42.5%"
            subtitle="of AWARE individuals fail to seek immediate help"
          />
          <KpiCard
            title="Awareness and Lifestyle Correlation"
            value="Independent"
            subtitle="No correlation found"
          />
          <KpiCard
            title="Population Segments"
            value="4"
            subtitle="distinct profiles can be derived from the given data"
          />
        </div>
      </Section>
    </PageContainer>
  );
};

export default OverallAwareness;
