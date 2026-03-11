import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import PlaceholderChart from "../components/charts/PlaceholderChart";
import useChartSelection from "../hooks/useChartSelection";

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
          Stroke outcomes are dictated by the "Time is Brain" principle. Reaching a specialized medical facility within the first 60 minutes that is the Golden Hour significantly reduces the risk of long-term disability. This analysis examines whether the community prioritizes immediate hospital-based care over passive or localized responses.
        </p>
      </Section>

      <Section title="Emergency Response Behavior">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Initial Action Post-Symptom Onset"
            helperText="Distribution of first responses when stroke symptoms are recognized."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericBarChart
                data={firstActionData}
                xKey="action"
                valueKey="percentage"
                width={700}
                height={350}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The data reveals that a significant portion (26.09%) of respondents prioritize emergency hospital care, which is crucial for timely stroke treatment. But the 2nd highest majority of respondents (22.75%) are completely unaware on who they would consult in such a situation. This shows that majority of people who do have awareness know that they should contact emergency services or go to a hospital, but the rest of the people are either unaware or waste their time by consulting a friends/ family.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel
            title="Perceived Time-to-Treatment Urgency"
            helperText="Users were asked how soon they think medical intervention is needed after experiencing stroke symptoms."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericBarChart
                data={treatmentData}
                xKey="time_category"
                valueKey="percentage"
                layout="vertical"
                height={350}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The data reveals a critical misconception: a significant portion of respondents believe medical intervention can be delayed by hours, missing the vital thrombolysis window (the window in which clot-dissolving stroke treatment works best i.e. 4.5 hours).
              </p>
            </div>
          </ChartPanel>
        </div>
      </Section>

      <Section title="Behavioral and Awareness Alignment">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="First Action by Awareness Profile"
            helperText="A concerning paradox exists: even individuals with 'High Awareness' classifications frequently default to non-emergency actions."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <StackedAwarenessChart
                data={stackedFirstActionData}
                height={410}
                barSize={28}
                valueMode="percent"
                selectedCategory={selected}
                onSelectCategory={onSelect}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Even individuals with high awareness scores often fail to prioritize emergency hospital care  showing a gap between knowledge and action. Further analysis of data shows that 42.5% of the high awareness individuals fail to prioritize emergency hospital care.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel
            title="Specialist Consultation Preferences"
            helperText="Neurologists are the primary specialists for stroke; however,  there exists a heavy reliance on general practitioners."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericBarChart
                data={specialistData && specialistData.map(d => ({ ...d, specialist: d.specialist.replace(/_/g, ' ') }))}
                xKey="specialist"
                valueKey="percentage"
                layout="vertical"
                height={350}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The lack of awareness about stroke leads to a heavy reliance on general practitioners instead of neurologists which may delay the treatment. This shows the tendency of people to treat symptoms of stroke as common ailments.
              </p>
            </div>
          </ChartPanel>
        </div>
      </Section>

      <Section title="Community Guidance Protocols">
        <div className="who-grid">
          <ChartPanel
            title="Public Advice for Stroke Emergencies"
            helperText="Respondents were asked for the advice they would give to others in a stroke emergency."
            fullWidth
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericBarChart
                data={adviceData && adviceData.map(item => ({
                  name: item.advice.replace(/_/g, " "),
                  percentage: item.percentage
                }))}
                xKey="name"
                valueKey="percentage"
                layout="vertical"
                height={350}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The high frequency of 'no response' or non-specific advice highlights a critical need for standardized community emergency protocols (e.g., FAST awareness).
              </p>
            </div>
          </ChartPanel>
        </div>
      </Section>

      <Section title="Logistical Readiness">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Preferred Facility for Acute Symptoms"
            helperText="Respondents were asked for the preferred facility to visit in case of acute symptoms."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericBarChart
                data={whereToGoData && whereToGoData.map(item => ({
                  name: item.location.replace(/_/g, " "),
                  percentage: item.percentage
                }))}
                xKey="name"
                valueKey="percentage"
                layout="vertical"
                height={350}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Choosing local clinics over tertiary care centers can introduce fatal delays in receiving advanced diagnostics like CT scans or MRI. Thus, it is important to visit a tertiary care center to save critical time for advanced imaging and treatment.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel
            title="Timeline for Specialist Consultation"
            helperText="Any delay beyond 'immediate' represents a failure in emergency recognition. Trends show a dangerous tendency to wait for scheduled consultations rather than ER visits."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericBarChart
                data={howSoonConsultData}
                xKey="timeframe"
                valueKey="percentage"
                layout="vertical"
                height={350}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The tendency to wait for scheduled appointments rather than seeking immediate ER care is a major barrier to effective stroke treatment.
              </p>
            </div>
          </ChartPanel>
        </div>
      </Section>

      <Section title="Key Analytical Insights">
        <div className="who-kpi-row">
          <ChartPanel
            title="Action-Knowledge Disconnect"
            helperText="Theoretical awareness does not reliably translate to life-saving behavioral intent."
            fullWidth
          >
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              The data suggests that while participants may 'know' what a stroke is, their immediate instinct is often passive. Education must shift from 'definition' to 'deployment' of emergency actions.
            </p>
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Emergency;
