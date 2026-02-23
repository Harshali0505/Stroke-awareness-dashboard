import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import GenericBarChart from "../components/charts/GenericBarChart";
import GenericPieChart from "../components/charts/GenericPieChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";

const Community = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { data: sourcesData, loading: sourcesLoading } =
    useStaticData("/analytics/awareness-sources.json");

  if (sourcesLoading) {
    return (
      <PageContainer
        title="Community awareness"
        description="Where participants learn about stroke and public health information sources."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading community insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Community awareness"
      description="Where participants learn about stroke and public health information sources."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Awareness sources">
        <div className="who-grid who-grid--two">
          <ChartPanel title="Sources of stroke awareness">
            <GenericBarChart
              data={sourcesData}
              xKey="source"
              valueKey="percentage"
              width={700}
              height={350}
            />
          </ChartPanel>

          <ChartPanel title="Distribution">
            <GenericPieChart
              data={sourcesData}
              labelKey="source"
              valueKey="percentage"
              innerRadius={60}
              width={400}
              height={400}
            />
          </ChartPanel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Community;
