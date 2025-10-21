import { Request, Response } from "express";
import { fineService } from "./fine.service.js";

export const fineController = {
  async getAll(_req: Request, res: Response) {
    const fines = await fineService.getAll();
    res.json(fines);
  },
};

