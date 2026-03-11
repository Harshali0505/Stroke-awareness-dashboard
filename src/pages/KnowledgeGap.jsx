import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import HorizontalStackedResponseChart from "../components/charts/HorizontalStackedResponseChart";
import GenericBarChart from "../components/charts/GenericBarChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import KpiCard from "../components/KpiCard";
import PlaceholderChart from "../components/charts/PlaceholderChart";
import KeyInsight from "../components/KeyInsight";
import { CHART_COLORS } from "../constants/colors";


const KnowledgeGap = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    // Symptom Data
    const { data: identificationData, loading: loading1 } =
        useStaticData("/analytics/symptom-identification.json");
    const { data: recallFrequency, loading: loading2 } =
        useStaticData("/analytics/symptom-recall-frequency.json");
    const { data: symptomDepth, loading: loadingDepthSymptom } =
        useStaticData("/analytics/symptom-recall-depth.json");

    // Risk Data
    const { data: riskIdentification, loading: loading3 } =
        useStaticData("/analytics/risk-identification.json");
    const { data: riskGapData, loading: loading4 } =
        useStaticData("/analytics/risk-gap.json");
    const { data: riskDepth, loading: loadingDepthRisk } =
        useStaticData("/analytics/risk-recall-depth.json");

    const loading = loading1 || loading2 || loading3 || loading4 || loadingDepthSymptom || loadingDepthRisk;

    const recognitionChartData = React.useMemo(() => {
        if (!identificationData) return [];
        const grouped = {};
        identificationData.forEach((item) => {
            if (!grouped[item.symptom]) {
                grouped[item.symptom] = { name: item.symptom, total: item.total };
            }
            grouped[item.symptom][item.response] = item.percentage;
            grouped[item.symptom][`${item.response}__count`] = item.count;
        });
        return Object.values(grouped);
    }, [identificationData]);

    if (loading) {
        return (
            <PageContainer
                title="Knowledge Gaps & Misconceptions"
                description="A stroke dispplays itself in various forms that can be easily missed. These graphs expose the specific blind spots in the public's symptom and risk recognition."
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            >
                <p>Loading knowledge gap insights...</p>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Knowledge Gaps & Misconceptions"
            description="A stroke displays itself in various forms that can be easily missed. These graphs expose the specific blind spots in the public's symptom and risk recognition."
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
        >

            <Section title="Why recognizing symptoms and risks matters">
                <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    Stroke treatment is incredibly time-sensitive as "time is brain". If you don't instantly recognize signs like sudden weakness, speech problems, or vision loss, as symptoms of stroke, you cannot act fast enough. Even worse, many people fail to understand that there exist conditions or lifestyle choices that put them at a higher risk of stroke. The figures below detail exactly where our public knowledge lacks.
                </p>
            </Section>

            <Section title="Failed recognition of symptoms">
                <div className="who-grid">
                    <ChartPanel
                        title="Prompted recognition rate: Can people actually differentiate between stroke symptoms and other conditions?"
                        fullWidth
                    >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <HorizontalStackedResponseChart
                                data={recognitionChartData}
                                highlightLabels={["Sudden nosebleed"]}
                                height={350}
                            />
                            <KeyInsight>
                                This analysis evaluates whether respondents can accurately distinguish stroke symptoms from unrelated conditions. Participants were asked to identify whether specific conditions were symptoms of stroke. While many respondents selected “yes,” incorrect identification of non-symptoms suggests limited understanding of actual stroke indicators, indicating that symptom recognition in real-world situations may be inadequate.
                            </KeyInsight>
                        </div>
                    </ChartPanel>

                </div>

                <div className="who-grid who-grid--two" style={{ marginTop: '24px' }}>
                    <ChartPanel
                        title="Unprompted Symptom Recall Rate (%)"
                    >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <GenericBarChart
                                data={recallFrequency && recallFrequency.filter(item => item.symptom !== "no_recall_or_unclear").map(item => ({
                                    name: item.symptom.replace(/_/g, " "),
                                    percentage: item.percentage
                                }))}
                                xKey="name"
                                valueKey="percentage"
                                layout="vertical"
                                height={300}
                                barColor={CHART_COLORS.palette[0]}
                            />
                            <KeyInsight>
                                When asked to name symptoms , the results are deeply alarming. While vision and speech problems are somewhat known, critical symptoms like devastating headaches or loss of consciousness remain dangerously undocumented in the public mind.
                            </KeyInsight>
                        </div>
                    </ChartPanel>

                    <ChartPanel
                        title="Number of Symptoms Recalled per Person"
                    >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <GenericBarChart
                                data={symptomDepth && symptomDepth.map(item => ({
                                    name: item.symptom_count.toString(),
                                    percentage: item.percentage
                                }))}
                                xKey="name"
                                valueKey="percentage"
                                layout="horizontal"
                                height={300}
                                barColor={CHART_COLORS.palette[1]}
                            />
                            <KeyInsight>
                                A massive portion of the population literally could not name a single symptom without help. Being completely unable to recall symptoms means missing the crucial window for medical intervention.
                            </KeyInsight>
                        </div>
                    </ChartPanel>
                </div>
            </Section>

            <Section title="Risk factors">
                <div className="who-grid who-grid--two">
                    <ChartPanel
                        title="Risk factor identification rate"
                    >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <GenericBarChart
                                data={riskIdentification && riskIdentification.map(item => ({
                                    name: item.risk.replace(/_/g, " "),
                                    percentage: item.percentage
                                }))}
                                xKey="name"
                                valueKey="percentage"
                                layout="vertical"
                                height={380}
                                barColor={CHART_COLORS.palette[0]}
                            />
                            <KeyInsight>
                                If people don't know the risks, they can't prevent the disease. Here we see an alarming percentage of participants failing to link primary drivers like high blood pressure or smoking to stroke likelihood.
                            </KeyInsight>
                        </div>
                    </ChartPanel>

                    <ChartPanel
                        title="Number of Risk Factors Recalled per Person"
                    >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <GenericBarChart
                                data={riskDepth && riskDepth.map(item => ({
                                    name: item.risk_count.toString(),
                                    percentage: item.percentage
                                }))}
                                xKey="name"
                                valueKey="percentage"
                                layout="horizontal"
                                height={380}
                                barColor={CHART_COLORS.palette[1]}
                            />
                            <KeyInsight>
                                Almost no one can rattle off multiple risk factors. This severe lack of recall depth allows dangerous habits to flourish unchecked.
                            </KeyInsight>
                        </div>
                    </ChartPanel>
                </div>
            </Section>

        </PageContainer>
    );
};

export default KnowledgeGap;
