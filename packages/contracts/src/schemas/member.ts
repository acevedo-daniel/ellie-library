import { z } from "zod";

export const MemberSchema = z.object({
  member_id: z.number().int().positive(),
  dni: z.string().min(6),
  name: z.string().min(1),
});

export type Member = z.infer<typeof MemberSchema>;
