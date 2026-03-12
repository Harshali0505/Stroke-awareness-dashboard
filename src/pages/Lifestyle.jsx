import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import PlaceholderChart from "../components/charts/PlaceholderChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";
import KeyInsight from "../components/KeyInsight";

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

  const { data: familyData, loading: familyLoading } =
    useStaticData("/analytics/family-history-awareness.json");

  const { data: tiaData, loading: tiaLoading } =
    useStaticData("/analytics/tia-awareness.json");

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

  const stackedFamilyData = React.useMemo(
    () => transformToStacked(familyData, "do_you_have_a_family_history_of_brain_or_heart_stroke,_of_hypertension_or_diabetes_?"),
    [familyData]
  );

  const stackedTiaData = React.useMemo(
    () => transformToStacked(tiaData, "tia"),
    [tiaData]
  );

  // 🔹 Loading state
  if (
    smokingLoading ||
    alcoholLoading ||
    activityLoading ||
    bmiAwarenessLoading ||
    familyLoading ||
    tiaLoading
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
      <Section
        title="Lifestyle not a reflection of awareness"
      >
        <p style={{
          margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '1.25rem'
        }}>
          One would expect that individuals with high awareness would display healthier lifestyles, but this is not the case. The data shows that smokers, drinkers, and those with sedentary lifestyles are just as likely to be underinformed as those with healthier habits.
        </p>
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Smoking × awareness level"
            helperText="Smokers are at significantly higher risk for encountering a stroke, yet the data shows their awareness levels are consistently low."
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
            helperText="High alcohol consumption is an indicator for stroke, but drinkers remain trapped within the low awareness boundaries alongside non-drinkers."
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
            helperText="Participants reporting no regular activity are just as frequently underinformed as their exercising counterparts."
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
        <KeyInsight>
          Lifestyle choices such as smoking, alcohol consumption and lack of physical activity are not a reflection of awareness as a majority of respondents fall into the low awareness category regardless of their lifestyle choices. The similarity in the high awareness category for healthy lifestyle and unhealthy lifestyle shows that even after being informed about the risks of having unhealthy lifestyle choices, individuals are not taking action to improve.
        </KeyInsight>
      </Section>
      <Section title="Medical Risks make you aware?">
        <p>One could expect that participants with a family history of stroke, hypertension, or diabetes or personal experience of TIA (mini stroke) would have higher awareness levels, but this is not the case. The distribution remains standard.</p>
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
        <ChartPanel
          title="BMI range × awareness level"
          helperText="Even for severely overweight participants facing greater stroke likelihoods, awareness does not increase. The distribution remains standard."
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
          <KeyInsight>
            The awareness level distribution remains similar across all BMI ranges. This shows that no matter the risk of stroke caused by obesity, awareness does not get impacted.
          </KeyInsight>
        </ChartPanel>
      </Section>

      <Section
        title="Awareness vs Lifestyle Risk"
        helperText="Statistical testing shows no significant association between awareness and lifestyle risk."
      >
        {/* <ChartPanel
          title="Comparison of Lifestyle Risk by Awareness Level"
          helperText="Visual comparison showing High Awareness does not equal better lifestyle habits."
          fullWidth
        >
          <PlaceholderChart title="Grouped Bar Chart" text="X: Awareness Level (High vs Low) | Y: % High Lifestyle Risk" height={380} />
        </ChartPanel> */}
        <div style={{
          marginTop: '16px',
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: '4px solid var(--text-tertiary)',
          fontSize: '15px',
          color: 'var(--text-secondary)'
        }}>
          <strong>Statistical finding:</strong> Testing shows no significant association between awareness and lifestyle risk.
        </div>
      </Section>
    </PageContainer>
  );
};

export default Lifestyle;
