import React from "react";

const ProgressBar = ({ value, color }) => (
  <div style={{
    width: "100%",
    height: "6px",
    backgroundColor: "var(--bg-surface-3)",
    borderRadius: "3px",
    marginTop: "8px",
    marginBottom: "16px",
    overflow: "hidden"
  }}>
    <div style={{
      width: `${value}%`,
      height: "100%",
      backgroundColor: color,
      borderRadius: "3px"
    }} />
  </div>
);

const StatColumn = ({ title, titleColor, data, isLeft = true }) => {
  // data = { low: 62.8, moderate: 36.2, high: 1.0 }
  return (
    <div style={{ 
      flex: 1, 
      paddingRight: isLeft ? "20px" : "0", 
      paddingLeft: isLeft ? "0" : "20px",
      borderRight: isLeft ? "1px solid var(--border)" : "none"
    }}>
      <div style={{
        fontSize: "12px",
        fontWeight: 700,
        color: titleColor,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "16px",
        paddingBottom: "8px",
        borderBottom: `2px solid ${titleColor}`
      }}>
        {title}
      </div>

      {/* Low Awareness */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 500 }}>
        <div style={{ color: "var(--text-secondary)", lineHeight: 1.2 }}>
          Low<br/>Awareness
        </div>
        <div style={{ color: "#ef4444", fontWeight: 700 }}>
          {data.low}%
        </div>
      </div>
      <ProgressBar value={data.low} color="#ef4444" />

      {/* Moderate Awareness */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 500 }}>
        <div style={{ color: "var(--text-secondary)", lineHeight: 1.2 }}>
          Moderate<br/>Awareness
        </div>
        <div style={{ color: "#f59e0b", fontWeight: 700 }}>
          {data.moderate}%
        </div>
      </div>
      <ProgressBar value={data.moderate} color="#f59e0b" />

      {/* High Awareness */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 500 }}>
        <div style={{ color: "var(--text-secondary)", lineHeight: 1.2 }}>
          High<br/>Awareness
        </div>
        <div style={{ color: "#10b981", fontWeight: 700 }}>
          {data.high}%
        </div>
      </div>
      <ProgressBar value={data.high} color="#10b981" />
    </div>
  );
};

const LifestyleComparisonCard = ({ title, leftTitle, leftData, rightTitle, rightData }) => {
  return (
    <div style={{
      backgroundColor: "var(--bg-surface)",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      border: "1px solid var(--border)",
      borderTop: "4px solid var(--amber)",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      minWidth: "300px"
    }}>
      <div style={{
        fontSize: "12px",
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "4px"
      }}>
        LIFESTYLE FACTOR
      </div>
      <div style={{
        fontSize: "20px",
        fontWeight: 800,
        color: "var(--text-primary)",
        marginBottom: "24px"
      }}>
        {title}
      </div>

      <div style={{ display: "flex" }}>
        <StatColumn title={leftTitle} titleColor="var(--red)" data={leftData} isLeft={true} />
        <StatColumn title={rightTitle} titleColor="var(--text-muted)" data={rightData} isLeft={false} />
      </div>
    </div>
  );
};

export default LifestyleComparisonCard;
