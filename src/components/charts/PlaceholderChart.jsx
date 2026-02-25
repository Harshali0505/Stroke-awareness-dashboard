import React from 'react';
import { CHART_COLORS } from '../../constants/colors';

const PlaceholderChart = ({
    height = 300,
    text = "Data not yet available",
    title = "Placeholder Graph"
}) => {
    return (
        <div
            style={{
                width: '100%',
                height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px dashed ${CHART_COLORS.grid}`,
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(241, 245, 249, 0.5)',
                color: 'var(--text-tertiary)'
            }}
        >
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>📊 {title}</div>
            <div style={{ fontSize: '13px', fontStyle: 'italic' }}>{text}</div>
        </div>
    );
};

export default PlaceholderChart;
