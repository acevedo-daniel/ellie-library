import { z } from "zod";

export const createLoanSchema = z.object({
  body: z.object({
    member_id: z.number().int().positive(),
    book_isbn: z.string().min(1),
  }),
});

export const returnLoanSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[\d]+$/)
      .transform(Number),
  }),
  body: z
    .object({
      damaged: z.boolean().optional(),
    })
    .optional(),
});
