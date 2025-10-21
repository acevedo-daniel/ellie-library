import { prisma } from "../../lib/prisma.js";

export const bookService = {
  getAll() {
    return prisma.book.findMany();
  },
  getByIsbn(isbn: string) {
    return prisma.book.findUnique({ where: { isbn } });
  },
  create(data: {
    isbn: string;
    title: string;
    author: string;
    state?: "AVAILABLE" | "LOANED" | "DAMAGED";
  }) {
    return prisma.book.create({ data });
  },
  update(
    isbn: string,
    data: Partial<{
      title: string;
      author: string;
      state: "AVAILABLE" | "LOANED" | "DAMAGED";
    }>
  ) {
    return prisma.book.update({ where: { isbn }, data });
  },
  remove(isbn: string) {
    return prisma.book.delete({ where: { isbn } });
  },
};
