import { Router, Request, Response, NextFunction } from "express";
import { getSecurePatients, getPatientInfo, addPatient, addEntry } from "../services/patientService";
import { NewPatientEntry, SecurePatient, Patient, NewEntry } from "../types";
import { NewPatientSchema, NewEntrySchema } from "../utils";
import { z } from 'zod';

const router = Router();

router.get('/', (_req, res: Response<SecurePatient[]>) => {
  res.send(getSecurePatients());
});

router.get('/:id', (req, res: Response<SecurePatient>) => {
  const id = req.params.id;
  res.send(getPatientInfo(id));
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (req: Request, res: Response<Patient>) => {
  const addedPatient = addPatient(req.body as NewPatientEntry);
  res.json(addedPatient);
});

router.post('/:id/entries', newEntryParser, (req: Request, res) => {
  const id = req.params.id;
  const addedEntry = addEntry(id, req.body as NewEntry);
  
  if (!addedEntry) {
    res.status(404).send({ error: 'Patient not found' });
    return;
  }
  
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;