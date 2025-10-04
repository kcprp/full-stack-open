import React from 'react';
import { Entry, HealthCheckRating, assertNever } from '../../types';
import FavoriteIcon from '@mui/icons-material/Favorite';

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const getHealthCheckRatingIcon = (rating: HealthCheckRating) => {
    switch (rating) {
      case HealthCheckRating.Healthy:
        return <FavoriteIcon style={{ color: 'green' }} />;
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon style={{ color: 'yellow' }} />;
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon style={{ color: 'orange' }} />;
      case HealthCheckRating.CriticalRisk:
        return <FavoriteIcon style={{ color: 'red' }} />;
      default:
        break;
    }
  };

  switch (entry.type) {
    case "Hospital":
      return (
        <div>
          <div>{entry.description}</div>
          {entry.discharge && (
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              Discharge: {entry.discharge.date} - {entry.discharge.criteria}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            Diagnose by {entry.specialist}
          </div>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <div style={{ fontWeight: 'bold' }}>{entry.employerName}</div>
          <div>{entry.description}</div>
          {entry.sickLeave && (
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            Diagnose by {entry.specialist}
          </div>
        </div>
      );
    case "HealthCheck":
      return (
        <div>
          <div>{entry.description}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {getHealthCheckRatingIcon(entry.healthCheckRating)}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            Diagnose by {entry.specialist}
          </div>
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
