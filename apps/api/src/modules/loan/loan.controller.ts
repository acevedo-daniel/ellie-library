import { Request, Response } from "express";
import { loanService } from "./loan.service.js";

export const loanController = {
  async createLoan(req: Request, res: Response) {
    try {
      const loan = await loanService.create(req.body);
      res.status(201).json(loan);
    } catch (e: any) {
      if (e?.name === "BusinessError") {
        return res.status(409).json({ message: e.message });
      }
      if (e.code === "P2002") {
        return res.status(409).json({
          message: "El libro ya se encuentra prestado (préstamo activo).",
        });
      }
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  async returnLoan(req: Request, res: Response) {
    try {
      const damaged = Boolean(req.body?.damaged);
      const loan = await loanService.returnBook(Number(req.params.id), damaged);
      res.json(loan);
    } catch (e: any) {
      if (e.code === "P2025") {
        return res
          .status(404)
          .json({ message: "Préstamo no encontrado o ya fue devuelto." });
      }
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  async getAllLoans(_req: Request, res: Response) {
    res.json(await loanService.getAll());
  },
};
