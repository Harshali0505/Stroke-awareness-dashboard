import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";
import InsightCard from "../components/InsightCard";
import LifestyleComparisonCard from "../components/LifestyleComparisonCard";

const Lifestyle = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { selected, onSelect } = useChartSelection();

  const { data: familyData, loading: familyLoading } = useStaticData("/analytics/family-history-awareness.json");
  const { data: tiaData, loading: tiaLoading } = useStaticData("/analytics/tia-awareness.json");
  const { data: smokingData, loading: smokingLoading } = useStaticData("/analytics/smoking-awareness.json");
  const { data: alcoholData, loading: alcoholLoading } = useStaticData("/analytics/alcohol_consumption-awareness.json");
  const { data: activityData, loading: activityLoading } = useStaticData("/analytics/regular_physical_activity-awareness.json");

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

  const groupedSmokingData = React.useMemo(() => formatGroupedData(smokingData, "smoking", { yes: "Smokers", no: "Non-Smokers" }), [smokingData, formatGroupedData]);
  const groupedAlcoholData = React.useMemo(() => formatGroupedData(alcoholData, "alcohol_consumption", { yes: "Drinkers", no: "Non-Drinkers" }), [alcoholData, formatGroupedData]);
  const groupedActivityData = React.useMemo(() => formatGroupedData(activityData, "regular_physical_activity", { yes: "Active", no: "Inactive" }), [activityData, formatGroupedData]);

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

  const transformToStacked = (data, groupKey) => {
    if (!data || !Array.isArray(data)) return [];
    const map = {};
    data.forEach(item => {
      const group = item[groupKey];
      if (!map[group]) map[group] = { name: group, total: item.total };
      map[group][item.category] = item.percentage;
      map[group][`${item.category}__count`] = item.count;
    });
    return Object.values(map);
  };

  const stackedFamilyData = React.useMemo(() => transformToStacked(familyData, "do_you_have_a_family_history_of_brain_or_heart_stroke,_of_hypertension_or_diabetes_?"), [familyData]);
  const stackedTiaData = React.useMemo(() => transformToStacked(tiaData, "tia"), [tiaData]);

  if (familyLoading || tiaLoading || smokingLoading || alcoholLoading || activityLoading) {
    return (
      <PageContainer
        title="Lifestyle Patterns"
        description="Showing the overlap between stroke risk factors and low awareness."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageHeaderMeta={{ sectionTag: 'SECTION 03', severity: 'moderate', severityLabel: 'MODERATE' }}
      >
        <p className="text-body text-muted">Loading lifestyle insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Lifestyle Patterns"
      description="Showing the overlap between stroke risk factors and lifestyle choices with low awareness."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      pageHeaderMeta={{ sectionTag: 'SECTION 03', severity: 'moderate', severityLabel: 'MODERATE' }}
    >
      
      {/* ZONE B \u2014 research finding grid */}
      <div className="zone-b">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>

          {/* Finding 1 */}
          <div style={{
            background: 'linear-gradient(135deg, var(--red-bg, #fff1f2) 0%, var(--bg-surface) 100%)',
            border: '1px solid var(--red-border, #fecaca)',
            borderLeft: '4px solid var(--red, #ef4444)',
            borderRadius: '14px', padding: '24px 28px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red, #ef4444)', marginBottom: '6px' }}>
              MEDICAL RISK FACTORS · SECTION 03
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Medical Risk Doesn't Increase Awareness
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              Participants with a <strong>family history of stroke, hypertension, or diabetes</strong>, or personal experience of TIA, show no higher awareness. The distribution remains identical to the general population.
            </p>
          </div>

          {/* Finding 2 */}
          <div style={{
            background: 'linear-gradient(135deg, var(--amber-bg, #fffbeb) 0%, var(--bg-surface) 100%)',
            border: '1px solid var(--amber-border, #fde68a)',
            borderLeft: '4px solid var(--amber, #f59e0b)',
            borderRadius: '14px', padding: '24px 28px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber, #f59e0b)', marginBottom: '6px' }}>
              LIFESTYLE HABITS · SECTION 03
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Zero Lifestyle Correlation With Awareness
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              <strong>Smokers, drinkers, and those with sedentary lifestyles</strong> are just as likely to be underinformed as those with healthier habits. Lifestyle choices do not predict stroke knowledge.
            </p>
          </div>

        </div>
      </div>

      {/* ZONE C: CHARTS */}
      <div className="zone-c">
        <div className="chart-grid-2">
          <ChartPanel
            title="Family History × awareness level"
            sectionTag="03.A"
            severity="amber"
            callout={<span>Individuals with a family history of stroke, hypertension, or diabetes are at a higher risk of stroke, yet their awareness levels are not higher.</span>}
          >
            <StackedAwarenessChart
              data={stackedFamilyData}
              height="100%"
              widthScaling="adaptive"
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>

          <ChartPanel
            title="TIA (Mini-stroke) × awareness level"
            sectionTag="03.B"
            severity="amber"
            callout={<span>Participants who have already experienced a TIA (transient ischemic attack) are at a higher risk of stroke, yet their awareness levels remain low.</span>}
          >
            <StackedAwarenessChart
              data={stackedTiaData}
              height="100%"
              widthScaling="adaptive"
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>
        </div>
      </div>

      {/* ZONE D: SUPPORTING INSIGHTS */}
      <div className="zone-d-divider text-label">
        ── LIFESTYLE HABITS BREAKDOWN ──
      </div>
      <div className="zone-d">
        <div className="grid-3-col" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
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

        
      </div>

    </PageContainer>
  );
};

export default Lifestyle;
