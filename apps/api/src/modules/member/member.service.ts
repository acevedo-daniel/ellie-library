import { prisma } from "../../lib/prisma.js";

export const memberService = {
  getAll() {
    return prisma.member.findMany();
  },
  create(data: { dni: string; name: string; member_id?: number }) {
    const { dni, name, member_id } = data;
    return prisma.member.create({
      data: {
        dni,
        name,
        ...(member_id !== undefined ? { member_id } : {}),
      },
    });
  },
};
