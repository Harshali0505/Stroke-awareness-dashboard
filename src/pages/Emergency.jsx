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
import ActionFunnel from "../components/ActionFunnel";
import { CHART_COLORS } from "../constants/colors";

const SimpleProgressBar = ({ label, percentage, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
    <div style={{ flex: 1, textAlign: "right", fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)", textTransform: "capitalize" }}>
      {label}
    </div>
    <div style={{ width: "120px", height: "8px", backgroundColor: "var(--bg-secondary)", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${Math.max(percentage, 1)}%`, height: "100%", backgroundColor: color, borderRadius: "4px" }} />
    </div>
    <div style={{ width: "45px", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
      {typeof percentage === 'number' ? percentage.toFixed(1) : percentage}%
    </div>
  </div>
);

const Emergency = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { selected, onSelect } = useChartSelection();

  const { data: firstActionData, loading: firstActionLoading } =
    useStaticData("/analytics/first-action.json");

  const { data: firstActionAwarenessData, loading: firstActionAwarenessLoading } =
    useStaticData("/analytics/first-action-awareness.json");

  const { data: treatmentData, loading: treatmentLoading } =
    useStaticData("/analytics/time-to-treatment.json");

  const { data: specialistData, loading: specialistLoading } =
    useStaticData("/analytics/specialist-consultation.json");

  const { data: adviceData, loading: adviceLoading } =
    useStaticData("/analytics/advice-given.json");

  const { data: whereToGoData, loading: whereToGoLoading } =
    useStaticData("/analytics/where-to-go.json");

  const { data: howSoonConsultData, loading: howSoonConsultLoading } =
    useStaticData("/analytics/how-soon-consult.json");

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
        description={
          <>
            Time is the most critical factor in stroke survival and recovery. This section evaluates public understanding of emergency protocols, specialist consultation, and the "Golden Hour" window for medical intervention.
          </>
        }
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading emergency response insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Time-Critical Awareness"
      description={
        <>
          Time is the most critical factor in stroke survival and recovery. This section evaluates public understanding of emergency protocols, specialist consultation, and the "Golden Hour" window for medical intervention.
        </>
      }
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="The Golden Hour: Why Every Second Counts">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Stroke outcomes are dictated by the "Time is Brain" principle. Reaching a specialized medical facility within the first 60 minutes (the Golden Hour) significantly reduces the risk of long-term disability. This analysis examines whether the community prioritizes immediate hospital-based care over passive or localized responses.
        </p>
      </Section>

      <Section title="The Action Collapse">
        <div style={{ marginBottom: "24px", padding: "24px", backgroundColor: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
           <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", marginTop: 0 }}>
             Most people know something is wrong. Almost none know what to do about it.
           </h3>
           <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "15px", margin: 0 }}>
              Theoretical awareness does not reliably translate to life-saving behavioral action. When faced with an emergency, proper intervention drops off drastically at every decision point.
           </p>

           <div style={{ marginTop: "24px" }}>
             <ActionFunnel />
           </div>
        </div>
      </Section>

      <Section title="Emergency Response Behavior">
        <div className="who-grid who-grid--two" style={{ alignItems: "start" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <ChartPanel
              title="Initial Action Post-Symptom Onset"
              helperText="Distribution of first responses when stroke symptoms are recognized. Non-emergency responses dominate."
            >
              <div style={{ marginTop: "16px", marginBottom: "24px" }}>
                {firstActionData && firstActionData.map((d, i) => (
                  <SimpleProgressBar key={i} label={d.action.replace(/_/g, " ")} percentage={d.percentage} color={CHART_COLORS.palette[0]} />
                ))}
              </div>
              <KeyInsight>
                <strong>74% would not take the correct first action:</strong> Only 26.1% would call emergency services. 22.1% would call family/friends, 20.3% a general doctor, and 22.7% have no idea what to do. In stroke, every minute of delay causes irreversible brain damage.
              </KeyInsight>
            </ChartPanel>

            <ChartPanel
              title="Perceived Time-to-Treatment Urgency"
              helperText="Users were asked how soon they think medical intervention is needed after experiencing stroke symptoms."
            >
              <div style={{ marginTop: "16px", marginBottom: "24px" }}>
                {treatmentData && treatmentData.map((d, i) => (
                  <SimpleProgressBar key={i} label={d.time_category.replace(/_/g, " ")} percentage={d.percentage} color={CHART_COLORS.palette[1]} />
                ))}
              </div>
              <KeyInsight>
                <strong>48.4% don't understand that treatment must be immediate:</strong> While 51.6% correctly say "immediately," 16.8% would wait 2–3 days, 3% would get tests first, and 25.2% gave no response at all. Nearly half the population does not understand stroke urgency.
              </KeyInsight>
            </ChartPanel>
          </div>

          <ChartPanel
            title="First Action by Awareness Profile"
            helperText="Shows that low-awareness individuals tend to rely on doctors or family, while higher awareness directly increases the likelihood of calling emergency services."
            style={{ height: "100%" }}
          >
            <StackedAwarenessChart
              data={stackedFirstActionData}
              height={500}
              barSize={32}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
            <div style={{ marginTop: "24px" }}>
              <KeyInsight>
                <strong>Awareness does drive correct behavior — but barely enough people have it:</strong> Among moderate + high awareness respondents, 88.8% correctly identify urgency. The problem is that only 36.6% of people reach even moderate awareness. Fix the awareness, fix the action.
              </KeyInsight>
            </div>
          </ChartPanel>

        </div>
      </Section>

      <Section title="Behavioral and Awareness Alignment">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Timeline for Specialist Consultation"
            helperText="Any delay beyond 'immediate' represents a failure in emergency recognition. Trends show a dangerous tendency to wait for scheduled consultations rather than ER visits."
          >
            <div style={{ marginTop: "16px", marginBottom: "24px" }}>
               {howSoonConsultData && howSoonConsultData.map((d, i) => (
                 <SimpleProgressBar key={i} label={d.timeframe} percentage={d.percentage} color={CHART_COLORS.palette[2]} />
               ))}
            </div>
            <KeyInsight>
              The tendency to wait for scheduled appointments (40.7% within a day) rather than seeking immediate ER care (only 46.6% immediately) is a major barrier to effective stroke treatment.
            </KeyInsight>
          </ChartPanel>

          <ChartPanel
            title="Specialist Consultation Preferences"
            helperText="Neurologists are the primary specialists for stroke emergencies, yet there is a heavy reliance on general practitioners."
          >
            <div style={{ marginTop: "16px", marginBottom: "24px" }}>
               {specialistData && specialistData.map((d, i) => (
                 <SimpleProgressBar key={i} label={d.specialist.replace(/_/g, ' ')} percentage={d.percentage} color={CHART_COLORS.palette[0]} />
               ))}
            </div>
            <KeyInsight>
              <strong>Only 23.9% recognize the need for a Neurologist.</strong> A massive 61.9% would consult a general Physician first. Treating an acute stroke like a common ailment via a general practitioner introduces catastrophic delays in triage and life-saving thrombolysis.
            </KeyInsight>
          </ChartPanel>
        </div>
      </Section>

      <Section title="Community Guidance Protocols">
        
        {adviceData && (() => {
          const noResponseData = adviceData.find(d => d.advice === "no_response");
          const noResponsePct = noResponseData ? noResponseData.percentage : 59.68;
          
          return (
            <div style={{ backgroundColor: "var(--bg-danger, #fef2f2)", borderLeft: "4px solid var(--border-danger, #ef4444)", padding: "24px", borderRadius: "8px", marginBottom: "32px", display: "flex", alignItems: "center", gap: "32px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: "56px", fontWeight: 800, color: "var(--text-danger, #ef4444)", lineHeight: 1 }}>{noResponsePct}%</div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Of the public would give absolutely no response or advice.</div>
                  <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>When asked what advice they would give during a stroke emergency, 6 out of 10 people drew a complete blank. This silent majority highlights a profound lack of community preparedness and a critical need for standardized protocols (e.g., FAST awareness).</div>
                </div>
            </div>
          );
        })()}

        <div className="who-grid">
            <ChartPanel
            title="What the remaining 40% advise: Actionable vs Vague"
            helperText="Excluding those who gave no response, here is how the actual advice breaks down."
            fullWidth
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "16px", marginBottom: "12px" }}>
              
              {/* Correct Advice Chart */}
              <div style={{ flex: 1, minWidth: "300px", padding: "32px", backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", borderTop: "4px solid #10b981", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                 <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                   <span style={{ fontSize: "20px" }}>✓</span> Actionable & Correct Advice
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                   {adviceData && adviceData.filter(d => ["call_emergency_services", "seek_medical_help", "keep_the_person_calm"].includes(d.advice)).map(d => (
                     <div key={d.advice} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)", textTransform: "capitalize" }}>
                          {d.advice.replace(/_/g, " ")}
                        </div>
                        <div style={{ width: "100px", height: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${Math.max(d.percentage, 2)}%`, height: "100%", backgroundColor: "#10b981", borderRadius: "4px" }} />
                        </div>
                        <div style={{ width: "45px", textAlign: "right", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {d.percentage}%
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Vague Advice Chart */}
              <div style={{ flex: 1, minWidth: "300px", padding: "32px", backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", borderTop: "4px solid #f59e0b", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                 <div style={{ fontSize: "14px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                   <span style={{ fontSize: "20px" }}>!</span> Vague or Dangerous Responses
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                   {adviceData && adviceData.filter(d => !["no_response", "call_emergency_services", "seek_medical_help", "keep_the_person_calm"].includes(d.advice)).map(d => (
                     <div key={d.advice} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)", textTransform: "capitalize" }}>
                          {d.advice.replace(/_/g, " ")}
                        </div>
                        <div style={{ width: "100px", height: "8px", backgroundColor: "rgba(245, 158, 11, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${Math.max(d.percentage, 2)}%`, height: "100%", backgroundColor: "#f59e0b", borderRadius: "4px" }} />
                        </div>
                        <div style={{ width: "45px", textAlign: "right", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {d.percentage}%
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </ChartPanel>
        </div>
      </Section>

      {/* <Section title="Key Analytical Insights">
        <div className="who-kpi-row">
          <ChartPanel
            title="Action-Knowledge Disconnect"
            helperText="Theoretical awareness does not reliably translate to life-saving behavioral intent."
            fullWidth
          >
            <KeyInsight>
              The data suggests that while participants may 'know' what a stroke is, their immediate instinct is often passive. Education must shift from 'definition' to 'deployment' of emergency actions.
            </KeyInsight>
          </ChartPanel>
        </div>
      </Section> */}
    </PageContainer>
  );
};

export default Emergency;
