import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";

const Demographics = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // 🔹 Shared selection across all charts
  const { selected, onSelect } = useChartSelection();

  const { data: ageData, loading: ageLoading } =
    useStaticData("/analytics/age-awareness.json");

  const { data: genderData, loading: genderLoading } =
    useStaticData("/analytics/gender-awareness.json");

  const { data: educationData, loading: educationLoading } =
    useStaticData("/analytics/education-awareness.json");

  const { data: incomeData, loading: incomeLoading } =
    useStaticData("/analytics/income-awareness.json");

  const formatSalaryLabel = React.useCallback((value) => {
    const s = String(value ?? "").trim().toLowerCase();
    if (!s) return "Unknown";
    if (s.includes("not_specified") || s.includes("not specified")) return "Not specified";
    if (s.includes("below") && s.includes("2,00,000")) return "< 2L";
    if (s.includes("2,00,001") && s.includes("4,00,000")) return "2–4L";
    if (s.includes("4,00,001") && s.includes("6,00,000")) return "4–6L";
    if (s.includes("6,00,001") && s.includes("8,00,000")) return "6–8L";
    if (s.includes("above") && s.includes("8,00,000")) return "> 8L";
    return String(value);
  }, []);

  // ✅ CORRECT transformer: row-based → stacked format
  const transformToStacked = (data, groupKey) => {
    if (!Array.isArray(data)) return [];

    const map = {};

    data.forEach(item => {
      const rawGroup = item[groupKey];
      const group = groupKey === "salary" ? formatSalaryLabel(rawGroup) : rawGroup;

      // 🔴 REQUIRED for XAxis
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

  const stackedAgeData = React.useMemo(
    () => transformToStacked(ageData, "age"),
    [ageData]
  );

  const stackedGenderData = React.useMemo(
    () => transformToStacked(genderData, "gender"),
    [genderData]
  );

  const stackedEducationData = React.useMemo(
    () => transformToStacked(educationData, "educational_level"),
    [educationData]
  );

  const stackedIncomeData = React.useMemo(
    () => transformToStacked(incomeData, "salary"),
    [incomeData]
  );

  if (ageLoading || genderLoading || educationLoading || incomeLoading) {
    return (
      <PageContainer
        title="Demographic impact"
        description="How stroke awareness varies across age, gender, education, and income groups."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading demographic insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Demographic impact"
      description="Awareness by age, gender, education, and income."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <div className="demographics-page">
        <div className="demographics-overall">
          <Section
            title="Overall insight"
            helperText="Overall, low awareness is common across all demographic groups. This indicates that stroke awareness is a widespread issue and requires broad community-level intervention."
          />
        </div>

        <Section
          title="Awareness by demographic group"
          helperText="Click a category in any chart to highlight it across all breakdowns."
        >
          <div className="who-grid who-grid--two">
            <ChartPanel
              title="Age group × awareness level"
              helperText="Awareness levels are similar across age groups. In every age category, most people fall under low awareness. This shows that stroke awareness needs improvement across all ages, not just a specific group."
            >
              <StackedAwarenessChart
                data={stackedAgeData}
                height={410}
                barSize={22}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
            </ChartPanel>

            <ChartPanel
              title="Gender × awareness level"
              helperText="Both males and females show nearly the same awareness pattern. A majority in both groups have low awareness, indicating that awareness programs should target everyone equally."
            >
              <StackedAwarenessChart
                data={stackedGenderData}
                height={410}
                barSize={28}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
            </ChartPanel>

            <ChartPanel
              title="Education × awareness level"
              helperText="Awareness does not increase significantly with higher education. Even among graduates, low awareness remains common. This suggests that stroke education is not reaching people effectively."
            >
              <StackedAwarenessChart
                data={stackedEducationData}
                height={410}
                barSize={22}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
            </ChartPanel>

            <ChartPanel
              title="Income × awareness level"
              helperText="Stroke awareness remains low across all income groups. Income level alone does not appear to strongly influence awareness levels."
            >
              <StackedAwarenessChart
                data={stackedIncomeData}
                height={410}
                barSize={20}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
            </ChartPanel>
          </div>
        </Section>
      </div>
    </PageContainer>
  );
};

export default Demographics;
