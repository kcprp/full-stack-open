import { useState, Dispatch, SetStateAction } from "react";
import patientService from '../../services/patients';
import { Patient } from "../../types";
type AddEntryFormProps = {
  id: string,
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setPatient: Dispatch<SetStateAction<Patient | null>>;
};

const AddEntryForm = ({ id, visible, setVisible, setPatient }: AddEntryFormProps) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [codes, setCodes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const healthCheckEntry = {
      description: description,
      date: date,
      specialist: specialist,
      type: "HealthCheck" as const,
      healthCheckRating: healthCheckRating,
      diagnosisCodes: codes.split(',').map(code => code.trim()).filter(code => code !== '')
    };

    try {
      const entry = await patientService.createEntry(id, healthCheckEntry);
      console.log(entry);

      setPatient((prevPatient: Patient | null) => {
        if (!prevPatient) return prevPatient;
        return {
          ...prevPatient,
          entries: prevPatient.entries.concat(entry)
        };
      });

      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating(0);
      setVisible(false);
    } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const formStyle = {
    border: "2px dotted black",
    padding: '1.5rem',
    marginBottom: '1rem'
  };

  const fieldStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    color: '#666',
    fontSize: '0.875rem',
    marginBottom: '0.25rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box' as const
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.5rem'
  };

  const cancelButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.5rem 2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold' as const,
    cursor: 'pointer'
  };

  const addButtonStyle = {
    backgroundColor: '#d0d0d0',
    color: '#333',
    padding: '0.5rem 2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold' as const,
    cursor: 'pointer'
  };

  return (
    <>
      {error && (
        <p style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>New HealthCheck entry</h3>
        <div>
          <div style={fieldStyle}>
            <label htmlFor="description" style={labelStyle}>Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="date" style={labelStyle}>Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="specialist" style={labelStyle}>Specialist</label>
            <input
              id="specialist"
              type="text"
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="healthCheckRating" style={labelStyle}>Healthcheck rating</label>
            <select
              id="healthCheckRating"
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(Number(e.target.value))}
              style={inputStyle}
            >
              <option value={0}>Healthy</option>
              <option value={1}>Low Risk</option>
              <option value={2}>High Risk</option>
              <option value={3}>Critical Risk</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label htmlFor="codes" style={labelStyle}>Diagnosis codes</label>
            <input 
              id="codes"
              type="text"
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={buttonContainerStyle}>
            <button type="button" onClick={handleCancel} style={cancelButtonStyle}>
              CANCEL
            </button>
            <button type="submit" style={addButtonStyle}>ADD</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddEntryForm;