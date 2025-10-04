import type { Entry } from "../../types";
import EntryDetails from "./EntryDetails";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

type EntryProps = {
  entry: Entry,
  getNameFromCode: (code: string) => string | undefined
};

const Entry = ({ entry, getNameFromCode }: EntryProps) => {
  const style: React.CSSProperties = {
    border: '1px solid black',
    borderRadius: '5px',
    margin: '5px',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const textStyle: React.CSSProperties = {
    margin: 0,
  };

  const listStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: '20px',
  };

  const getEntryIcon = () => {
    switch (entry.type) {
      case "Hospital":
        return <LocalHospitalIcon />;
      case "OccupationalHealthcare":
        return <WorkIcon />;
      case "HealthCheck":
        return <FavoriteIcon />;
      default:
        return null;
    }
  };

  return (
    <div style={style} className="entry" key={entry.id}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <p style={textStyle}>{entry.date}</p>
        {getEntryIcon()}
      </div>
      <EntryDetails entry={entry} />
      {entry?.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul style={listStyle}>
          {entry.diagnosisCodes.map(code =>
            <li key={code}>{code} {getNameFromCode(code)}</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Entry;