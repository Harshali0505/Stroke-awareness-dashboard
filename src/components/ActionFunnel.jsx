import React from 'react';

const funnelSteps = [
  {
    label: "Know Treatment is Immediate",
    percentage: 51.6,
    desc: "Understand the urgency",
    color: "#3b82f6"
  },
  {
    label: "Go to Hospital/Clinic",
    percentage: 55.4,
    desc: "Seek professional medical help",
    color: "#f59e0b"
  },
  {
    label: "Call Emergency Services",
    percentage: 26.1,
    desc: "Take the correct critical action",
    color: "#ef4444"
  }
];

const ActionFunnel = ({ stats = funnelSteps }) => {
  return (
    <div style={{ padding: "16px 0", width: "100%", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "stretch", minWidth: "600px", gap: "12px" }}>
        {stats.map((step, index) => {
          // Visual drop-off width
          const widthPct = `${Math.max(30, step.percentage)}%`;
          const isLast = index === stats.length - 1;

          return (
            <div key={index} style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ 
                backgroundColor: "#fff", 
                border: "1px solid #e2e8f0", 
                borderRadius: "8px", 
                padding: "20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderTop: `4px solid ${step.color}`,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                zIndex: 2
              }}>
                 <div style={{ fontSize: "14px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                   Step {index + 1}
                 </div>
                 <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                   {step.label}
                 </div>
                 <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                   {step.desc}
                 </div>
                 
                 <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: "8px" }}>
                   <span style={{ fontSize: "36px", fontWeight: 800, color: step.color, lineHeight: 1 }}>{step.percentage}%</span>
                 </div>
              </div>

              {/* The "Funnel" visual connecting piece */}
              {!isLast && (
                <div style={{
                  position: "absolute",
                  top: "50%",
                  right: "-20px",
                  transform: "translateY(-50%)",
                  width: "30px",
                  height: "24px",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#cbd5e1"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionFunnel;
