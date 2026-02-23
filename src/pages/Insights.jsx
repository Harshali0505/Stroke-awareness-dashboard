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
        title="Insights"
        description="Exploratory relationships between awareness scores and key health indicators."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Insights"
      description="Exploratory relationships between awareness scores and key health indicators."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Correlations">
        <div className="who-grid who-grid--two">
          <ChartPanel title="Awareness score vs BMI">
            <GenericScatterPlot
              data={bmiData}
              xKey="bmi"
              yKey="awareness_score"
              width={700}
              height={400}
            />
          </ChartPanel>

          <ChartPanel title="Awareness vs risk factors">
            <GenericScatterPlot
              data={riskData}
              xKey="risk_score"
              yKey="awareness_score"
              width={700}
              height={400}
            />
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Insights;
