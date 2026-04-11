import React from 'react';
import { FiCheck, FiAlertTriangle, FiInfo, FiActivity } from 'react-icons/fi';

const InsightCard = ({ type = 'primary', title, children, severity = 'amber' }) => {
  const isPrimary = type === 'primary';
  const CardClass = isPrimary ? 'card-type-2' : 'card-type-3';
  
  let DefaultIcon = <FiInfo />;
  if (severity === 'red') DefaultIcon = <FiAlertTriangle />;
  if (severity === 'green') DefaultIcon = <FiCheck />;
  if (severity === 'amber') DefaultIcon = <FiActivity />;

  return (
    <div className={`${CardClass} on-${severity} animate-card`}>
      {isPrimary ? (
        <>
          <div className="t2-icon">{DefaultIcon}</div>
          <h3 className="t2-heading text-heading-2" style={{ marginLeft: '12px' }}>{title}</h3>
          <div className="t2-body text-body-sm" style={{ marginLeft: '12px' }}>{children}</div>
        </>
      ) : (
        <>
          <div className="header-row">
            <div className="t3-icon">{DefaultIcon}</div>
            <h3 className="t3-heading text-heading-2">{title}</h3>
          </div>
          <div className="t3-body text-body-sm">{children}</div>
        </>
      )}
    </div>
  );
};

export default InsightCard;
