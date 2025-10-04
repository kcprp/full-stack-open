import { Gender, HealthCheckRating } from "./types";
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

const parseDiagnosisCodes = (object: unknown): Array<string> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<string>;
  }

  return object.diagnosisCodes as Array<string>;
};

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().refine((date) => {
    return Boolean(Date.parse(date));
  }, {
    message: "Invalid date format"
  }),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

const SickLeaveSchema = z.object({
  startDate: z.string(),
  endDate: z.string()
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional()
});

const DischargeSchema = z.object({
  date: z.string(),
  criteria: z.string()
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: DischargeSchema.optional()
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema
]);

export { parseDiagnosisCodes };