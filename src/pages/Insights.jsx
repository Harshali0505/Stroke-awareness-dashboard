import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericScatterPlot from "../components/charts/GenericScatterPlot";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";

const Insights = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { data: bmiData, loading: bmiLoading } =
    useStaticData("/analytics/awareness-vs-bmi.json");

  const { data: riskData, loading: riskLoading } =
    useStaticData("/analytics/awareness-vs-risk.json");

  if (bmiLoading || riskLoading) {
    return (
      <PageContainer
        title="Correlational Insights"
        description={
          <>
            This section explores the relationship between stroke awareness and key physiological and risk indicators. Understanding these correlations helps identify if specialized knowledge translates into healthier lifestyle metrics.
          </>
        }
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Correlational Insights"
      description={
        <>
          This section explores the relationship between stroke awareness and key physiological and risk indicators. Understanding these correlations helps identify if specialized knowledge translates into healthier lifestyle metrics.
        </>
      }
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Exploratory Correlations">
        <div className="who-grid who-grid--two">
          <ChartPanel 
            title="Awareness Score vs. BMI"
            helperText="Analyzing whether higher stroke awareness correlates with healthier Body Mass Index (BMI) profiles."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericScatterPlot
                data={bmiData}
                xKey="bmi"
                yKey="awareness_score"
                width={700}
                height={400}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                There is no strong correlation between BMI and awareness scores, suggesting that health knowledge doesn't always translate to physical health metrics.
              </p>
            </div>
          </ChartPanel>

          <ChartPanel 
            title="Awareness vs. Calculated Risk Scores"
            helperText="Correlation between individual awareness levels and their cumulative clinical risk factor scores."
          >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <GenericScatterPlot
                data={riskData}
                xKey="risk_score"
                yKey="awareness_score"
                width={700}
                height={400}
              />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Awareness levels appear fairly independent of clinical risk scores, indicating that even high-risk individuals might lack essential knowledge.
              </p>
            </div>
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Insights;
