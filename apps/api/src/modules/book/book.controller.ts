import { Request, Response } from "express";
import { bookService } from "./book.service.js";

export const bookController = {
  async list(_req: Request, res: Response) {
    res.json(await bookService.getAll());
  },
  async get(req: Request, res: Response) {
    const book = await bookService.getByIsbn(req.params.isbn);
    if (!book) return res.status(404).json({ message: "Libro no encontrado" });
    res.json(book);
  },
  async create(req: Request, res: Response) {
    try {
      const created = await bookService.create(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      if (e.code === "P2002")
        return res.status(409).json({ message: "ISBN ya existente" });
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const updated = await bookService.update(req.params.isbn, req.body);
      res.json(updated);
    } catch (e: any) {
      if (e.code === "P2025")
        return res.status(404).json({ message: "Libro no encontrado" });
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async remove(req: Request, res: Response) {
    try {
      await bookService.remove(req.params.isbn);
      res.status(204).send();
    } catch (e: any) {
      if (e.code === "P2025")
        return res.status(404).json({ message: "Libro no encontrado" });
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
