import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";

const Lifestyle = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // 🔹 Shared selection across all charts
  const { selected, onSelect } = useChartSelection();

  // 🔹 Data sources
  const { data: smokingData, loading: smokingLoading } =
    useStaticData("/analytics/smoking-awareness.json");

  const { data: alcoholData, loading: alcoholLoading } =
    useStaticData("/analytics/alcohol_consumption-awareness.json");

  const { data: activityData, loading: activityLoading } =
    useStaticData("/analytics/regular_physical_activity-awareness.json");

  const { data: bmiAwarenessData, loading: bmiAwarenessLoading } =
    useStaticData("/analytics/bmi-awareness.json");

  const { data: medicalData, loading: medicalLoading } =
    useStaticData("/analytics/medical-history-awareness.json");

  // 🔹 Transform row-based JSON → stacked chart format
  const transformToStacked = (data, groupKey) => {
    if (!data || !Array.isArray(data)) return [];

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

  // 🔹 Memoized stacked datasets
  const stackedSmokingData = React.useMemo(
    () => transformToStacked(smokingData, "smoking"),
    [smokingData]
  );

  const stackedAlcoholData = React.useMemo(
    () => transformToStacked(alcoholData, "alcohol_consumption"),
    [alcoholData]
  );

  const stackedActivityData = React.useMemo(
    () => transformToStacked(activityData, "regular_physical_activity"),
    [activityData]
  );

  const stackedBmiData = React.useMemo(
    () => transformToStacked(bmiAwarenessData, "range"),
    [bmiAwarenessData]
  );

  const stackedMedicalData = React.useMemo(
    () => transformToStacked(medicalData, "medical_history"),
    [medicalData]
  );

  // 🔹 Loading state
  if (
    smokingLoading ||
    alcoholLoading ||
    activityLoading ||
    bmiAwarenessLoading ||
    medicalLoading
  ) {
    return (
      <PageContainer
        title="Lifestyle & health risk"
        description="Lifestyle habits and underlying health conditions associated with differences in stroke awareness."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading lifestyle insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Lifestyle & health risk"
      description="Lifestyle habits and underlying health conditions associated with differences in stroke awareness."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section
        title="Lifestyle"
        helperText="Select an awareness category in any chart to highlight it across this page."
      >
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Smoking × awareness level"
            helperText="Non-smokers are the larger group; awareness distribution is similar between smokers and non-smokers."
          >
            <StackedAwarenessChart
              title={null}
              data={stackedSmokingData}
              height={360}
              widthScaling="adaptive"
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>

          <ChartPanel
            title="Alcohol consumption × awareness level"
            helperText="Non-drinkers dominate the sample; drinkers show a slightly higher moderate group in proportion."
          >
            <StackedAwarenessChart
              title={null}
              data={stackedAlcoholData}
              height={360}
              widthScaling="adaptive"
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>

          <ChartPanel
            title="Physical activity × awareness level"
            helperText="Participants reporting no regular activity are more common; awareness mix is comparable across both groups."
            fullWidth
          >
            <StackedAwarenessChart
              title={null}
              data={stackedActivityData}
              height={360}
              widthScaling="adaptive"
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>
        </div>
      </Section>

      <Section title="Body mass index (BMI)">
        <ChartPanel
          title="BMI range × awareness level"
          helperText="Overweight and obese groups contribute most responses; distributions look similar across BMI ranges."
          fullWidth
        >
          <StackedAwarenessChart
            title={null}
            data={stackedBmiData}
            height={360}
            widthScaling="adaptive"
            valueMode="percent"
            selectedCategory={selected}
            onSelectCategory={onSelect}
          />
        </ChartPanel>
      </Section>

      <Section title="Medical history">
        <ChartPanel
          title="Medical history × awareness level"
          helperText="‘Other’ is the largest category; smaller conditions have very low counts so interpret differences cautiously."
          fullWidth
        >
          <StackedAwarenessChart
            title={null}
            data={stackedMedicalData}
            height={360}
            widthScaling="adaptive"
            valueMode="percent"
            selectedCategory={selected}
            onSelectCategory={onSelect}
          />
        </ChartPanel>
      </Section>
    </PageContainer>
  );
};

export default Lifestyle;
