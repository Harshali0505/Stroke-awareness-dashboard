import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '../components/PageContainer';

const RISK_LEVELS = [
  { label: 'Low', min: 0, max: 0.25, color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  { label: 'Medium', min: 0.25, max: 0.45, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { label: 'High', min: 0.45, max: 0.65, color: '#f43f5e', bg: '#fff1f2', border: '#fecdd3' },
  { label: 'Critical', min: 0.65, max: 1.00, color: '#e11d48', bg: '#fff1f2', border: '#fda4af' },
];

function getRisk(prob) {
  return RISK_LEVELS.find(r => prob >= r.min && prob < r.max) || RISK_LEVELS[3];
}

const DEFAULTS = { age: 55, avg_glucose_level: 110, bmi: 28, hypertension: 0, heart_disease: 0, ever_married: 'Yes', smoking_status: 'never smoked', gender: 'Female', work_type: 'Private', residence_type: 'Urban' };

export default function PatientRiskPredictor({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const animProbRef = useRef(0);
  const [inputs, setInputs] = useState(DEFAULTS);
  const [prob, setProb] = useState(0);
  const [animProb, setAnimProb] = useState(0);
  const [shapData, setShapData] = useState([]);
  const [explanationText, setExplanationText] = useState("");

  useEffect(() => {
    const payload = {
      "age": inputs.age === '' || isNaN(inputs.age) ? 0 : inputs.age,
      "hypertension": inputs.hypertension,
      "heart_disease": inputs.heart_disease,
      "avg_glucose_level": inputs.avg_glucose_level === '' || isNaN(inputs.avg_glucose_level) ? 0 : inputs.avg_glucose_level,
      "bmi": inputs.bmi === '' || isNaN(inputs.bmi) ? 0 : inputs.bmi,
      "gender_Male": inputs.gender === "Male" ? 1 : 0,
      "gender_Other": inputs.gender === "Other" ? 1 : 0,
      "ever_married_Yes": inputs.ever_married === "Yes" ? 1 : 0,
      "work_type_Never_worked": inputs.work_type === "Never_worked" ? 1 : 0,
      "work_type_Private": inputs.work_type === "Private" ? 1 : 0,
      "work_type_Self-employed": inputs.work_type === "Self-employed" ? 1 : 0,
      "work_type_children": inputs.work_type === "children" ? 1 : 0,
      "Residence_type_Urban": inputs.residence_type === "Urban" ? 1 : 0,
      "smoking_status_formerly smoked": inputs.smoking_status === "formerly smoked" ? 1 : 0,
      "smoking_status_never smoked": inputs.smoking_status === "never smoked" ? 1 : 0,
      "smoking_status_smokes": inputs.smoking_status === "smokes" ? 1 : 0
    };

    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/predict';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        const p = data.probability;
        setProb(p);
        setAnimProb(p);
        if (data.explanation) {
          setExplanationText(data.explanation);
        }
        if (data.contributing_factors) {
          const formattedFactors = data.contributing_factors.map(f => {
            const k = f.feature;
            const v = f.shap_value;
            let fName = k;
            let opted = "";
            
            if (k === 'age') { fName = 'Age'; opted = inputs.age + ' yrs'; }
            else if (k === 'bmi') { fName = 'BMI'; opted = inputs.bmi; }
            else if (k === 'avg_glucose_level') { fName = 'Avg Glucose'; opted = inputs.avg_glucose_level + ' mg/dL'; }
            else if (k === 'hypertension') { fName = 'Hypertension'; opted = inputs.hypertension ? 'Yes' : 'No'; }
            else if (k === 'heart_disease') { fName = 'Heart Disease'; opted = inputs.heart_disease ? 'Yes' : 'No'; }
            else if (k.startsWith('gender_')) {
              const cat = k.replace('gender_', '');
              fName = 'Gender';
              opted = inputs.gender === cat ? cat : `Not ${cat}`;
            }
            else if (k.startsWith('ever_married_')) {
              const cat = k.replace('ever_married_', '');
              fName = 'Marital Status';
              opted = inputs.ever_married === cat ? cat : `Not ${cat}`;
            }
            else if (k.startsWith('work_type_')) {
              const cat = k.replace('work_type_', '');
              fName = 'Work Type';
              opted = inputs.work_type === cat ? cat.replace('_', ' ') : `Not ${cat.replace('_', ' ')}`;
            }
            else if (k.startsWith('Residence_type_')) {
              const cat = k.replace('Residence_type_', '');
              fName = 'Residence';
              opted = inputs.residence_type === cat ? cat : `Not ${cat}`;
            }
            else if (k.startsWith('smoking_status_')) {
              const cat = k.replace('smoking_status_', '');
              fName = 'Smoking Status';
              opted = inputs.smoking_status === cat ? cat : `Not ${cat}`;
            }

            return { featureName: fName, optedValue: opted, shap_value: v };
          }).filter(f => !f.optedValue.toString().startsWith('Not ') && f.shap_value !== 0);
          
          // Re-sort just to be safe, though backend already sorts
          formattedFactors.sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));
          setShapData(formattedFactors);
        }
      })
      .catch(err => console.error(err));
  }, [inputs]);

  const risk = getRisk(prob);
  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }));

  return (
    <PageContainer
      title="Patient Risk Predictor"
      description="Enter patient values → get live stroke probability → risk badge → SHAP explanation"
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      pageHeaderMeta={{ sectionTag: 'PREDICTION MODEL', severity: 'info', severityLabel: 'ML' }}
    >
      <div style={S.page}>


      {/* First Horizontal Panel: Patient Features */}
      <div style={{ ...S.card, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={S.cardTitle}>Patient Features</div>
            <div style={S.cardSub}>Adjust clinical profiles and demographic parameters</div>
          </div>
          <button onClick={() => setInputs(DEFAULTS)} style={{ ...S.resetBtn, width: 'auto', marginTop: 0, padding: '10px 24px' }}>↺ Reset to Default</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 32 }}>
          {/* Column 1: Vitals */}
          <div>
            <div style={S.sectionLabel}>Vital Metrics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'age', label: 'Age', min: 1, max: 100, unit: 'yrs', color: '#0f766e' },
                { key: 'avg_glucose_level', label: 'Avg Glucose Level', min: 50, max: 300, unit: 'mg/dL', color: '#0f766e' },
                { key: 'bmi', label: 'BMI', min: 10, max: 60, unit: 'kg/m²', color: '#0f766e' },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={S.sliderLabel} htmlFor={f.key}>{f.label}</label>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{f.unit}</span>
                  </div>
                  <input 
                    id={f.key}
                    type="number" 
                    min={f.min} 
                    max={f.max} 
                    step={f.key === 'bmi' ? 0.1 : 1} 
                    value={inputs[f.key]}
                    onChange={e => set(f.key, e.target.value === '' ? '' : parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, color: '#334155', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f8fafc' }} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Clinical */}
          <div>
            <div style={S.sectionLabel}>Clinical History</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { key: 'hypertension', label: 'Hypertension' },
                { key: 'heart_disease', label: 'Heart Disease' },
              ].map(f => (
                <div key={f.key}>
                  <div style={S.toggleLabel}>{f.label}</div>
                  <div style={S.toggleBtns}>
                    {[0, 1].map(v => (
                      <button key={v} onClick={() => set(f.key, v)} style={{ ...S.toggleBtn, background: inputs[f.key] === v ? (v ? '#0f766e' : '#f1f5f9') : 'transparent', color: inputs[f.key] === v ? (v ? '#fff' : '#0f766e') : '#64748b', border: `1px solid ${inputs[f.key] === v ? (v ? '#0f766e' : '#cbd5e1') : '#e2e8f0'}`, fontWeight: inputs[f.key] === v ? 600 : 400 }}>
                        {v ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Demographics */}
          <div>
            <div style={S.sectionLabel}>Demographics & Lifestyle</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'gender', label: 'Gender', opts: ['Male', 'Female', 'Other'] },
                { key: 'ever_married', label: 'Ever Married', opts: ['Yes', 'No'] },
                { key: 'work_type', label: 'Work Type', opts: ['Private', 'Self-employed', 'Govt_job', 'children', 'Never_worked'] },
                { key: 'residence_type', label: 'Residence Type', opts: ['Urban', 'Rural'] },
                { key: 'smoking_status', label: 'Smoking Status', opts: ['never smoked', 'formerly smoked', 'smokes', 'Unknown'], full: true },
              ].map(f => (
                <div key={f.key} style={{ ...S.dropGroup, gridColumn: f.full ? '1 / -1' : 'auto' }}>
                  <label style={S.dropLabel}>{f.label}</label>
                  <select value={inputs[f.key]} onChange={e => set(f.key, e.target.value)} style={S.select}>
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: 2 Panels Horizontally Aligned */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'stretch' }}>
        
        {/* Risk Score Panel */}
        <div style={{ ...S.card, background: risk.bg, borderColor: risk.border, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ alignSelf: 'flex-start', width: '100%' }}>
            <div style={S.cardTitle}>Stroke Risk Prediction</div>
            <div style={{ ...S.cardSub, marginBottom: 0 }}>Real-time output from the XGBoost model</div>
          </div>
          
          <div style={{ ...S.gauge, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '40px 0' }}>
            <div style={S.gaugeCircle}>
              <svg viewBox="0 0 120 120" style={{ width: 220, height: 220, filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.08))' }}>
                <circle cx="60" cy="60" r="50" fill="#ffffff" stroke="#ffffff" strokeWidth="0" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={risk.color} strokeWidth="8"
                  strokeDasharray={`${animProb * 314} 314`} strokeLinecap="round"
                  transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                <text x="60" y="55" textAnchor="middle" fill="#0f172a" fontSize="24" fontWeight="800" letterSpacing="-0.02em">
                  {(animProb * 100).toFixed(1)}%
                </text>
                <text x="60" y="74" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="700" letterSpacing="0.08em">PROBABILITY</text>
              </svg>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ ...S.riskBadge, background: risk.color, color: '#fff', boxShadow: `0 8px 16px ${risk.color}30` }}>
                {risk.label} Risk
              </span>
            </div>
            <div style={{ ...S.riskDesc, marginTop: 24, marginBottom: 0 }}>
              {risk.label === 'Low' && '✓ Patient shows low mathematical indicators. Routine lifestyle habits are recommended.'}
              {risk.label === 'Medium' && '⚠ Moderate risk detected. Preventative clinical evaluations may be advisable.'}
              {risk.label === 'High' && '⚠ High stroke risk profile. Priority clinical assessment and intervention recommended.'}
              {risk.label === 'Critical' && '🚨 Critical risk tier. Immediate detailed cardiovascular screening is strongly advised.'}
            </div>
          </div>
        </div>

        {/* Explanation Panel */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column' }}>
          <div style={{...S.cardTitle}}>Key Contributing Factors</div>
          <div style={{...S.cardSub, marginBottom: 20}}>Live SHAP values explaining this prediction</div>
          
          {explanationText && (
            <div style={{ marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#475569', lineHeight: 1.6, border: '1px solid #e2e8f0', borderLeft: '4px solid #14b8a6' }}>
              {explanationText}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shapData.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: 13 }}>No significant contributing factors found.</div>
            )}
            {shapData.map((d, i) => {
              const isPos = d.shap_value > 0;
              const isZero = d.shap_value === 0;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, background: '#fff', padding: '10px 16px', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                     {d.featureName || (d.feature ? d.feature.replace(/_/g, ' ') : 'Factor')}: <span style={{ color: '#64748b', fontWeight: 400 }}>{d.optedValue || ''}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: isZero ? '#64748b' : (isPos ? '#e11d48' : '#10b981'), display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isZero ? '− Neutral Impact' : (isPos ? '↑ Increases Risk' : '↓ Decreases Risk')}
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>({d.shap_value > 0 ? '+' : ''}{d.shap_value})</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </div>
    </PageContainer>
  );
}

const S = {
  page: { padding: '36px 40px', minHeight: '100%', background: '#f8fafc' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 14, color: '#64748b', lineHeight: 1.5, maxWidth: 600 },
  grid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'stretch' },
  card: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03), 0 0 3px rgba(15, 23, 42, 0.02)' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4, letterSpacing: '-0.01em' },
  cardSub: { fontSize: 13, color: '#64748b', marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' },
  sliderGroup: { marginBottom: 0 },
  sliderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  sliderLabel: { fontSize: 13, fontWeight: 600, color: '#334155' },
  sliderValue: { fontSize: 14, fontWeight: 700 },
  sliderRange: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 6, fontWeight: 500 },
  toggleRow: { display: 'flex', gap: 16, marginBottom: 32 },
  toggle: { flex: 1 },
  toggleLabel: { fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 },
  toggleBtns: { display: 'flex', gap: 8 },
  toggleBtn: { flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  dropGroup: { marginBottom: 0 },
  dropLabel: { fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 },
  select: { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', color: '#0f172a', fontSize: 13, cursor: 'pointer', outline: 'none', transition: 'border 0.2s', fontWeight: 500 },
  resetBtn: { width: '100%', marginTop: 32, padding: '14px', background: '#f1f5f9', border: 'none', borderRadius: 10, color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
  gauge: { display: 'flex', justifyContent: 'center', margin: '24px 0' },
  gaugeCircle: { position: 'relative' },
  riskBadge: { display: 'inline-block', padding: '10px 28px', borderRadius: 24, fontSize: 16, fontWeight: 700, letterSpacing: '0.02em' },
  riskDesc: { marginTop: 32, fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 1.6, padding: '0 16px' },
};
