import { useState, Dispatch, SetStateAction } from "react";
import patientService from '../../services/patients';
import { Patient, Diagnosis } from "../../types";
type AddEntryFormProps = {
  id: string,
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setPatient: Dispatch<SetStateAction<Patient | null>>;
  diagnoses: Diagnosis[];
};

const AddEntryForm = ({ id, visible, setVisible, setPatient, diagnoses }: AddEntryFormProps) => {
  const [entryType, setEntryType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  
  // Hospital fields
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
  
  // OccupationalHealthcare fields
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStart, setSickLeaveStart] = useState<string>('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>('');

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseEntry = {
      description,
      date,
      specialist,
      ...(selectedCodes.length > 0 && { diagnosisCodes: selectedCodes })
    };

    try {
      let entry;
      
      if (entryType === 'HealthCheck') {
        const newEntry = {
          ...baseEntry,
          type: "HealthCheck" as const,
          healthCheckRating
        };
        entry = await patientService.createEntry(id, newEntry);
      } else if (entryType === 'Hospital') {
        const newEntry = {
          ...baseEntry,
          type: "Hospital" as const,
          ...(dischargeDate && dischargeCriteria && {
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria
            }
          })
        };
        entry = await patientService.createEntry(id, newEntry);
      } else { // OccupationalHealthcare
        const newEntry = {
          ...baseEntry,
          type: "OccupationalHealthcare" as const,
          employerName,
          ...(sickLeaveStart && sickLeaveEnd && {
            sickLeave: {
              startDate: sickLeaveStart,
              endDate: sickLeaveEnd
            }
          })
        };
        entry = await patientService.createEntry(id, newEntry);
      }
      console.log(entry);

      setPatient((prevPatient: Patient | null) => {
        if (!prevPatient) return prevPatient;
        return {
          ...prevPatient,
          entries: prevPatient.entries.concat(entry)
        };
      });

      // Reset all fields
      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating(0);
      setSelectedCodes([]);
      setDischargeDate('');
      setDischargeCriteria('');
      setEmployerName('');
      setSickLeaveStart('');
      setSickLeaveEnd('');
      setError('');
      setVisible(false);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCancel = () => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setHealthCheckRating(0);
    setSelectedCodes([]);
    setDischargeDate('');
    setDischargeCriteria('');
    setEmployerName('');
    setSickLeaveStart('');
    setSickLeaveEnd('');
    setError('');
    setVisible(false);
  };

  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedCodes(selected);
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
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>New {entryType} entry</h3>
        <div>
          <div style={fieldStyle}>
            <label htmlFor="entryType" style={labelStyle}>Entry Type</label>
            <select
              id="entryType"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare')}
              style={inputStyle}
            >
              <option value="HealthCheck">Health Check</option>
              <option value="Hospital">Hospital</option>
              <option value="OccupationalHealthcare">Occupational Healthcare</option>
            </select>
          </div>
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
          {entryType === 'HealthCheck' && (
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
          )}
          {entryType === 'Hospital' && (
            <>
              <div style={fieldStyle}>
                <label htmlFor="dischargeDate" style={labelStyle}>Discharge Date</label>
                <input
                  id="dischargeDate"
                  type="date"
                  value={dischargeDate}
                  onChange={(e) => setDischargeDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label htmlFor="dischargeCriteria" style={labelStyle}>Discharge Criteria</label>
                <input
                  id="dischargeCriteria"
                  type="text"
                  value={dischargeCriteria}
                  onChange={(e) => setDischargeCriteria(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}
          {entryType === 'OccupationalHealthcare' && (
            <>
              <div style={fieldStyle}>
                <label htmlFor="employerName" style={labelStyle}>Employer Name</label>
                <input
                  id="employerName"
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={fieldStyle}>
                <label htmlFor="sickLeaveStart" style={labelStyle}>Sick Leave Start Date</label>
                <input
                  id="sickLeaveStart"
                  type="date"
                  value={sickLeaveStart}
                  onChange={(e) => setSickLeaveStart(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label htmlFor="sickLeaveEnd" style={labelStyle}>Sick Leave End Date</label>
                <input
                  id="sickLeaveEnd"
                  type="date"
                  value={sickLeaveEnd}
                  onChange={(e) => setSickLeaveEnd(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}
          <div style={fieldStyle}>
            <label htmlFor="codes" style={labelStyle}>Diagnosis codes (hold Ctrl/Cmd to select multiple)</label>
            <select
              id="codes"
              multiple
              value={selectedCodes}
              onChange={handleDiagnosisChange}
              style={{
                ...inputStyle,
                height: '120px'
              }}
            >
              {diagnoses.map(diagnosis => (
                <option key={diagnosis.code} value={diagnosis.code}>
                  {diagnosis.code} - {diagnosis.name}
                </option>
              ))}
            </select>
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