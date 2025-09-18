import express from 'express';
import calculateBmi from './bmiCalculator';
import { calculateExercies, Result } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
}); 

app.get('/bmi', (req, res) => {
  const heightParam = req.query.height;
  const weightParam = req.query.weight;

  if (typeof heightParam !== 'string' || typeof weightParam !== 'string') {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const height = Number(heightParam);
  const weight = Number(weightParam);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const response: string = calculateBmi(height, weight);
  const responseObj = {
    weight,
    height,
    bmi: response
  };
  return res.json(responseObj);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }
  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
  if (!daily_exercises.every((n: unknown) => typeof n === 'number')) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const result: Result = calculateExercies(daily_exercises, Number(target));
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
