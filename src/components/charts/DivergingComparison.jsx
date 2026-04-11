import React from "react";

const DivergingComparison = ({ title, leftLabel, rightLabel, leftValue, rightValue, insight, leftColor = "#f43f5e", rightColor = "#10b981", fullWidth = false }) => {
  return (
    <div style={{ 
      marginBottom: "2rem", 
      backgroundColor: "var(--bg-surface)", 
      padding: "1.5rem", 
      borderRadius: "12px", 
      border: "1px solid var(--border)",
      width: fullWidth ? "100%" : "auto"
    }}>
      <h4 style={{ margin: "0 0 1.5rem 0", color: "var(--text-primary)", textAlign: "center", fontSize: "16px" }}>{title}</h4>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        
        {/* Left Side */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
           <div style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", fontSize: "14px" }}>{leftLabel}</div>
           <div style={{ width: "100%", height: "32px", backgroundColor: "var(--bg-secondary, #f1f5f9)", borderRadius: "6px", overflow: "hidden" }}>
             <div style={{ 
               float: "right",
               width: `${leftValue}%`, 
               height: "100%", 
               backgroundColor: leftColor, 
               borderRadius: "6px",
               display: "flex",
               alignItems: "center",
               justifyContent: "flex-start",
               paddingLeft: "12px",
               color: "white",
               fontWeight: 700,
               fontSize: "14px",
               transition: "width 1s ease-in-out"
             }}>{leftValue}%</div>
           </div>
           <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "6px", textAlign: "right" }}>Low Awareness</div>
        </div>
        
        {/* Center Divider */}
        <div style={{ 
          width: "2px", 
          height: "75px", 
          backgroundColor: "var(--text-tertiary)",
          opacity: 0.3,
          position: "relative",
          marginTop: "20px"
        }}>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--bg-surface)",
            padding: "4px 6px",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            fontWeight: 700,
            borderRadius: "50%",
            border: "1px solid var(--border)"
          }}>VS</div>
        </div>

        {/* Right Side */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
           <div style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", fontSize: "14px" }}>{rightLabel}</div>
           <div style={{ width: "100%", height: "32px", backgroundColor: "var(--bg-secondary, #f1f5f9)", borderRadius: "6px", overflow: "hidden" }}>
             <div style={{ 
               float: "left",
               width: `${rightValue}%`, 
               height: "100%", 
               backgroundColor: rightColor, 
               borderRadius: "6px",
               display: "flex",
               alignItems: "center",
               justifyContent: "flex-end",
               paddingRight: "12px",
               color: "white",
               fontWeight: 700,
               fontSize: "14px",
               transition: "width 1s ease-in-out"
             }}>{rightValue}%</div>
           </div>
           <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "6px", textAlign: "left" }}>Low Awareness</div>
        </div>
      </div>
      
      {insight && (
        <div style={{
            padding: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            borderLeft: "4px solid #3b82f6",
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: 1.5
        }}>
          <strong>Insight:</strong> {insight}
        </div>
      )}
    </div>
  );
};

export default DivergingComparison;
