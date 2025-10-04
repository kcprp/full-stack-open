import patients from "../data/patients";
import { Patient, SecurePatient, NewPatientEntry, Entry, NewEntry } from "../types";
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

const getPatientInfo = (patientId: string): SecurePatient | undefined => {
  const patient = patients.find(({ id }) => id === patientId);
  if (!patient) return undefined;
  
  const { id, name, dateOfBirth, gender, occupation, entries } = patient;
  return { id, name, dateOfBirth, gender, occupation, entries };
};

const addPatient = (patient: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatient = { id, entries: [] , ...patient };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = patients.find(patient => patient.id === patientId);
  if (!patient) return undefined;

  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return newEntry;  
};

export {
  getPatients, 
  getSecurePatients,
  addPatient,
  getPatientInfo,
  addEntry
};