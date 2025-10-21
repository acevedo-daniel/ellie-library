import { prisma } from "../../lib/prisma.js";

export const fineService = {
  getAll() {
    return prisma.fine.findMany({ include: { member: true, loan: true } });
  },
};

