import express from 'express';
import cors from 'cors';
import { getDiagnoses } from './services/diagnosisService';
import { Diagnosis } from './types';
import { Response } from 'express';
import patientsRouter from './routes/patients';

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

app.use('/api/patients', patientsRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});