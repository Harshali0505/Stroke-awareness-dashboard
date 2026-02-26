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
        title="5. Emergency Response Awareness"
        description="When a stroke strikes, survival relies entirely upon the correct response. Are people prepared to act with urgency, or are they making fatal mistakes?"
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading emergency response insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="5. Emergency Response Awareness"
      description="When a stroke strikes, survival relies entirely upon the correct response. Are people prepared to act with urgency, or are they making fatal mistakes?"
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      {/* <Section title="Urgency vs Action Mismatch">
        <ChartPanel
          title="Urgency Score vs Action Taken"
          helperText="Shows behavior vs perception mismatch. Higher urgency doesn't always lead to proactive action."
          fullWidth
        >
          <PlaceholderChart title="Scatter Plot" text="X: Urgency Score | Y: Binary Action (0 = Passive, 1 = Proactive)" height={320} />
        </ChartPanel>

        <div style={{ marginTop: '24px' }}>
          <ChartPanel
            title="Distribution of Urgency by Action Type"
            helperText="Do proactive people actually report higher urgency? Comparing the spread of urgency scores."
            fullWidth
          >
            <PlaceholderChart title="Box Plot" text="Compare Urgency Score by Action Type (Passive vs Proactive)" height={320} />
          </ChartPanel>
        </div>
      </Section> */}

      <Section title="The Golden Hour">
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Every single minute matters in a stroke. Getting a clot-busting drug within the first hour of symptom onset drastically determines long-term disability or death. Rushing to a specialized hospital using emergency transport is critical. Reaching out to a general physician, resting, or waiting it out could waste this precious window. How well does our community understand this?
        </p>
      </Section>

      <Section title="Emergency response behaviour">
        <div className="who-grid who-grid--two">
          <ChartPanel title="First action after symptoms">
            <GenericBarChart
              data={firstActionData}
              xKey="action"
              valueKey="percentage"
              width={700}
              height={350}
            />
          </ChartPanel>

          <ChartPanel
            title="Time-to-treatment awareness"
            helperText="Understanding urgency literally saves lives. Unfortunately, a vast portion of the public incorrectly believes they can wait hours, or even days, before seeking professional intervention."
          >
            <GenericBarChart
              data={treatmentData}
              xKey="time_category"
              valueKey="percentage"
              layout="vertical"
              height={350}
            />
          </ChartPanel>
        </div>
      </Section>

      <Section title="Actions and awareness alignment">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="First action × awareness category"
            helperText="This reveals a frightening paradox: even participants classified into the 'High Awareness' category often choose incorrect emergency actions instead of seeking immediate professional help."
          >
            <StackedAwarenessChart
              data={stackedFirstActionData}
              height={410}
              barSize={28}
              valueMode="percent"
              selectedCategory={selected}
              onSelectCategory={onSelect}
            />
          </ChartPanel>

          <ChartPanel
            title="Preferred specialist to consult"
            helperText="If an individual reaches a hospital, does the general public know neurologists are the correct specialists to intervene? General practitioners are heavily relied on, which costs time."
          >
            <GenericBarChart
              data={specialistData && specialistData.map(d => ({ ...d, specialist: d.specialist.replace(/_/g, ' ') }))}
              xKey="specialist"
              valueKey="percentage"
              layout="vertical"
              height={350}
            />
          </ChartPanel>
        </div>
      </Section>

      <Section title="Community Advice">
        <div className="who-grid">
          <ChartPanel
            title="Advice Given for Stroke Symptoms"
            helperText="The massive block of 'no response' proves our community is paralyzed on what advice to give a victim. We must establish a clear protocol."
            fullWidth
          >
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
          </ChartPanel>
        </div>
      </Section>

      <Section title="Consultation Timing and Location Preferences">
        <div className="who-grid who-grid--two">
          <ChartPanel
            title="Where to go after experiencing symptoms"
            helperText="Where you go matters. Opting for a local clinic rather than a well-equipped hospital/medical center means emergency procedures cannot be rapidly initiated."
          >
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
          </ChartPanel>

          <ChartPanel
            title="How soon to consult a specialist"
            helperText="Any delay is a mistake. However, many participants report they would seek specialist consultation, giving the stroke a devastating head start."
          >
            <GenericBarChart
              data={howSoonConsultData}
              xKey="timeframe"
              valueKey="percentage"
              layout="vertical"
              height={350}
            />
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Emergency;
