import express from 'express';
import cors from 'cors';
import { getDiagnoses } from './services/diagnosisService';
import { getSecurePatients } from './services/patientService';
import { Diagnosis, SecurePatient } from './types';
import { Response } from 'express';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res: Response<Diagnosis[]>) => {
  res.send(getDiagnoses());
});

app.get('/api/patients', (_req, res: Response<SecurePatient[]>) => {
  res.send(getSecurePatients());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});