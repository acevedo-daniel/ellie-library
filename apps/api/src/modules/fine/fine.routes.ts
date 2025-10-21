import { Router } from "express";
import { fineController } from "./fine.controller.js";

const router = Router();

router.get("/", fineController.getAll);

export { router as fineRouter };

