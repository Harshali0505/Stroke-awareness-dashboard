import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";
import InsightCard from "../components/InsightCard";
import KpiCard from "../components/KpiCard";
import { CHART_COLORS } from "../constants/colors";

const Community = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { selected, onSelect } = useChartSelection();

  const { data: sourcesData, loading: sourcesLoading } = useStaticData("/analytics/awareness-sources");
  const { data: sourcesStackedData, loading: sourcesStackedLoading } = useStaticData("/analytics/awareness-sources-stacked");

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
        title="Source of Knowledge"
        description="Mapping where individuals acquire stroke education to optimize public health messaging."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageHeaderMeta={{ sectionTag: 'SECTION 06', severity: 'good', severityLabel: 'ACTIONABLE' }}
      >
        <p className="text-body text-muted">Loading community insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Source of Knowledge"
      description="To bridge the dangerous knowledge gap, we must look at where people currently receive their medical information. By pinpointing which sources lead to the highest levels of awareness, health professionals can better target campaigns."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      pageHeaderMeta={{ sectionTag: 'SECTION 06', severity: 'good', severityLabel: 'ACTIONABLE' }}
    >

      {/* ZONE B — 78% KEY CALLOUT */}
      <div className="zone-b">
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--green-bg, #f0fdf4) 0%, var(--bg-surface) 60%)',
          border: '1px solid var(--green-border, #bbf7d0)',
          borderLeft: '5px solid var(--green, #10b981)',
          borderRadius: '16px',
          padding: '28px 32px',
          display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          {/* Big stat */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '64px', fontWeight: 800, color: 'var(--green, #10b981)', lineHeight: 1, letterSpacing: '-0.04em' }}>78%</div>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green, #10b981)', marginTop: '4px', opacity: 0.85 }}>From Healthcare Providers</div>
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--green-border, #bbf7d0)', flexShrink: 0, minHeight: '60px' }} />

          {/* Text */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--green, #10b981)', marginBottom: '6px' }}>
              SOURCE OF KNOWLEDGE · SECTION 06
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Doctors Are the Single Most Effective Source
            </h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              Of highly aware individuals, <strong style={{ color: 'var(--green)' }}>78% received information from healthcare providers</strong>. This shows the critical role of doctors in spreading stroke awareness. Community outreach programs delivered by healthcare professionals have the highest impact on public preparedness.
            </p>
          </div>
        </div>
      </div>

      {/* ZONE C — CHARTS */}
      <div className="zone-c">
        <div className="chart-grid-2">
          <ChartPanel
            title="Stroke knowledge sources"
            sectionTag="06.A"
            severity="blue"
            callout={<span>What is the loudest voice in the room? This graph ranks the top channels where our community actually reports receiving stroke education.</span>}
          >
            <GenericBarChart
              data={sourcesData}
              xKey="source"
              valueKey="percentage"
              layout="vertical"
              height="100%"
              barColor="var(--blue)"
            />
          </ChartPanel>

          <ChartPanel
            title="Source effectiveness"
            sectionTag="06.B"
            severity="amber"
            callout={<span>Notice how some information channels correlate strongly with low awareness, suggesting that the material taught there is ineffective.</span>}
          >
            <StackedAwarenessChart
              data={stackedSourcesList}
              height="100%"
              barSize={20}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>
        </div>

        <div className="chart-grid-1" style={{ marginTop: '24px' }}>
          <ChartPanel
            title="Source Reach vs Effectiveness Scorecard"
            sectionTag="06.C"
            severity="green"
            callout={<span>This table maps exactly which channels produce life-saving understanding compared to those that only build passive familiarity.</span>}
          >
            <div style={{ overflowX: "auto", margin: "16px 0", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-surface-3)", borderBottom: "2px solid var(--border-color)" }}>
                    <th className="text-label" style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>SOURCE</th>
                    <th className="text-label" style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>REACH (% WHO CITED IT)</th>
                    <th className="text-label" style={{ padding: "16px 24px", color: "var(--green)" }}>HIGH AWARENESS RATE</th>
                    <th className="text-label" style={{ padding: "16px 24px", color: "var(--red)" }}>LOW AWARENESS RATE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { source: "Healthcare provider", reach: "30.0%", high: "4.2%", low: "35.7%", rowColor: "rgba(16, 185, 129, 0.05)" },
                    { source: "Media (TV/radio/press)", reach: "24.8%", high: "1.1%", low: "66.4%" },
                    { source: "Educational materials", reach: "15.1%", high: "0.4%", low: "66.8%", rowColor: "rgba(239, 68, 68, 0.03)" },
                    { source: "Family / friends", reach: "10.8%", high: "0.0%", low: "67.4%",  },
                    { source: "Not aware (no source)", reach: "10.1%", high: "0.0%", low: "99.7%" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: row.rowColor || "transparent" }}>
                      <td style={{ padding: "16px 24px", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{row.source}</td>
                      <td style={{ padding: "16px 24px", fontSize: "15px", color: "var(--text-secondary)" }}>{row.reach}</td>
                      <td style={{ padding: "16px 24px", fontSize: "15px", fontWeight: 700, color: "var(--green)" }}>{row.high}</td>
                      <td style={{ padding: "16px 24px", fontSize: "15px", color: "var(--red)" }}>{row.low}</td>
                      <td style={{ padding: "16px 24px", fontSize: "15px", fontWeight: 600, color: "var(--blue)" }}>{row.urgency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartPanel>
        </div>
      </div>

      {/* ZONE D — CAMPAIGN RECOMMENDATIONS */}
      <div className="zone-d-divider text-label">
        ── CAMPAIGN RECOMMENDATIONS ──
      </div>
      <div className="zone-d">
        <div className="grid-3-col">

          {/* TOP PRIORITY */}
          <div className="card-type-3 on-green animate-card" style={{ borderTop: "4px solid var(--green)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{
                background: "var(--green)", color: "#fff",
                fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                borderRadius: "4px", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>TOP PRIORITY</span>
            </div>
            <h3 className="text-heading-2" style={{ color: "var(--green)", margin: "0 0 8px" }}>Clinics &amp; Hospitals</h3>
            <p className="text-body-sm" style={{ color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>
              Stroke awareness materials in waiting rooms, on screens, and delivered by healthcare staff reach the audience most likely to retain the message.
            </p>
          </div>

          {/* 2ND PRIORITY */}
          <div className="card-type-3 on-blue animate-card" style={{ borderTop: "4px solid var(--blue)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{
                background: "var(--blue)", color: "#fff",
                fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                borderRadius: "4px", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>2ND PRIORITY</span>
            </div>
            <h3 className="text-heading-2" style={{ color: "var(--blue)", margin: "0 0 8px" }}>Mass Media — Widest Reach</h3>
            <p className="text-body-sm" style={{ color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>
              Media (TV, radio, press) has the 2nd highest reach at <strong style={{ color: "var(--blue)" }}>24.8%</strong> and the 2nd best high-awareness conversion at <strong style={{ color: "var(--blue)" }}>1.1%</strong>. It's an imperfect but accessible channel — pair it with direct education for lasting impact.
            </p>
          </div>

          {/* NOTE */}
          <div className="card-type-3 on-amber animate-card" style={{ borderTop: "4px solid var(--amber)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{
                background: "var(--amber)", color: "#fff",
                fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                borderRadius: "4px", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>NOTE</span>
            </div>
            <h3 className="text-heading-2" style={{ color: "var(--amber)", margin: "0 0 8px" }}>Family &amp; Friends — Trusted, But Not Effective</h3>
            <p className="text-body-sm" style={{ color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>
              Despite being a trusted social network, family and friends produce <strong style={{ color: "var(--amber)" }}>0.0% high awareness</strong> — worse than any active source. Informal conversations are not a substitute for structured health education.
            </p>
          </div>

        </div>
      </div>

    </PageContainer>
  );
};

export default Community;
