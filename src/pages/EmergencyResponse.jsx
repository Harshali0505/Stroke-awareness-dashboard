import React from 'react';
import PageContainer from '../components/PageContainer';
import { useStaticData } from '../data/useStaticData';
import GenericBarChart from '../components/charts/GenericBarChart';
import Section from '../components/Section';
import ChartPanel from '../components/ChartPanel';

const EmergencyResponse = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { data: firstActionData, loading: firstActionLoading } =
    useStaticData("/analytics/first-action.json");

  const { data: treatmentData, loading: treatmentLoading } =
    useStaticData("/analytics/time-to-treatment.json");

  if (firstActionLoading || treatmentLoading) {
    return (
      <PageContainer
        title="Emergency response"
        description="Intended first actions and time-to-treatment awareness following stroke symptoms."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading emergency response insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Emergency response"
      description="Intended first actions and time-to-treatment awareness following stroke symptoms."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
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

          <ChartPanel title="Time-to-treatment awareness">
            <GenericBarChart
              data={treatmentData}
              xKey="time_category"
              valueKey="percentage"
              width={700}
              height={350}
            />
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default EmergencyResponse;
