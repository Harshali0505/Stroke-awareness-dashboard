import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";

const RiskFactors = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // 🔹 One shared selection state for all charts
  const { selected, onSelect } = useChartSelection();

  const { data: identificationData, loading: identificationLoading } =
    useStaticData("/analytics/risk-identification.json");

  const { data: gapData, loading: gapLoading } =
    useStaticData("/analytics/risk-gap.json");

  const { data: awarenessData, loading: awarenessLoading } =
    useStaticData("/analytics/risk-awareness-category.json");

  // 🔹 Transform row-based data to stacked format
  const transformToStacked = (data, groupKey) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    const map = {};

    data.forEach(item => {
      const group = item[groupKey];
      if (!map[group]) {
        map[group] = { name: group, total: item.total };
      }
      // Use within-group PERCENTAGE for grouped bar height
      map[group][item.category] = item.percentage;
      // Keep raw counts available for tooltip
      map[group][`${item.category}__count`] = item.count;
    });

    return Object.values(map);
  };

  const stackedAwarenessData = React.useMemo(() => 
    transformToStacked(awarenessData, 'risk'), [awarenessData]
  );

  if (identificationLoading || gapLoading || awarenessLoading) {
    return (
      <PageContainer
        title="Risk factor awareness"
        description="Identification of major stroke risk factors and gaps by awareness level."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading risk factor insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Risk factor awareness"
      description="Identification of major stroke risk factors and gaps by awareness level."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section
        title="Identification and gaps"
        helperText="Use chart selection to compare identification and gap patterns across risk factors."
      >
        <div className="who-grid who-grid--two">
          <ChartPanel title="Risk factors identified">
            <GenericBarChart
              data={identificationData}
              xKey="risk"
              valueKey="percentage"
              width={700}
              height={350}
            />
          </ChartPanel>

          <ChartPanel title="Identified vs not identified">
            <GenericBarChart
              data={gapData}
              xKey="risk"
              valueKey="identified_percent"
              selectedValue={selected}
              onSelect={onSelect}
              width={700}
              height={350}
            />
          </ChartPanel>
        </div>
      </Section>

      <Section title="Distribution by awareness level">
        <div className="who-grid who-grid--two">
          <ChartPanel title="Not identified (gap ranking)">
            <GenericBarChart
              data={gapData}
              xKey="risk"
              valueKey="not_identified_percent"
              selectedValue={selected}
              onSelect={onSelect}
              width={700}
              height={350}
            />
          </ChartPanel>

          <ChartPanel title="Risk factor × awareness category">
            <StackedAwarenessChart
              title={null}
              data={stackedAwarenessData}
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

export default RiskFactors;
