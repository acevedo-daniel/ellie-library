import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export const LoanSchema = z.object({
  id: z.number().int().positive(),
  member_id: z.number().int().positive(),
  book_isbn: z.string().min(3),
  start_date: z.string().regex(isoDateRegex, "Debe ser una fecha ISO válida"),
  return_date: z
    .string()
    .regex(isoDateRegex, "Debe ser una fecha ISO válida")
    .nullable(),
});

export type Loan = z.infer<typeof LoanSchema>;
