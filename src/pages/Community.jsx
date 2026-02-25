import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
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
        title="6. Sources of Awareness (Solution Direction)"
        description="If awareness is this low, how are we communicating? By mapping where people currently learn about stroke, we can identify which channels to upgrade."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading community insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="6. Sources of Awareness (Solution Direction)"
      description="Identifying how people learn about stroke to guide future interventions."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Improving awareness campaigns">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          To close the dangerous knowledge gap, we must look at where people currently receive their medical information. By pinpointing which sources lead to the highest levels of awareness—and which sources are simply most popular—health professionals can better target their public awareness campaigns.
        </p>
      </Section>

      <Section title="Where do people learn about stroke?">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Stroke knowledge sources"
            helperText="What is the loudest voice in the room? This graph ranks the top channels where our community actually reports receiving stroke education."
          >
            <GenericBarChart
              data={sourcesData}
              xKey="source"
              valueKey="percentage"
              layout="vertical"
              height={350}
            />
          </ChartPanel>

          <ChartPanel
            title="Source effectiveness"
            helperText="Not all sources are equal. Notice how some information channels correlate strongly with low awareness, suggesting that the material taught there is ineffective."
          >
            <StackedAwarenessChart
              data={stackedSourcesList}
              height={410}
              barSize={20}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Community;
