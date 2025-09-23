import { Router, Request, Response, NextFunction } from "express";
import { getSecurePatients, addPatient } from "../services/patientService";
import { NewPatientEntry, SecurePatient, Patient } from "../types";
import { NewPatientSchema } from "../utils";
import { z } from 'zod';

const router = Router();

router.get('/', (_req, res: Response<SecurePatient[]>) => {
  res.send(getSecurePatients());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
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

router.use(errorMiddleware);

export default router;