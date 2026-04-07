import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";
import KeyInsight from "../components/KeyInsight";
import LifestyleComparisonCard from "../components/LifestyleComparisonCard";

const Lifestyle = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // 🔹 Shared selection across all charts
  const { selected, onSelect } = useChartSelection();



  const { data: familyData, loading: familyLoading } =
    useStaticData("/analytics/family-history-awareness.json");

  const { data: tiaData, loading: tiaLoading } =
    useStaticData("/analytics/tia-awareness.json");

  const { data: smokingData, loading: smokingLoading } =
    useStaticData("/analytics/smoking-awareness.json");

  const { data: alcoholData, loading: alcoholLoading } =
    useStaticData("/analytics/alcohol_consumption-awareness.json");

  const { data: activityData, loading: activityLoading } =
    useStaticData("/analytics/regular_physical_activity-awareness.json");

  const formatGroupedData = React.useCallback((data, groupKey, labelMap) => {
    if (!data) return [];
    const grouped = {
      "Low Awareness": {},
      "Moderate Awareness": {},
      "High Awareness": {}
    };
    
    data.forEach(item => {
      if (grouped[item.category]) {
        const key = labelMap[item[groupKey]] || item[groupKey];
        grouped[item.category][key] = item.percentage;
      }
    });

    return [
      { name: "Low Awareness", ...grouped["Low Awareness"] },
      { name: "Moderate Awareness", ...grouped["Moderate Awareness"] },
      { name: "High Awareness", ...grouped["High Awareness"] },
    ];
  }, []);

  const groupedSmokingData = React.useMemo(
    () => formatGroupedData(smokingData, "smoking", { yes: "Smokers", no: "Non-Smokers" }),
    [smokingData, formatGroupedData]
  );
  
  const groupedAlcoholData = React.useMemo(
    () => formatGroupedData(alcoholData, "alcohol_consumption", { yes: "Drinkers", no: "Non-Drinkers" }),
    [alcoholData, formatGroupedData]
  );
  
  const groupedActivityData = React.useMemo(
    () => formatGroupedData(activityData, "regular_physical_activity", { yes: "Active", no: "Inactive" }),
    [activityData, formatGroupedData]
  );

  const formatCardData = React.useCallback((data, mainKey, otherKey) => {
    if (!data || data.length === 0) return { leftData: { low: 0, moderate: 0, high: 0 }, rightData: { low: 0, moderate: 0, high: 0 } };
    return {
      leftData: {
        low: data.find(d => d.name === "Low Awareness")?.[mainKey]?.toFixed(1) || 0,
        moderate: data.find(d => d.name === "Moderate Awareness")?.[mainKey]?.toFixed(1) || 0,
        high: data.find(d => d.name === "High Awareness")?.[mainKey]?.toFixed(1) || 0,
      },
      rightData: {
        low: data.find(d => d.name === "Low Awareness")?.[otherKey]?.toFixed(1) || 0,
        moderate: data.find(d => d.name === "Moderate Awareness")?.[otherKey]?.toFixed(1) || 0,
        high: data.find(d => d.name === "High Awareness")?.[otherKey]?.toFixed(1) || 0,
      }
    };
  }, []);

  const smokingCardData = React.useMemo(() => formatCardData(groupedSmokingData, "Smokers", "Non-Smokers"), [groupedSmokingData, formatCardData]);
  const alcoholCardData = React.useMemo(() => formatCardData(groupedAlcoholData, "Drinkers", "Non-Drinkers"), [groupedAlcoholData, formatCardData]);
  const activityCardData = React.useMemo(() => formatCardData(groupedActivityData, "Inactive", "Active"), [groupedActivityData, formatCardData]);


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




  const stackedFamilyData = React.useMemo(
    () => transformToStacked(familyData, "do_you_have_a_family_history_of_brain_or_heart_stroke,_of_hypertension_or_diabetes_?"),
    [familyData]
  );

  const stackedTiaData = React.useMemo(
    () => transformToStacked(tiaData, "tia"),
    [tiaData]
  );

  if (
    familyLoading ||
    tiaLoading ||
    smokingLoading ||
    alcoholLoading ||
    activityLoading
  ) {
    return (
      <PageContainer
        title="Lifestyle Patterns"
        description="Showing the overlap between stroke risk factors and low awareness."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading lifestyle insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Lifestyle Patterns"
      description="Showing the overlap between stroke risk factors and lifestyle choices with low awareness."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Medical Risks make you aware?">
        <p style={{
          margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '1.25rem'
        }}>One could expect that participants with a family history of stroke, hypertension, or diabetes or personal experience of TIA (mini stroke) would have higher awareness levels, but this is not the case. The distribution remains standard.</p>
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Family History × awareness level"
            helperText="Comparing awareness distribution among participants with a family history of stroke, hypertension, or diabetes."
          >
            <StackedAwarenessChart
              title={null}
              data={stackedFamilyData}
              height={360}
              widthScaling="adaptive"
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
            <KeyInsight>
              Individuals with a family history of stroke, hypertension, or diabetes are at a higher risk of stroke, yet their awareness levels are not higher even after having a case in their family.
            </KeyInsight>
          </ChartPanel>

          <ChartPanel
            title="TIA (Mini-stroke) × awareness level"
            helperText="Looking at awareness distributions of participants who have already experienced a Transient Ischemic Attack (TIA)."
          >
            <StackedAwarenessChart
              title={null}
              data={stackedTiaData}
              height={360}
              widthScaling="adaptive"
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
            <KeyInsight>
              TIA (Transient Ischemic Attack) is a temporary blockage of blood flow to the brain that causes stroke-like symptoms lasting only a few minutes or hours without causing permanent damage. Participants who have already experienced a TIA are at a higher risk of stroke, yet their awareness levels are not higher even after experiencing an attack.
            </KeyInsight>
          </ChartPanel>
        </div>
      </Section>
      <Section title="LIFESTYLE HABITS">
        <p style={{
          margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '1.25rem'
        }}>
          One would expect that individuals with high awareness would display healthier lifestyles, but this is not the case. The data shows that smokers, drinkers, and those with sedentary lifestyles are just as likely to be underinformed as those with healthier habits.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px", marginTop: "16px" }}>
          <LifestyleComparisonCard
            title="Smoking"
            leftTitle="Smokers"
            leftData={smokingCardData.leftData}
            rightTitle="Non-Smokers"
            rightData={smokingCardData.rightData}
          />

          <LifestyleComparisonCard
            title="Alcohol Consumption"
            leftTitle="Drinkers"
            leftData={alcoholCardData.leftData}
            rightTitle="Non-Drinkers"
            rightData={alcoholCardData.rightData}
          />

          <LifestyleComparisonCard
            title="Physical Activity"
            leftTitle="Inactive"
            leftData={activityCardData.leftData}
            rightTitle="Active"
            rightData={activityCardData.rightData}
          />
        </div>

        <div style={{
          marginTop: '16px',
          padding: '16px 24px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: '4px solid var(--text-tertiary)',
          fontSize: '15px',
          color: 'var(--text-secondary)'
        }}>
          <strong>Statistical finding:</strong> The similarity in the low awareness category for healthy lifestyle and unhealthy lifestyle shows that even after being informed about the risks of having unhealthy lifestyle choices, individuals are not translating this into broader stroke awareness.
        </div>
      </Section>
    </PageContainer>
  );
};

export default Lifestyle;
