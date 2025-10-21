import { z } from "zod";

export const createMemberSchema = z.object({
  body: z.object({
    dni: z.string().min(6),
    name: z.string().min(1),
    member_id: z.number().int().positive().optional(),
  }),
});
