import React from "react";
import PageContainer from "../components/PageContainer";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";
import InsightCard from "../components/InsightCard";

// Direct import from clustering directory
import dashboardData from '../../../../models/clustering_v2/phase5_outputs/dashboard_stats.json';

const Demographics = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { selected, onSelect } = useChartSelection();

  const ageData = dashboardData.demographics.age;
  const genderData = dashboardData.demographics.gender;
  const educationData = dashboardData.demographics.educational_level;
  const incomeData = dashboardData.demographics.salary;

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

  const transformToStacked = React.useCallback((data, groupKey) => {
    if (!Array.isArray(data)) return [];
    const map = {};
    data.forEach(item => {
      const rawGroup = item[groupKey];
      const group = groupKey === "salary" ? formatSalaryLabel(rawGroup) : rawGroup;
      if (!map[group]) map[group] = { name: group, total: item.total };
      map[group][item.category] = item.percentage;
      map[group][`${item.category}__count`] = item.count;
    });
    return Object.values(map);
  }, [formatSalaryLabel]);

  const stackedAgeData = React.useMemo(() => transformToStacked(ageData, "age"), [ageData, transformToStacked]);
  const stackedGenderData = React.useMemo(() => transformToStacked(genderData, "gender"), [genderData, transformToStacked]);
  
  const stackedEducationData = React.useMemo(() => {
    let data = transformToStacked(educationData, "educational_level");
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


  return (
    <PageContainer
      title="Demographic Awareness Distribution"
      description="Analyzing how background factors like age, gender, and education influence stroke literacy."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      pageHeaderMeta={{ sectionTag: 'SECTION 02', severity: 'moderate', severityLabel: 'MODERATE' }}
    >
      {/* ZONE B — universal finding banner */}
      <div className="zone-b">
        <div style={{
          background: 'linear-gradient(135deg, var(--amber-bg, #fffbeb) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--amber-border, #fde68a)',
          borderLeft: '4px solid var(--amber, #f59e0b)',
          borderRadius: '14px',
          padding: '24px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber, #f59e0b)', marginBottom: '6px' }}>
            DEMOGRAPHIC DISTRIBUTION · SECTION 02
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Universal Lack of Preparedness — No Group Is Safe
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
            The majority of the population lies in the <strong>Low Awareness category irrespective of age, gender, education level, and income</strong>.
            No demographic group is adequately prepared for stroke. The problem is systemic, not selective.
          </p>
        </div>
      </div>

      <div className="zone-c">
        <div className="chart-grid-2">
          {/* Chart 1 */}
          <ChartPanel
            title="Age group × awareness level"
            sectionTag="02.A"
            severity="amber"
            callout={<span>Awareness deficits exist evenly across every single age bracket, showing the problem is widespread. Not a single age group is adequately aware of stroke.</span>}
          >
            <StackedAwarenessChart
              data={stackedAgeData}
              height="100%"
              barSize={22}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>

          {/* Chart 2 */}
          <ChartPanel
            title="Gender × awareness level"
            sectionTag="02.B"
            severity="amber"
            callout={<span>Both males and females reflect a similar distribution. Gender is not a predictive factor of influence for awareness of stroke.</span>}
          >
            <StackedAwarenessChart
              data={stackedGenderData}
              height="100%"
              barSize={28}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>

          {/* Chart 3 */}
          <ChartPanel
            title="Education × awareness level"
            sectionTag="02.C"
            severity="amber"
            callout={<span>Higher education does not correlate strongly with health literacy. The majority of graduates still fall into the lowest awareness bracket.</span>}
          >
            <StackedAwarenessChart
              data={stackedEducationData}
              height="100%"
              barSize={22}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>

          {/* Chart 4 */}
          <ChartPanel
            title="Income × awareness level"
            sectionTag="02.D"
            severity="amber"
            callout={<span>Regardless of reported salary, stroke awareness remains consistently low across all economic groups.</span>}
          >
            <StackedAwarenessChart
              data={stackedIncomeData}
              height="100%"
              barSize={20}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>
        </div>
      </div>
    </PageContainer>
  );
};

export default Demographics;
