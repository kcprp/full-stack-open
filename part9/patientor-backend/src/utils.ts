import { Gender } from "./types";
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().refine((date) => {
    return Boolean(Date.parse(date));
  }, {
    message: "Invalid date format"
  }),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});
