import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import HorizontalStackedResponseChart from "../components/charts/HorizontalStackedResponseChart";
import GenericBarChart from "../components/charts/GenericBarChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";

const Symptoms = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {

  // =============================
  // Load Data
  // =============================

  const { data: identificationData, loading: loading1 } =
    useStaticData("/analytics/symptom-identification.json");

  const { data: recallFrequency, loading: loading2 } =
    useStaticData("/analytics/symptom-recall-frequency.json");

  const { data: recallDepth, loading: loading3 } =
    useStaticData("/analytics/symptom-recall-depth.json");

  const loading = loading1 || loading2 || loading3;

  // =============================
  // Transform Recognition Data
  // =============================

  const recognitionChartData = React.useMemo(() => {
    if (!identificationData) return [];

    const grouped = {};

    identificationData.forEach((item) => {
      if (!grouped[item.symptom]) {
        grouped[item.symptom] = {
          name: item.symptom,
          total: item.total
        };
      }

      grouped[item.symptom][item.response] = item.percentage;
      grouped[item.symptom][`${item.response}__count`] = item.count;
    });

    return Object.values(grouped);
  }, [identificationData]);

  // =============================
  // Transform Recall Frequency
  // =============================

  const recallFrequencyData = React.useMemo(() => {
    if (!recallFrequency) return [];

    return recallFrequency.map(item => ({
      name: item.symptom.replace(/_/g, " "),
      percentage: item.percentage
    }));
  }, [recallFrequency]);

  // =============================
  // Transform Recall Depth
  // =============================

  const recallDepthData = React.useMemo(() => {
    if (!recallDepth) return [];

    return recallDepth.map(item => ({
      name: item.symptom_count,
      percentage: item.percentage
    }));
  }, [recallDepth]);

  if (loading) {
    return (
      <PageContainer
        title="Symptom awareness"
        description="Recognition and recall of stroke warning signs."
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      >
        <p>Loading symptom insights...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Symptom awareness"
      description="Recognition and recall of stroke warning signs."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >

      {/* ================================================== */}
      {/* 1️⃣ Recognition Section */}
      {/* ================================================== */}

      <Section title="Recognition of Stroke Symptoms (Prompted Questions)">
        <ChartPanel title={null}>
          <HorizontalStackedResponseChart
            data={recognitionChartData}
            highlightLabels={["Sudden nosebleed"]}
          />
        </ChartPanel>

        <div style={{ marginTop: "24px", maxWidth: "900px" }}>
          <div style={{ borderLeft: "4px solid #0F766E", paddingLeft: "14px" }}>
            <p style={{ fontSize: "15px", lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
              Most participants selected “Yes” when stroke symptoms were presented as options.
              However, agreement was also high for nosebleed, indicating possible confusion
              about actual stroke warning signs.
            </p>
          </div>
        </div>
      </Section>

      {/* ================================================== */}
      {/* 2️⃣ Recall Frequency */}
      {/* ================================================== */}

      <Section
        title="Which Stroke Symptoms Do People Recall?"
        description="This chart shows which stroke warning signs participants recalled without being given options."
      >
        <ChartPanel title={null}>
          <GenericBarChart
            data={recallFrequencyData}
            xKey="percentage"
            yKey="name"
            layout="vertical"
            width={800}
            height={450}
          />
        </ChartPanel>

        <div style={{ marginTop: "24px", maxWidth: "900px" }}>
          <div style={{ borderLeft: "4px solid #0F766E", paddingLeft: "14px" }}>
            <p style={{ fontSize: "15px", lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
              Motor weakness and speech problems were among the most frequently recalled symptoms.
              However, fewer participants mentioned other important warning signs,
              indicating gaps in detailed awareness.
            </p>
          </div>
        </div>
      </Section>

      {/* ================================================== */}
      {/* 3️⃣ Depth of Recall */}
      {/* ================================================== */}

      <Section
        title="How Many Stroke Symptoms Can Participants Recall?"
        description="This chart shows how many symptoms each participant identified in the open-ended question."
      >
        <ChartPanel title={null}>
          <GenericBarChart
            data={recallDepthData}
            xKey="name"
            valueKey="percentage"
            width={800}
            height={400}
          />
        </ChartPanel>

        <div style={{ marginTop: "24px", maxWidth: "900px" }}>
          <div style={{ borderLeft: "4px solid #0F766E", paddingLeft: "14px" }}>
            <p style={{ fontSize: "15px", lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
              A considerable proportion of participants recalled only one or two symptoms,
              and many could not recall any. Only a smaller group identified four or more symptoms,
              suggesting that in-depth knowledge of stroke warning signs remains limited.
            </p>
          </div>
        </div>
      </Section>

      {/* ================================================== */}
      {/* 4️⃣ Final Summary */}
      {/* ================================================== */}

      <div style={{ marginTop: "40px", maxWidth: "900px" }}>
        <div style={{ borderLeft: "4px solid #0F766E", paddingLeft: "14px" }}>
          <p style={{ fontSize: "16px", lineHeight: 1.8, fontWeight: 600, margin: 0 }}>
            While many participants recognize stroke symptoms when shown options,
            recall-based analysis shows that detailed and independent knowledge remains limited.
          </p>
        </div>
      </div>

    </PageContainer>
  );
};

export default Symptoms;