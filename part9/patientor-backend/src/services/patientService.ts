import patients from "../data/patients";
import { Patient, SecurePatient } from "../types";

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

export {
  getPatients, 
  getSecurePatients
};