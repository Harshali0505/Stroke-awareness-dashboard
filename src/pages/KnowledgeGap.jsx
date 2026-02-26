import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import HorizontalStackedResponseChart from "../components/charts/HorizontalStackedResponseChart";
import GenericBarChart from "../components/charts/GenericBarChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import KpiCard from "../components/KpiCard";
import PlaceholderChart from "../components/charts/PlaceholderChart";

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
                title="4. The Dangerous Knowledge Gap"
                description="A stroke can look like a sudden headache or a silent loss of balance. These graphs expose the specific blind spots in the public's symptom and risk recognition."
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            >
                <p>Loading knowledge gap insights...</p>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="4. The Dangerous Knowledge Gap - Symptoms & Risks"
            description="A stroke can look like a sudden headache or a silent loss of balance. These graphs expose the specific blind spots in the public's symptom and risk recognition."
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
        >
            <Section title="The Awareness Paradox">
                <div style={{ marginBottom: '24px' }}>
                    <KpiCard
                        title="The Action Gap"
                        value="42.5%"
                        subtitle="of individuals with high symptom awareness still delay emergency response"
                    />
                </div>

                {/* <div className="who-grid who-grid--two">
                    <ChartPanel
                        title="Action by Symptom Awareness"
                        helperText="Breaking down whether knowing the symptoms actually leads to proactive emergency behavior."
                    >
                        <PlaceholderChart title="Stacked Bar Chart" text="X: Symptom Awareness (High/Low) | Y: Percentage | Split: Passive vs Proactive" height={360} />
                    </ChartPanel>

                    <ChartPanel
                        title="High Awareness Action Gap"
                        helperText="Visualizing the paradox within the high awareness group alone."
                    >
                        <PlaceholderChart title="Donut Chart" text="High Awareness Group Only | 57.5% Proactive vs 42.5% Passive" height={360} />
                    </ChartPanel>
                </div> */}
            </Section>

            <Section title="Why recognizing symptoms and risks matters">
                <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    Stroke treatment is incredibly time-sensitive as "time is brain" If you don't instantly recognize signs like sudden weakness, speech problems, or vision loss, you cannot act. Even worse, many people fail to understand what underlying conditions (risk factors) actively cause them. The figures below detail exactly where our public knowledge dangerously drops off.
                </p>
            </Section>

            <Section title="Failed recognition of symptoms">
                <div className="who-grid">
                    <ChartPanel
                        title="Prompted recognition rate"
                        helperText="Can people spot a symptom if we literally spell it out for them? Sadly, notice how many respondents incorrectly guessed 'Yes' on completely unrelated distractors like a 'Sudden nosebleed'."
                        fullWidth
                    >
                        <HorizontalStackedResponseChart
                            data={recognitionChartData}
                            highlightLabels={["Sudden nosebleed"]}
                            height={350}
                        />
                    </ChartPanel>

                </div>

                <div className="who-grid who-grid--two" style={{ marginTop: '24px' }}>
                    <ChartPanel
                        title="Unprompted Symptom Recall Rate (%)"
                        helperText="When asked to name symptoms , the results are deeply alarming. While vision and speech problems are somewhat known, critical symptoms like devastating headaches or loss of consciousness remain dangerously undocumented in the public mind."
                    >
                        <GenericBarChart
                            data={recallFrequency && recallFrequency.filter(item => item.symptom !== "no_recall_or_unclear").map(item => ({
                                name: item.symptom.replace(/_/g, " "),
                                percentage: item.percentage
                            }))}
                            xKey="name"
                            valueKey="percentage"
                            layout="vertical"
                            height={300}
                        />
                    </ChartPanel>

                    <ChartPanel
                        title="Number of Symptoms Recalled per Person"
                        helperText="A massive portion of the population literally could not name a single symptom without help. Being completely unable to recall symptoms means missing the crucial window for medical intervention."
                    >
                        <GenericBarChart
                            data={symptomDepth && symptomDepth.map(item => ({
                                name: item.symptom_count.toString(),
                                percentage: item.percentage
                            }))}
                            xKey="name"
                            valueKey="percentage"
                            layout="horizontal"
                            height={300}
                        />
                    </ChartPanel>
                </div>
            </Section>

            <Section title="Risk factors">
                <div className="who-grid who-grid--two">
                    <ChartPanel
                        title="Risk factor identification rate"
                        helperText="If people don't know the risks, they can't prevent the disease. Here we see an alarming percentage of participants failing to link primary drivers like high blood pressure or smoking to stroke likelihood."
                    >
                        <GenericBarChart
                            data={riskIdentification && riskIdentification.map(item => ({
                                name: item.risk.replace(/_/g, " "),
                                percentage: item.percentage
                            }))}
                            xKey="name"
                            valueKey="percentage"
                            layout="vertical"
                            height={300}
                        />
                    </ChartPanel>

                    <ChartPanel
                        title="Number of Risk Factors Recalled per Person"
                        helperText="Almost no one can rattle off multiple risk factors. This severe lack of recall depth allows dangerous habits to flourish unchecked."
                    >
                        <GenericBarChart
                            data={riskDepth && riskDepth.map(item => ({
                                name: item.risk_count.toString(),
                                percentage: item.percentage
                            }))}
                            xKey="name"
                            valueKey="percentage"
                            layout="horizontal"
                            height={300}
                        />
                    </ChartPanel>
                </div>
            </Section>

        </PageContainer>
    );
};

export default KnowledgeGap;
