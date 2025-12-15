import React from 'react';

const HealthGradeIndicator = ({ healthScore = 75, showLabel = true, size = 'md' }) => {
  const getHealthColor = (score) => {
    const red = Math.round(255 * (1 - score / 100));
    const green = Math.round(255 * (score / 100));
    return `rgb(${red}, ${green}, 0)`;
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const heights = {
    sm: '24px',
    md: '32px',
    lg: '48px'
  };

  const fontSize = {
    sm: '10px',
    md: '12px',
    lg: '16px'
  };

  return (
    <div style={{ width: '100%' }}>
      <div 
        style={{
          width: '100%',
          height: heights[size],
          backgroundColor: '#e5e7eb',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div 
          style={{
            height: '100%',
            width: `${healthScore}%`,
            backgroundColor: getHealthColor(healthScore),
            transition: 'all 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '12px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: fontSize[size],
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {healthScore}% - {getLetterGrade(healthScore)}
        </div>
      </div>
      
      {showLabel && (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px',
            fontSize: '11px',
            color: '#6b7280'
          }}
        >
          <span style={{ color: 'rgb(255, 0, 0)' }}>Unhealthy</span>
          <span style={{ color: 'rgb(255, 255, 0)' }}>Moderate</span>
          <span style={{ color: 'rgb(0, 255, 0)' }}>Healthy</span>
        </div>
      )}
    </div>
  );
};

export default HealthGradeIndicator;
