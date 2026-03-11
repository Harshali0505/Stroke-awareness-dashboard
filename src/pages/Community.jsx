import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import PlaceholderChart from "../components/charts/PlaceholderChart";
import useChartSelection from "../hooks/useChartSelection";

const Community = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { selected, onSelect } = useChartSelection();

  const { data: sourcesData, loading: sourcesLoading } =
    useStaticData("/analytics/awareness-sources.json");

  const { data: sourcesStackedData, loading: sourcesStackedLoading } =
    useStaticData("/analytics/awareness-sources-stacked.json");

  // Format into stacked array for recharts
  const stackedSourcesList = React.useMemo(() => {
    if (!sourcesStackedData || !Array.isArray(sourcesStackedData)) return [];
    const map = {};
    sourcesStackedData.forEach((item) => {
      const group = item.source;
      if (!map[group]) {
        map[group] = { name: group, total: item.total };
      }
      map[group][item.category] = item.percentage;
      map[group][`${item.category}__count`] = item.count;
    });
    return Object.values(map);
  }, [sourcesStackedData]);

  if (sourcesLoading || sourcesStackedLoading) {
    return (
      <PageContainer
        title="Communication Channels & Community Knowledge"
        description="Mapping where individuals acquire stroke education to optimize public health messaging."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading community insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Communication Channels & Community Knowledge"
      description="Mapping where individuals acquire stroke education to optimize public health messaging."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      {/* <Section title="Behavioral Segments (Clustering)">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Through statistical clustering, we identified four distinct behavioral population segments. 
          Understanding these groups reveals crucial behavioral differences.
        </p>

        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Cluster Distribution"
            helperText="% population in each behavioral cluster."
          >
            <PlaceholderChart title="Pie Chart" text="Distribution of the 4 behavioral clusters" height={360} />
          </ChartPanel>

          <ChartPanel
            title="Structural Behavioral Differences"
            helperText="How each cluster scores across Awareness, Lifestyle Risk, Medical Risk, and Action."
          >
            <PlaceholderChart title="Heatmap" text="Rows: Cluster 0, 1, 2, 3 | Columns: Awareness, Lifestyle Risk, Medical Risk, Action" height={360} />
          </ChartPanel>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div className="kpi-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>CLUSTER 0</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '6px' }}>Mixed Behavior Profile</div>
          </div>
          <div className="kpi-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>CLUSTER 1</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '6px' }}>Lifestyle Risk Dominant</div>
          </div>
          <div className="kpi-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>CLUSTER 2</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '6px' }}>Low Awareness / Passive</div>
          </div>
          <div className="kpi-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>CLUSTER 3</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '6px' }}>Aware / High Medical Risk</div>
          </div>
        </div>
      </Section> */}

      <Section title="Improving awareness campaigns">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          To bridge the dangerous knowledge gap, we must look at where people currently receive their medical information. By pinpointing which sources lead to the highest levels of awareness—and which sources are simply most popular—health professionals can better target their public awareness campaigns.
        </p>
      </Section>

      <Section title="Where do people learn about stroke?">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Stroke knowledge sources"
            helperText="What is the loudest voice in the room? This graph ranks the top channels where our community actually reports receiving stroke education."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericBarChart
                data={sourcesData}
                xKey="source"
                valueKey="percentage"
                layout="vertical"
                height={350}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Identifying the most common sources of information helps in tailoring more effective communication strategies for stroke awareness.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel
            title="Source effectiveness"
            helperText="Not all sources are equal. Notice how some information channels correlate strongly with low awareness, suggesting that the material taught there is ineffective."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <StackedAwarenessChart
                data={stackedSourcesList}
                height={410}
                barSize={20}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The effectiveness of information sources varies significantly, with some traditional channels struggling to impart high levels of awareness.
              </p>
            </div>
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Community;
