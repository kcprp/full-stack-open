import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import { Patient, Diagnosis } from "../../types";
import Entry from "../Entry.tsx";
import AddEntryForm from "./AddEntryForm.tsx";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const getGenderIcon = (gender: string) => {
  switch (gender) {
    case "male":
      return <MaleIcon />;
    case "female":
      return <FemaleIcon />;
    default:
      return <QuestionMarkIcon />;
  }
};

interface PatientPageProps {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: PatientPageProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async (id: string | undefined) => {
      if (!id) return;

      try {
        const patient = await patientService.getPatient(id);
        if (!patient) {
          setPatient(null);
          return;
        }
        setPatient(patient);
        setError(false);
        console.log(patient);
      } catch (error) {
        console.error("Failed to fetch patient:", error);
        setError(true);
      }
    };

    fetchUser(id);
  }, [id]);

  const getNameFromCode = (code: string) => {
    return diagnoses.find(diagnosis => diagnosis.code === code)?.name;
  };

  if (!patient) return <h2>Loading...</h2>;

  if (error) return <h2 style={{ color: 'red' }}>Failed to load patient</h2>; 

  return (
    <div className="patient-page">
      <div style={{ display: 'flex', gap: "5px" }}>
        <h2>{patient.name}</h2>
        <div style={{ marginTop: "20px" }}>
          {getGenderIcon(patient.gender)}
        </div>
      </div>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <AddEntryForm 
        id={id!}
        visible={visible}
        setVisible={setVisible}
        setPatient={setPatient}
        diagnoses={diagnoses}
      />
      {patient.entries && 
      <div>
        <h3>entries</h3>
        {patient.entries.map(entry =>
          <Entry entry={entry} getNameFromCode={getNameFromCode} key={entry.id} />
        )}
        <button 
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            marginTop: '10px',
            cursor: 'pointer'
          }}
          onClick={() => setVisible(prev => !prev)}
        >
          ADD NEW ENTRY
        </button>
      </div>
      }
    </div>
  );
};

export default PatientPage;