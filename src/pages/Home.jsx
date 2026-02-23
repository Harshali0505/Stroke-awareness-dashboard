import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import KpiCard from "../components/KpiCard";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import GenericPieChart from "../components/charts/GenericPieChart";
import GenericHistogram from "../components/charts/GenericHistogram";

const Home = () => {
  const { data: kpiData, loading: kpiLoading } =
    useStaticData("/analytics/home-analytics.json");

  const { data: awarenessData, loading: pieLoading } =
    useStaticData("/analytics/overall-awareness.json");

  const { data: scoreData, loading: scoreLoading } =
    useStaticData("/analytics/awareness-score-distribution.json");

  if (kpiLoading || pieLoading || scoreLoading) {
    return (
      <PageContainer
        title="Stroke Awareness Dashboard"
        description="Analytical overview of stroke awareness levels in the community to support targeted public health action."
      >
        <p>Loading dashboard data...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Stroke Awareness Dashboard"
      description="Analytical overview of stroke awareness levels in the community to support targeted public health action."
    >
      <Section title="Key indicators">
        <div className="who-kpi-row">
          <KpiCard
            title="Total Participants"
            value={kpiData.totalRespondents}
          />

          <KpiCard
            title="Average Awareness Score"
            value={kpiData.avgAwarenessScore}
          />

          <KpiCard
            title="Low Awareness"
            value={`${awarenessData[0].percentage}%`}
            subtitle="Participants with low awareness"
          />

          <KpiCard
            title="High Awareness"
            value={`${awarenessData[2].percentage}%`}
            subtitle="Participants with high awareness"
          />
        </div>
      </Section>

      <Section title="Distributions">
        <div className="who-grid who-grid--two">
          <ChartPanel title="Awareness category distribution">
            <GenericPieChart
              data={awarenessData}
              labelKey="label"
              valueKey="percentage"
              countkey="count"
              innerRadius={70}
            />
          </ChartPanel>

          <ChartPanel title="Awareness score distribution">
            <GenericHistogram
              data={scoreData}
              xKey="score"
              valueKey="count"
              width={600}
              height={300}
            />
          </ChartPanel>
        </div>
      </Section>

      <Section title="Interpretation">
        <ChartPanel fullWidth>
          <div style={{ width: '100%' }}>
            <p style={{ margin: 0 }}>
              A significant proportion of respondents fall under the low awareness
              category, indicating a clear need for targeted stroke education and
              community-level awareness programs.
            </p>
          </div>
        </ChartPanel>
      </Section>
    </PageContainer>
  );
};

export default Home;
