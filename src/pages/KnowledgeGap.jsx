import React from "react";
import PageContainer from "../components/PageContainer";
import { useStaticData } from "../data/useStaticData";
import StackedAwarenessChart from "../components/charts/StackedAwarenessChart";
import ChartPanel from "../components/ChartPanel";
import KpiCard from "../components/KpiCard";
import InsightCard from "../components/InsightCard";
import RecognitionSplitCard from "../components/RecognitionSplitCard";

// Direct import from clustering directory
import dashboardData from '../../../../models/clustering_v2/phase5_outputs/dashboard_stats.json';

const KnowledgeGap = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { data: identificationData, loading: loading1 } = useStaticData("/analytics/symptom-identification.json");
    const { data: recallFrequency, loading: loading2 } = useStaticData("/analytics/symptom-recall-frequency.json");
    const { data: symptomDepth, loading: loadingDepthSymptom } = useStaticData("/analytics/symptom-recall-depth.json");
    const { data: riskIdentification, loading: loading3 } = useStaticData("/analytics/risk-identification.json");
    const { data: riskGapData, loading: loading4 } = useStaticData("/analytics/risk-gap.json");
    const { data: riskDepth, loading: loadingDepthRisk } = useStaticData("/analytics/risk-recall-depth.json");

    const trapData = dashboardData.mastery;
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
                title="Knowledge Gap Scorecard"
                description="A stroke is itself a serious form of crisis that can severely mislead. These graphs expose the specific blind spots in the public's symptom and risk recognition."
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                pageHeaderMeta={{ sectionTag: 'SECTION 04', severity: 'critical', severityLabel: 'CRITICAL' }}
            >
                <p className="text-body text-muted">Loading knowledge gap insights...</p>
            </PageContainer>
        );
    }

    const nosebleedYes = identificationData?.find(d => d.symptom === "Sudden nosebleed" && d.response === "Yes")?.percentage || "70.9";
    const nosebleedNo = identificationData?.find(d => d.symptom === "Sudden nosebleed" && d.response === "No")?.percentage || "12.9";
    const confCorrect = identificationData?.find(d => d.symptom.includes("confusion") && d.response === "Yes")?.percentage || "72.1";
    const numbCorrect = identificationData?.find(d => d.symptom.includes("numbness") && d.response === "Yes")?.percentage || "71.9";
    const visCorrect = identificationData?.find(d => d.symptom.includes("seeing") && d.response === "Yes")?.percentage || "71.1";

    const zeroSymptom = symptomDepth?.find(d => d.symptom_count === 0 || d.symptom_count === '0');
    const zeroSymptomPct = zeroSymptom ? zeroSymptom.percentage.toFixed(1) : "32";

    const zeroRisk = riskDepth?.find(d => parseInt(d.risk_count) === 0 || d.risk_count === '0');
    const zeroRiskPct = zeroRisk ? zeroRisk.percentage.toFixed(1) : "32";

    return (
        <PageContainer
            title="Knowledge Gap Scorecard"
            description="A stroke is itself a serious form of crisis that can severely mislead. These graphs expose the specific blind spots in the public's symptom and risk recognition."
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            pageHeaderMeta={{ sectionTag: 'SECTION 04', severity: 'critical', severityLabel: 'CRITICAL' }}
        >


            {/* ZONE B — CRITICAL INSIGHTS */}
            <div className="zone-b">
                <div className="grid-2-col" style={{ marginBottom: "24px" }}>
                    <KpiCard
                        topLabel="MISCONCEPTION RATE"
                        value={`${nosebleedYes}%`}
                        subtitle={`Believe nosebleed IS a stroke symptom. Only ${nosebleedNo}% disagree.`}
                        severity="red"
                    />
                    <KpiCard
                        topLabel="SYMPTOM MASTERY"
                        value={`${trapData ? (trapData.all_four_percentage).toFixed(1) : "0.51"}%`}
                        subtitle={`Only ${trapData?.all_four_correct || 0} respondents answered all four correctly.`}
                        severity="red"
                    />
                </div>

                {/* Nosebleed trap — research finding banner */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--red-bg, #fff1f2) 0%, var(--bg-surface) 100%)',
                  border: '1px solid var(--red-border, #fecaca)',
                  borderLeft: '4px solid var(--red, #ef4444)',
                  borderRadius: '14px', padding: '22px 28px',
                  position: 'relative', overflow: 'hidden',
                  marginBottom: '12px',
                }}>
                  <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red, #ef4444)', marginBottom: '6px' }}>
                    THE NOSEBLEED TRAP · SECTION 04
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Most Shareable Single Finding
                  </h3>
                  <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--red)' }}>{trapData?.nosebleed_yes_percentage ?? nosebleedYes}%</strong> ({trapData?.nosebleed_yes_count ?? 4374} people) believe nosebleed is a stroke symptom — <em>it is not</em>.
                    Of {trapData?.three_symptoms_correct ?? 4287} participants who correctly identified 3 true symptoms,
                    only <strong style={{ color: 'var(--red)' }}>{trapData?.all_four_correct ?? 22} ({trapData?.trap_percentage ?? 0.51}%)</strong> achieved full symptom mastery without also marking nosebleed.
                    This misconception persists even among those who know the real symptoms.
                  </p>
                </div>

                {/* Hidden uncertainty banner */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--amber-bg, #fffbeb) 0%, var(--bg-surface) 100%)',
                  border: '1px solid var(--amber-border, #fde68a)',
                  borderLeft: '4px solid var(--amber, #f59e0b)',
                  borderRadius: '14px', padding: '22px 28px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber, #f59e0b)', marginBottom: '6px' }}>
                    HIDDEN UNCERTAINTY · SECTION 04
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ~72% Recognize True Symptoms — But 'Maybe' Hides Real Doubt
                  </h3>
                  <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    Confusion (<strong>{confCorrect}%</strong>), numbness (<strong>{numbCorrect}%</strong>), vision trouble (<strong>{visCorrect}%</strong>) are the most correctly identified symptoms.
                    But <strong style={{ color: 'var(--amber)' }}>15–17%</strong> answered 'maybe' for each — 1 in 6 people are uncertain even about the most classic stroke symptoms.
                  </p>
                </div>
            </div>

            {/* ZONE C — CHARTS */}
            <div className="zone-c">
                <div className="chart-grid-1">
                    <ChartPanel
                        title="Prompted recognition rate"
                        sectionTag="04.A"
                        severity="amber"
                        callout={<span>This graph evaluates whether respondents can accurately distinguish stroke symptoms from unrelated conditions. Participants were asked to identify whether specific conditions were symptoms of stroke. Since many respondents selected 'yes', incorrect identification of non-symptoms suggests limited understanding of actual stroke indicators, indicating that symptom recognition in real-world situations may be inadequate.</span>}
                    >
                        <StackedAwarenessChart
                            data={recognitionChartData}
                            height="100%"
                            barSize={30}
                            valueMode="percent"
                            levels={["Correct Recognition", "Uncertain", "Incorrect Recognition"]}
                            customColors={{
                                "Correct Recognition": "var(--green)",
                                "Uncertain": "var(--amber)",
                                "Incorrect Recognition": "var(--red)"
                            }}
                        />
                    </ChartPanel>
                </div>
            </div>

            {/* ZONE D — SUPPORTING INSIGHTS */}
            <div className="zone-d-divider text-label">
                ── RECALL FREQUENCY SCORECARDS ──
            </div>
            <div className="zone-d">
                <div style={{ marginBottom: "32px" }}>
                    {/* Symptom Recall Depth — eye-catching callout */}
                <div style={{
                  position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--red-bg) 0%, var(--bg-surface) 60%)',
                  border: '1px solid var(--red-border)',
                  borderLeft: '5px solid var(--red)',
                  borderRadius: '16px',
                  padding: '24px 32px',
                  display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap',
                  marginBottom: '16px',
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '130px', height: '130px', background: 'radial-gradient(circle, rgba(229,62,62,0.13) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                  {/* Stat */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '56px', fontWeight: 800, color: 'var(--red)', lineHeight: 1, letterSpacing: '-0.04em' }}>{zeroSymptomPct}%</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginTop: '4px', opacity: 0.8 }}>Recalled Zero Symptoms</div>
                  </div>
                  <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--red-border)', flexShrink: 0, minHeight: '50px' }} />
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', marginBottom: '6px' }}>SYMPTOM RECALL DEPTH · SECTION 04</div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Spontaneous Recall is Critically Low</h3>
                    <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                      Being completely unable to spontaneously recall stroke symptoms means missing the <strong>crucial window for medical intervention</strong>. When it counts most, recall must be instant.
                    </p>
                  </div>
                </div>
                    <div style={{ marginTop: "16px" }}>
                        <RecognitionSplitCard 
                            data={recallFrequency ? recallFrequency.filter(item => item.symptom !== "no_recall_or_unclear" && item.symptom !== "severe_headache").map(item => ({
                                name: item.symptom.replace(/_/g, " "),
                                percentage: item.percentage
                            })) : []} 
                        />
                    </div>
                </div>

                <div>
                    {/* Risk Factor Recall Depth — eye-catching callout */}
                <div style={{
                  position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--red-bg) 0%, var(--bg-surface) 60%)',
                  border: '1px solid var(--red-border)',
                  borderLeft: '5px solid var(--red)',
                  borderRadius: '16px',
                  padding: '24px 32px',
                  display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap',
                  marginBottom: '16px',
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '130px', height: '130px', background: 'radial-gradient(circle, rgba(229,62,62,0.13) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                  {/* Stat */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '56px', fontWeight: 800, color: 'var(--red)', lineHeight: 1, letterSpacing: '-0.04em' }}>{zeroRiskPct}%</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginTop: '4px', opacity: 0.8 }}>Gave No Risk Factors</div>
                  </div>
                  <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--red-border)', flexShrink: 0, minHeight: '50px' }} />
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', marginBottom: '6px' }}>RISK FACTOR RECALL DEPTH · SECTION 04</div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Blank Responses Are Themselves a Data Point</h3>
                    <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--red)' }}>{zeroRiskPct}%</span> of respondents gave <strong>no answer at all</strong> when asked about stroke risk factors. Blank responses show how poorly understood stroke risks truly are.
                    </p>
                  </div>
                </div>
                    <div style={{ marginTop: "16px" }}>
                        <RecognitionSplitCard 
                            data={riskIdentification ? riskIdentification.map(item => ({
                                name: item.risk.replace(/_/g, " "),
                                percentage: item.percentage
                            })) : []} 
                        />
                    </div>
                </div>
            </div>

        </PageContainer>
    );
};

export default KnowledgeGap;
