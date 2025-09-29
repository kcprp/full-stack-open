import patients from "../data/patients";
import { Patient, SecurePatient, NewPatientEntry, NonSensitivePatient } from "../types";
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getSecurePatients = (): SecurePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const getPatientInfo = (patientId: string): NonSensitivePatient & { entries: [] } | undefined => {
  const patient = patients.find(({ id }) => id === patientId);
  if (!patient) {
    return undefined;
  }
  const { id, name, dateOfBirth, gender, occupation } = patient;
  return { id, name, dateOfBirth, gender, occupation, entries: [] };
};

const addPatient = (patient: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatient = { id, entries: [] , ...patient };
  patients.push(newPatient);
  return newPatient;
};

export {
  getPatients, 
  getSecurePatients,
  addPatient,
  getPatientInfo
};