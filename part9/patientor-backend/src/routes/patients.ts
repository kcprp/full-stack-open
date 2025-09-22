import { Router, Response } from "express";
import { getSecurePatients, addPatient } from "../services/patientService";
import { SecurePatient } from "../types";
import toNewPatientEntry from "../utils";

const router = Router();

router.get('/', (_req, res: Response<SecurePatient[]>) => {
  res.send(getSecurePatients());
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedPatient = addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;