import { Request, Response } from "express";
import { memberService } from "./member.service.js";

export const memberController = {
  async getAllMembers(_req: Request, res: Response) {
    const members = await memberService.getAll();
    res.json(members);
  },

  async createMember(req: Request, res: Response) {
    try {
      const created = await memberService.create(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      if (e.code === "P2002") {
        return res
          .status(409)
          .json({ message: "Ya existe un socio con ese DNI o member_id." });
      }
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },
};
