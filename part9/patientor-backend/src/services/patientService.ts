import patients from "../data/patients";
import { Patient, SecurePatient, NewPatientEntry } from "../types";
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getSecurePatients = (): SecurePatient[] => {
  return patients.map(({id, name, dateOfBirth, gender, occupation}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatient = { id, ...patient };
  patients.push(newPatient);
  return newPatient;
};

export {
  getPatients, 
  getSecurePatients,
  addPatient
};