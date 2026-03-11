import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import PlaceholderChart from "../components/charts/PlaceholderChart";
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
  const transformToStacked = React.useCallback((data, groupKey) => {
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
  }, [formatSalaryLabel]);

  const stackedAgeData = React.useMemo(
    () => transformToStacked(ageData, "age"),
    [ageData, transformToStacked]
  );

  const stackedGenderData = React.useMemo(
    () => transformToStacked(genderData, "gender"),
    [genderData, transformToStacked]
  );

  const stackedEducationData = React.useMemo(() => {
    let data = transformToStacked(educationData, "educational_level");
    // Change names for sorting and display
    const renameMap = {
      "high school": "High School",
      "high_school": "High School",
      "undergraduate": "Undergraduate",
      "graduate": "Graduate",
      "speciality": "Speciality",
      "other": "Other"
    };
    data = data.map(item => ({ ...item, name: renameMap[item.name.toLowerCase()] || item.name }));

    const order = ["High School", "Undergraduate", "Graduate", "Speciality", "Other"];
    return data.sort((a, b) => {
      const idxA = order.indexOf(a.name);
      const idxB = order.indexOf(b.name);
      return (idxA > -1 ? idxA : 99) - (idxB > -1 ? idxB : 99);
    });
  }, [educationData, transformToStacked]);

  const stackedIncomeData = React.useMemo(() => {
    const data = transformToStacked(incomeData, "salary");
    const order = ["< 2L", "2–4L", "4–6L", "6–8L", "> 8L", "Not specified"];
    return data.sort((a, b) => {
      const idxA = order.indexOf(a.name);
      const idxB = order.indexOf(b.name);
      return (idxA > -1 ? idxA : 99) - (idxB > -1 ? idxB : 99);
    });
  }, [incomeData, transformToStacked]);

  if (ageLoading || genderLoading || educationLoading || incomeLoading) {
    return (
      <PageContainer
        title="Demographic Awareness Distribution"
        description="Analyzing how background factors like age, gender, and education influence stroke literacy."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading demographic insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Demographic Awareness Distribution"
      description="Analyzing how background factors like age, gender, and education influence stroke literacy."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section
        title="Overview"
        helperText="Majority of the population lies in the low awareness category irrespective of their age, gender, education level and income, showing that no demographic group is adequately prepared."
      />

      <Section
        title="Awareness by demographic group"
        helperText="Click on the buttons 'High', 'Medium' or 'Low' to highlight the population percentage in that category for a graph. Click on reset to view the complete graph."
      >
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Age group × awareness level"
            helperText="Awareness deficits exist evenly across every single age bracket, showing the problem is widespread."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <StackedAwarenessChart
                data={stackedAgeData}
                height={410}
                barSize={22}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The low awareness portion for each age group is seen to be the highest,
                showing that not a single age group is adequately aware of stroke.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel
            title="Gender × awareness level"
            helperText="Both males and females reflect an similar distribution of low, medium, and high awareness."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

              <StackedAwarenessChart
                data={stackedGenderData}
                height={410}
                barSize={28}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The low awareness portion for each gender is seen to be the highest,
                showing that gender is not a factor of influence for awareness of stroke.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel
            title="Education × awareness level"
            helperText="Higher education does not correlate strongly with health literacy. The majority of graduates still fall into the lowest awareness bracket."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

              <StackedAwarenessChart
                data={stackedEducationData}
                height={410}
                barSize={22}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The low awareness portion for each education level is seen to be the highest,
                showing that high education does not account for lack of awareness about stroke.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel
            title="Income × awareness level"
            helperText="Regardless of reported salary, stroke awareness remains consistently low across all economic groups."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

              <StackedAwarenessChart
                data={stackedIncomeData}
                height={410}
                barSize={20}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The low awareness portion for each income level is seen to be the highest,
                showing that even those with higher income do not have a good awareness of stroke.
              </p>
            </div>
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Demographics;
