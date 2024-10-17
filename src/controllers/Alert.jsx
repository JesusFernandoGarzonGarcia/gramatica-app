// AlertsContainer.js
import React from 'react';
import Alert from './Alert';

const AlertsContainer = ({ alerts = [], setAlerts }) => {
  const handleAlertClose = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => handleAlertClose(alert.id)}
        />
      ))}
    </div>
  );
};

export default AlertsContainer;
