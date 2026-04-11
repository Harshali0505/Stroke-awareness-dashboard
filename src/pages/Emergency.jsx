import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import ChartPanel from "../components/ChartPanel";
import useChartSelection from "../hooks/useChartSelection";
import InsightCard from "../components/InsightCard";
import KpiCard from "../components/KpiCard";
import ActionFunnel from "../components/ActionFunnel";
import { CHART_COLORS } from "../constants/colors";

/* ── Fixed progress bar: labels left-anchored, bars fill naturally ── */
const SimpleProgressBar = ({ label, percentage, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
    <div style={{
      width: "200px", flexShrink: 0,
      fontSize: "13px", fontWeight: 500,
      color: "var(--text-secondary)", textTransform: "capitalize",
      textAlign: "right", lineHeight: 1.3,
    }}>
      {label}
    </div>
    <div style={{ flex: 1, height: "8px", backgroundColor: "var(--bg-surface-3)", borderRadius: "4px", overflow: "hidden", minWidth: "80px" }}>
      <div style={{ width: `${Math.max(percentage, 1)}%`, height: "100%", backgroundColor: color, borderRadius: "4px", transition: "width 0.5s ease" }} />
    </div>
    <div className="text-body-sm" style={{ width: "44px", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "var(--text-primary)" }}>
      {typeof percentage === "number" ? percentage.toFixed(1) : percentage}%
    </div>
  </div>
);

const Emergency = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { selected, onSelect } = useChartSelection();

  const { data: firstActionData, loading: firstActionLoading } = useStaticData("/analytics/first-action.json");
  const { data: firstActionAwarenessData, loading: firstActionAwarenessLoading } = useStaticData("/analytics/first-action-awareness.json");
  const { data: treatmentData, loading: treatmentLoading } = useStaticData("/analytics/time-to-treatment.json");
  const { data: specialistData, loading: specialistLoading } = useStaticData("/analytics/specialist-consultation.json");
  const { data: adviceData, loading: adviceLoading } = useStaticData("/analytics/advice-given.json");
  const { data: whereToGoData, loading: whereToGoLoading } = useStaticData("/analytics/where-to-go.json");
  const { data: howSoonConsultData, loading: howSoonConsultLoading } = useStaticData("/analytics/how-soon-consult.json");

  const stackedFirstActionData = React.useMemo(() => {
    if (!firstActionAwarenessData || !Array.isArray(firstActionAwarenessData)) return [];
    const map = {};
    firstActionAwarenessData.forEach((item) => {
      const group = item.first_contact_after_experiencing_symptom;
      if (!map[group]) {
        map[group] = { name: group, total: item.total };
      }
      map[group][item.category] = item.percentage;
      map[group][`${item.category}__count`] = item.count;
    });
    return Object.values(map);
  }, [firstActionAwarenessData]);

  if (firstActionLoading || treatmentLoading || specialistLoading || firstActionAwarenessLoading || adviceLoading || whereToGoLoading || howSoonConsultLoading) {
    return (
      <PageContainer
        title="Time-Critical Awareness"
        description="Time is the most critical factor in stroke survival and recovery. This section evaluates public understanding of emergency protocols."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageHeaderMeta={{ sectionTag: 'SECTION 05', severity: 'critical', severityLabel: 'CRITICAL' }}
      >
        <p className="text-body text-muted">Loading emergency insights...</p>
      </PageContainer>
    );
  }

  const noResponseData = adviceData?.find(d => d.advice === "no_response");
  const noResponsePct = noResponseData ? noResponseData.percentage : 59.68;

  return (
    <PageContainer
      title="Time-Critical Awareness"
      description="Time is the most critical factor in stroke survival and recovery. This section evaluates public understanding of emergency protocols, specialist consultation, and the 'Golden Hour' window."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      pageHeaderMeta={{ sectionTag: 'SECTION 05', severity: 'critical', severityLabel: 'CRITICAL' }}
    >

      {/* ZONE B — CRITICAL INSIGHTS */}
      <div className="zone-b">
        <div className="grid-3-col" style={{ marginBottom: "24px" }}>
           <KpiCard topLabel="WRONG FIRST ACTION" value="74%" subtitle="Would not take correct first action" severity="red" />
           <KpiCard topLabel="CORRECT RESPONSE" value="26.1%" subtitle="Would call emergency services" severity="red" />
           <KpiCard topLabel="CORRECT ADVICE" value="29.0%" subtitle="Gave actionable correct advice (seek help / call emergency / keep calm)" severity="red" />
        </div>
        <div style={{
          background: 'linear-gradient(135deg, var(--red-bg, #fff1f2) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--red-border, #fecaca)',
          borderLeft: '4px solid var(--red, #ef4444)',
          borderRadius: '14px',
          padding: '22px 28px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            The Action Collapse — Awareness Does Not Equal Response
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
            Most people know <em>something is wrong</em>. Almost none know <strong>what to do about it</strong>. Proper intervention drops off drastically at every decision point — theoretical awareness does not translate to life-saving action.
          </p>
        </div>
      </div>

      {/* ZONE C — CHARTS */}
      <div className="zone-c">

        {/* ══════════════════════════════════════════════════════
            SECTION: ACTION & URGENCY AWARENESS
            ══════════════════════════════════════════════════════ */}
        <div className="zone-d-divider text-label" style={{ marginBottom: '20px' }}>
          ── ACTION &amp; URGENCY AWARENESS ──
        </div>

        {/* 05.A — Action Funnel: first chart — the big picture */}
        <div className="chart-grid-1" style={{ marginBottom: '20px' }}>
          <ChartPanel
            title="The Action Collapse Funnel"
            sectionTag="05.A"
            severity="amber"
            noFixedHeight
            callout={<span>Observe how theoretical knowledge severely decays at every action touchpoint.</span>}
          >
            <div style={{ padding: '16px 0 8px' }}>
              <ActionFunnel />
            </div>
          </ChartPanel>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION: COMMUNITY GUIDANCE
            ══════════════════════════════════════════════════════ */}
        <div className="zone-d-divider text-label" style={{ margin: '36px 0 20px' }}>
          ── COMMUNITY GUIDANCE PROTOCOLS ──
        </div>

        {/* Community Guidance — EYE CATCHING CALLOUT */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--red-bg) 0%, var(--bg-surface) 60%)',
          border: '1px solid var(--red-border)',
          borderLeft: '5px solid var(--red)',
          borderRadius: '16px',
          padding: '28px 32px',
          display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap',
          marginBottom: '16px',
        }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(229,62,62,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          {/* Big stat */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '64px', fontWeight: 800, color: 'var(--red)', lineHeight: 1, letterSpacing: '-0.04em' }}>6/10</div>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginTop: '4px', opacity: 0.8 }}>Drew a Complete Blank</div>
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--red-border)', flexShrink: 0, minHeight: '60px' }} />

          {/* Text */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)' }}>COMMUNITY GUIDANCE PROTOCOLS</span>
            </div>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--red)' }}>{noResponsePct}%</span> of the public would give <strong>absolutely no response or advice</strong>. When asked what advice they would give during a stroke emergency, 6 out of 10 people drew a complete blank. This silent majority highlights a profound lack of community preparedness.
            </p>
          </div>
        </div>

        {/* "What the remaining 40% advise" */}
        <div className="chart-grid-1" style={{ marginBottom: '32px' }}>
          <ChartPanel
            title="What the remaining 40% advise: Actionable vs Vague"
            sectionTag="05.B"
            severity="amber"
            callout={<span>Excluding those who gave no response, here is how the actual advice breaks down.</span>}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "16px" }}>
              {/* Correct Advice */}
              <div className="card-type-3" style={{ flex: 1, minWidth: "280px", borderTop: "4px solid var(--green)" }}>
                <div className="text-label" style={{ color: "var(--green)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>✓</span> ACTIONABLE &amp; CORRECT ADVICE
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {adviceData && adviceData.filter(d => ["call_emergency_services", "seek_medical_help", "keep_the_person_calm"].includes(d.advice)).map(d => (
                    <SimpleProgressBar key={d.advice} label={d.advice.replace(/_/g, " ")} percentage={d.percentage} color="var(--green)" />
                  ))}
                </div>
              </div>

              {/* Vague Advice */}
              <div className="card-type-3" style={{ flex: 1, minWidth: "280px", borderTop: "4px solid var(--amber)" }}>
                <div className="text-label" style={{ color: "var(--amber)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>!</span> VAGUE OR DANGEROUS RESPONSES
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {adviceData && adviceData.filter(d => !["no_response", "call_emergency_services", "seek_medical_help", "keep_the_person_calm"].includes(d.advice)).map(d => (
                    <SimpleProgressBar key={d.advice} label={d.advice.replace(/_/g, " ")} percentage={d.percentage} color="var(--amber)" />
                  ))}
                </div>
              </div>
            </div>
          </ChartPanel>
        </div>


        {/* 05.C + 05.D — Initial Action + Time-to-Treatment, each joined to its insight */}
        <div className="chart-grid-2" style={{ marginBottom: '32px', alignItems: 'stretch' }}>

          {/* LEFT: chart + insight joined */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-type-5 on-red animate-card" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none' }}>
              <div className="t5-header">
                <h2 className="text-heading-1" style={{ margin: 0 }}>Initial Action Post-Symptom Onset</h2>
                <span className="tag-pill text-label">05.C</span>
              </div>
              <div className="card-type-4 on-red text-body">
                <strong>74% would not take the correct first action.</strong> Only 26.1% would call emergency services.
              </div>
              <div className="chart-wrapper" style={{ height: '340px', minHeight: '340px' }}>
                <div style={{ marginTop: '16px', flex: 1 }}>
                  {firstActionData && firstActionData.map((d, i) => (
                    <SimpleProgressBar key={i} label={d.action.replace(/_/g, ' ')} percentage={d.percentage} color="var(--red)" />
                  ))}
                </div>
              </div>
            </div>
            {/* Joined insight */}
            <div className="card-type-2 on-red animate-card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: '1px dashed var(--red-border)', marginTop: 0, boxShadow: 'none' }}>
              <div className="t2-icon"><span style={{ fontSize: '13px' }}>⚡</span></div>
              <h3 className="t2-heading text-heading-2" style={{ marginLeft: '12px' }}>74% Can't Take the Right First Action</h3>
              <div className="t2-body text-body-sm" style={{ marginLeft: '12px' }}>
                Only <span className="highlight-span red">26.1%</span> would call emergency services. <span className="highlight-span red">20.3%</span> call a general doctor, <span className="highlight-span amber">22.1%</span> call family or a friend, and <span className="highlight-span red">22.7%</span> have no idea what to do. In stroke, every minute of delay causes irreversible brain damage.
              </div>
            </div>
          </div>

          {/* RIGHT: chart + insight joined */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-type-5 on-red animate-card" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none' }}>
              <div className="t5-header">
                <h2 className="text-heading-1" style={{ margin: 0 }}>Perceived Time-to-Treatment Urgency</h2>
                <span className="tag-pill text-label">05.D</span>
              </div>
              <div className="card-type-4 on-red text-body">
                Even when action is taken, <span className="highlight-span red">almost half</span> believe they have a day or more to seek treatment.
              </div>
              <div className="chart-wrapper">
                <GenericBarChart
                  data={treatmentData}
                  xKey="time_category"
                  valueKey="percentage"
                  barColor="var(--amber)"
                />
              </div>
            </div>
            {/* Joined insight */}
            <div className="card-type-2 on-red animate-card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: '1px dashed var(--red-border)', marginTop: 0, boxShadow: 'none' }}>
              <div className="t2-icon"><span style={{ fontSize: '13px' }}>⏱</span></div>
              <h3 className="t2-heading text-heading-2" style={{ marginLeft: '12px' }}>48.4% Don't Understand Stroke Urgency</h3>
              <div className="t2-body text-body-sm" style={{ marginLeft: '12px' }}>
                While <span className="highlight-span green">51.6%</span> correctly say 'immediately', <span className="highlight-span red">16.8%</span> would wait 2–3 days, <span className="highlight-span red">3%</span> would get tests first, and <span className="highlight-span red">25.2%</span> gave no response at all. Nearly half the population does not understand stroke urgency.
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION: SPECIALIST & FACILITY PREFERENCE
            ══════════════════════════════════════════════════════ */}
        <div className="zone-d-divider text-label" style={{ margin: '36px 0 20px' }}>
          ── SPECIALIST &amp; FACILITY PREFERENCE ──
        </div>

        {/* 05.E — Preferred Specialist Consultation + joined insight (full width) */}
        <div className="chart-grid-1" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-type-5 on-red animate-card" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none' }}>
              <div className="t5-header">
                <h2 className="text-heading-1" style={{ margin: 0 }}>Preferred Specialist Consultation</h2>
                <span className="tag-pill text-label">05.E</span>
              </div>
              <div className="card-type-4 on-red text-body">
                Only <span className="highlight-span red">23.9%</span> recognise the need for a Neurologist. A massive <span className="highlight-span red">61.9%</span> would consult a general Physician first.
              </div>
              <div className="chart-wrapper" style={{ height: '280px', minHeight: '280px' }}>
                <div style={{ marginTop: '16px' }}>
                  {specialistData && specialistData.map((d, i) => (
                    <SimpleProgressBar key={i} label={d.specialist.replace(/_/g, ' ')} percentage={d.percentage} color="var(--blue)" />
                  ))}
                </div>
              </div>
            </div>
            {/* Joined insight */}
            <div className="card-type-2 on-red animate-card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: '1px dashed var(--red-border)', marginTop: 0, boxShadow: 'none' }}>
              <div className="t2-icon"><span style={{ fontSize: '13px' }}>🧠</span></div>
              <h3 className="t2-heading text-heading-2" style={{ marginLeft: '12px' }}>Only 23.9% Know a Neurologist Is Needed</h3>
              <div className="t2-body text-body-sm" style={{ marginLeft: '12px' }}>
                A massive <span className="highlight-span red">81.8%</span> would consult a general Physician first. Treating an acute stroke like a common ailment at a general practitioner substantially obstructs damage triage and life-saving intervention.
              </div>
            </div>
          </div>
        </div>

      </div>

    </PageContainer>
  );
};

export default Emergency;
