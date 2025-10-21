import { z } from "zod";

export const createBookSchema = z.object({
  body: z.object({
    isbn: z.string().min(3),
    title: z.string().min(1),
    author: z.string().min(1),
    state: z
      .enum(["AVAILABLE", "LOANED", "DAMAGED"])
      .optional()
      .default("AVAILABLE"),
  }),
});

export const updateBookSchema = z.object({
  params: z.object({
    isbn: z.string().min(3),
  }),
  body: z
    .object({
      title: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      state: z.enum(["AVAILABLE", "LOANED", "DAMAGED"]).optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "Nada para actualizar",
    }),
});
