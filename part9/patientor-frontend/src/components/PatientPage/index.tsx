import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import { Patient } from "../../types";
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

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<boolean>(false);
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
      <p>occupation: {patient.occupation}</p>
      {patient.entries && 
      <div>
        <h3>entries</h3>
        {patient.entries.map(entry =>
          <div key={entry.id}>
            <p>{entry.date} {entry.description}</p>
            <ul>
              {entry?.diagnosisCodes?.map(code =>
                <li key={code}>{code}</li>
              )}
            </ul>
          </div>
        )}
      </div>
      }
    </div>
  );
};

export default PatientPage;