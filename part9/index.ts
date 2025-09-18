import express from 'express';
import calculateBmi from './bmiCalculator';

const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
