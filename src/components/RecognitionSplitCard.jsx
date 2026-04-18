import React from "react";

const ProgressBarRow = ({ label, percentage, trackColor, barColor }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
    <div style={{ flex: 1, textAlign: "right", fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)" }}>
      {label}
    </div>
    <div style={{ width: "80px", height: "10px", backgroundColor: trackColor, borderRadius: "5px", position: "relative", overflow: "hidden" }}>
      <div style={{ width: `${percentage}%`, height: "100%", backgroundColor: barColor, borderRadius: "5px" }} />
    </div>
    <div style={{ width: "45px", fontSize: "14px", fontWeight: 700, color: barColor }}>
      {percentage.toFixed(1)}%
    </div>
  </div>
);

const RecognitionSplitCard = ({ data = [], topCount = 4, bottomCount = 4 }) => {
  if (!data || data.length === 0) return null;

  // Sort descending
  const sorted = [...data].sort((a, b) => b.percentage - a.percentage);
  
  let topList = [];
  let bottomList = [];

  // Prevent overlap if there aren't enough items to satisfy topCount + bottomCount
  if (sorted.length <= topCount + bottomCount) {
     const mid = Math.ceil(sorted.length / 2);
     topList = sorted.slice(0, mid);
     bottomList = sorted.slice(mid).reverse();
  } else {
     topList = sorted.slice(0, topCount);
     bottomList = sorted.slice(-bottomCount).reverse();
  }

  // User specifically requested: items with >50% should NOT be considered "least recognized".
  bottomList = bottomList.filter(item => item.percentage < 50);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
      
      {/* Most Recognized */}
      <div style={{ 
        flex: 1, 
        minWidth: "300px",
        backgroundColor: "var(--bg-surface)", 
        border: "1px solid var(--border)", 
        borderRadius: "12px", 
        padding: "24px" 
      }}>
        <div style={{ 
          fontSize: "12px", 
          fontWeight: 700, 
          color: "var(--brand-primary, #0f766e)", 
          textTransform: "uppercase", 
          letterSpacing: "0.05em", 
          marginBottom: "24px" 
        }}>
          Most Recognized
        </div>
        
        {topList.map((item, i) => (
          <ProgressBarRow 
            key={i} 
            label={item.name} 
            percentage={item.percentage} 
            trackColor="var(--bg-surface-3)" 
            barColor="var(--brand-primary, #0f766e)" 
          />
        ))}
      </div>

      {/* Least Recognized */}
      <div style={{ 
        flex: 1, 
        minWidth: "300px",
        backgroundColor: "var(--red-bg)", 
        border: "1px solid var(--red-border)", 
        borderRadius: "12px", 
        padding: "24px" 
      }}>
        <div style={{ 
          fontSize: "12px", 
          fontWeight: 700, 
          color: "var(--text-danger, #e11d48)", 
          textTransform: "uppercase", 
          letterSpacing: "0.05em", 
          marginBottom: "24px" 
        }}>
          Least Recognized — The Blind Spots
        </div>
        
        {bottomList.map((item, i) => (
          <ProgressBarRow 
            key={i} 
            label={item.name} 
            percentage={item.percentage} 
            trackColor="var(--bg-surface-2)" 
            barColor="var(--red)" 
          />
        ))}
      </div>

    </div>
  );
};

export default RecognitionSplitCard;
