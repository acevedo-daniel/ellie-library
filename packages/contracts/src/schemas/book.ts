import { z } from "zod";

export const BookSchema = z.object({
  isbn: z.string().min(3, "ISBN mínimo 3 caracteres"),
  title: z.string().min(1, "Título requerido"),
  author: z.string().min(1, "Autor requerido"),
  state: z.enum(["AVAILABLE", "LOANED", "DAMAGED"]),
});

export type Book = z.infer<typeof BookSchema>;
