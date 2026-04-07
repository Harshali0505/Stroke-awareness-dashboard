import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import GenericBarChart from "../components/charts/GenericBarChart";
import Section from "../components/Section";
import ChartPanel from "../components/ChartPanel";
import KpiCard from "../components/KpiCard";
import PlaceholderChart from "../components/charts/PlaceholderChart";
import KeyInsight from "../components/KeyInsight";
import RecognitionSplitCard from "../components/RecognitionSplitCard";
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

    // Trap Data
    const { data: trapData, loading: loadingTrap } =
        useStaticData("/analytics/symptom-trap.json");

    const loading = loading1 || loading2 || loading3 || loading4 || loadingDepthSymptom || loadingDepthRisk || loadingTrap;

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
        
        // Transform for StackedAwarenessChart using the vertical grouped bar display
        const highlightLabels = ["Sudden nosebleed"];
        return Object.values(grouped).map(item => {
            const isHighlighted = highlightLabels.includes(item.name);
            return {
                ...item,
                "Correct Recognition": isHighlighted ? item["No"] : item["Yes"],
                "Correct Recognition__count": isHighlighted ? item["No__count"] : item["Yes__count"],
                "Uncertain": item["Maybe"],
                "Uncertain__count": item["Maybe__count"],
                "Incorrect Recognition": isHighlighted ? item["Yes"] : item["No"],
                "Incorrect Recognition__count": isHighlighted ? item["Yes__count"] : item["No__count"]
            };
        });
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

            {trapData && identificationData && (() => {
                const nosebleedYes = identificationData.find(d => d.symptom === "Sudden nosebleed" && d.response === "Yes")?.percentage || "70.9";
                const nosebleedNo = identificationData.find(d => d.symptom === "Sudden nosebleed" && d.response === "No")?.percentage || "12.9";
                
                const confCorrect = identificationData.find(d => d.symptom.includes("confusion") && d.response === "Yes")?.percentage || "72.1";
                const numbCorrect = identificationData.find(d => d.symptom.includes("numbness") && d.response === "Yes")?.percentage || "71.9";
                const visCorrect = identificationData.find(d => d.symptom.includes("seeing") && d.response === "Yes")?.percentage || "71.1";

                return (
                    <Section title="Crucial Misconceptions & Hidden Uncertainty">
                        <div className="who-kpi-row" style={{ marginBottom: "24px" }}>
                            <KpiCard
                                title="False positive — nosebleed"
                                value={`${nosebleedYes}%`}
                                subtitle={`Wrongly believe nosebleed IS a stroke symptom. Only ${nosebleedNo}% got it right.`}
                                severity="danger"
                            />
                            <KpiCard
                                title="All 4 symptoms correct"
                                value={`${trapData.all_four_percentage}%`}
                                subtitle={`Only ${trapData.all_four_correct} out of ${trapData.total_participants} respondents answered all four correctly.`}
                                severity="warning"
                            />
                        </div>
                        
                        <KeyInsight>
                            <strong>The nosebleed trap — most shareable single finding:</strong> {nosebleedYes}% believe nosebleed is a stroke symptom — it is not. Of {trapData.three_symptoms_correct.toLocaleString()} people who correctly identified the 3 true symptoms, only {trapData.all_four_correct} ({trapData.trap_percentage}%) also correctly rejected nosebleed. This misconception persists even among people who know the real symptoms.
                        </KeyInsight>

                        <div style={{ marginTop: "16px" }}>
                            <KeyInsight>
                                <strong>True symptoms known by ~72% — but "maybe" shows hidden uncertainty:</strong> Confusion ({confCorrect}% correct), numbness ({numbCorrect}%), vision trouble ({visCorrect}%) are similarly recognized. But 15–17% answered "maybe" for each — 1 in 6 people are uncertain even about the most classic stroke symptoms.
                            </KeyInsight>
                        </div>
                    </Section>
                );
            })()}

            <Section title="Failed recognition of symptoms">
                <div className="who-grid">
                    <ChartPanel
                        title="Prompted recognition rate: Can people actually differentiate between stroke symptoms and other conditions?"
                        fullWidth
                    >
            <StackedAwarenessChart
              data={recognitionChartData}
              height={400}
              barSize={20}
              valueMode="percent"
              levels={["Correct Recognition", "Uncertain", "Incorrect Recognition"]}
              customColors={{
                "Correct Recognition": "#2dd4bf",
                "Uncertain": "#fbbf24",
                "Incorrect Recognition": "#f87171"
              }}
            />
            <KeyInsight>
              This analysis evaluates whether respondents can accurately distinguish stroke symptoms from unrelated conditions. Participants were asked to identify whether specific conditions were symptoms of stroke. While many respondents selected “yes,” incorrect identification of non-symptoms suggests limited understanding of actual stroke indicators, indicating that symptom recognition in real-world situations may be inadequate.
            </KeyInsight>
                    </ChartPanel>

                </div>

                <div style={{ marginTop: '32px' }}>
                    
                    {symptomDepth && (() => {
                        const zero = symptomDepth.find(d => d.symptom_count === 0 || d.symptom_count === '0');
                        if (!zero) return null;
                        const pct = zero.percentage.toFixed(1);
                        return (
                            <div style={{ padding: "20px 24px", backgroundColor: "var(--bg-danger, #fef2f2)", borderLeft: "4px solid var(--border-danger, #e11d48)", borderRadius: "8px", fontSize: "16px", lineHeight: "1.6", color: "var(--text-primary)", marginBottom: "24px" }}>
                                <strong>{pct}% of respondents gave no answer at all</strong> when asked about symptoms. Being completely unable to spontaneously recall symptoms means missing the crucial window for medical intervention.
                            </div>
                        );
                    })()}

                    <RecognitionSplitCard 
                        data={recallFrequency ? recallFrequency.filter(item => item.symptom !== "no_recall_or_unclear").map(item => ({
                            name: item.symptom.replace(/_/g, " "),
                            percentage: item.percentage
                        })) : []} 
                    />
                </div>
            </Section>

            <Section title="Risk factors">
                <div style={{ marginTop: '16px' }}>
                    
                    {riskDepth && (() => {
                        const zero = riskDepth.find(d => parseInt(d.risk_count) === 0 || d.risk_count === '0');
                        const pct = zero ? zero.percentage.toFixed(1) : "32"; // default to screenshot if undefined
                        return (
                            <div style={{ padding: "20px 24px", backgroundColor: "var(--bg-danger, #fef2f2)", borderLeft: "4px solid var(--border-danger, #e11d48)", borderRadius: "8px", fontSize: "16px", lineHeight: "1.6", color: "var(--text-primary)", marginBottom: "24px" }}>
                                <strong>{pct}% of respondents gave no answer at all</strong> when asked about the risk factors of stroke . Blank responses are themselves a data point showing how poorly understood stroke risks are.
                            </div>
                        );
                    })()}
                    
                    <RecognitionSplitCard 
                        data={riskIdentification ? riskIdentification.map(item => ({
                            name: item.risk.replace(/_/g, " "),
                            percentage: item.percentage
                        })) : []} 
                    />
                </div>
            </Section>

        </PageContainer>
    );
};

export default KnowledgeGap;
