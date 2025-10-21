import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "@prisma/client";

class BusinessError extends Error {}

export const loanService = {
  async create(data: { member_id: number; book_isbn: string }) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const book = await tx.book.findUnique({
        where: { isbn: data.book_isbn },
      });

      if (!book) throw new BusinessError("Libro no encontrado.");
      if (book.state !== "AVAILABLE") {
        throw new BusinessError("El libro no está disponible.");
      }

      const loan = await tx.loan.create({
        data: {
          member_id: data.member_id,
          book_isbn: data.book_isbn,
          // start_date usa default(now()) en DB
        },
      });

      await tx.book.update({
        where: { isbn: data.book_isbn },
        data: { state: "LOANED" },
      });

      return loan;
    });
  },

  async returnBook(id: number, damaged: boolean = false) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const loan = await tx.loan.update({
        where: { id, return_date: null },
        data: { return_date: new Date() },
      });

      await tx.book.update({
        where: { isbn: loan.book_isbn },
        data: { state: damaged ? "DAMAGED" : "AVAILABLE" },
      });

      // Si el libro fue devuelto dañado, registrar una multa asociada
      if (damaged) {
        await (tx as any).fine.create({
          data: {
            member_id: loan.member_id,
            loan_id: loan.id,
            amount: 0, // Monto por defecto; puede ajustarse por política
            reason: "Libro dañado",
          },
        });
      }

      return loan;
    });
  },

  async getAll() {
    return prisma.loan.findMany({
      include: { book: true, member: true, fine: true },
    });
  },
};
