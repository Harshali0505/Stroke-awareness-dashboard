import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import PlaceholderChart from "../components/charts/PlaceholderChart";
import useChartSelection from "../hooks/useChartSelection";
import KeyInsight from "../components/KeyInsight";
import { CHART_COLORS } from "../constants/colors";

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
            <GenericBarChart
              data={sourcesData}
              xKey="source"
              valueKey="percentage"
              layout="vertical"
              height={350}
              barColor={CHART_COLORS.palette[0]}
            />
          </ChartPanel>

          <ChartPanel
            title="Source effectiveness"
            helperText="Notice how some information channels correlate strongly with low awareness, suggesting that the material taught there is ineffective."
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

      <Section title="Source Reach vs Effectiveness">
        <div style={{ marginBottom: "24px" }}>
           <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", marginTop: 0 }}>
             Send people to a doctor — not a brochure.
           </h3>
           <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "15px", margin: 0 }}>
              Not all information sources are equal. Some have immense reach but produce almost no high-awareness knowledge. This table maps exactly which channels produce life-saving understanding compared to those that only build passive familiarity.
           </p>
        </div>

        <div style={{ overflowX: "auto", marginBottom: "32px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "2px solid var(--border-color)" }}>
                <th style={{ padding: "16px 24px", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Source</th>
                <th style={{ padding: "16px 24px", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Reach (% who cited it)</th>
                <th style={{ padding: "16px 24px", fontSize: "13px", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em" }}>High Awareness Rate</th>
                <th style={{ padding: "16px 24px", fontSize: "13px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em" }}>Low Awareness Rate</th>
                <th style={{ padding: "16px 24px", fontSize: "13px", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Urgency Correct</th>
              </tr>
            </thead>
            <tbody>
              {[
                { source: "Healthcare provider", reach: "30.0%", high: "4.2%", low: "35.7%", urgency: "71.3%", rowColor: "rgba(16, 185, 129, 0.05)" },
                { source: "Media (TV/radio/press)", reach: "24.8%", high: "1.1%", low: "66.4%", urgency: "61.9%" },
                { source: "Educational materials", reach: "15.1%", high: "0.4%", low: "66.8%", urgency: "46.7%", rowColor: "rgba(239, 68, 68, 0.03)" },
                { source: "Family / friends", reach: "10.8%", high: "0.0%", low: "67.4%", urgency: "55.9%" },
                { source: "Not aware (no source)", reach: "10.1%", high: "0.0%", low: "99.7%", urgency: "1.4%" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: row.rowColor || "transparent" }}>
                  <td style={{ padding: "16px 24px", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{row.source}</td>
                  <td style={{ padding: "16px 24px", fontSize: "15px", color: "var(--text-secondary)" }}>{row.reach}</td>
                  <td style={{ padding: "16px 24px", fontSize: "15px", fontWeight: 700, color: "#10b981" }}>{row.high}</td>
                  <td style={{ padding: "16px 24px", fontSize: "15px", color: "#ef4444" }}>{row.low}</td>
                  <td style={{ padding: "16px 24px", fontSize: "15px", fontWeight: 600, color: "#3b82f6" }}>{row.urgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
          <KeyInsight>
            <strong>Healthcare provider is the only source that meaningfully works:</strong> 4.2% high awareness — nearly 4× the overall rate of 1.6%. Also 71.3% urgency awareness from this group. Doctor-delivered education is clearly the highest-leverage intervention channel. Only 30% of respondents currently benefit from it.
          </KeyInsight>

          <KeyInsight>
            <strong>Brochures and websites are nearly useless:</strong> Educational materials produced only 0.4% high awareness — the worst active source, and also the lowest urgency awareness (46.7%). This directly challenges the standard public health approach of leaflet and website campaigns.
          </KeyInsight>

          <KeyInsight>
            <strong>Media reaches the most people but produces familiarity, not knowledge:</strong> 24.8% cite media — second most common source. But only 1.1% high awareness results. TV and radio create name recognition of "stroke" without building understanding of symptoms, risk factors, or emergency response.
          </KeyInsight>
        </div>
      </Section>

      <Section title="Campaign Recommendations">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "16px" }}>
          
          {/* Card 1 */}
          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", borderTop: "4px solid #10b981", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>1st Priority</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", lineHeight: 1.2 }}>Clinics & hospitals</div>
            <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Stroke awareness materials in waiting rooms, on screens, and delivered by healthcare staff reach the audience most likely to retain the message.</div>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", borderTop: "4px solid #f59e0b", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>2nd Priority</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", lineHeight: 1.2 }}>Trusted community voices</div>
            <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Family and friends are the 2nd most effective channel. Peer education and community workshops can leverage existing trust networks.</div>
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", borderTop: "4px solid #ef4444", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Note</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", lineHeight: 1.2 }}>Mass media alone is not enough</div>
            <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>TV, radio and social media have wide reach but low impact on actual awareness. Pair them with direct education channels for better results.</div>
          </div>

        </div>
      </Section>
    </PageContainer>
  );
};

export default Community;
