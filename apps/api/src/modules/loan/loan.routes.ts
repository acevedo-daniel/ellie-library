import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { loanController } from "./loan.controller.js";
import { createLoanSchema, returnLoanSchema } from "./loan.schemas.js";

const router = Router();

router.get("/", loanController.getAllLoans);
router.post("/", validate(createLoanSchema), loanController.createLoan);
router.post(
  "/:id/return",
  validate(returnLoanSchema),
  loanController.returnLoan
);

export { router as loanRouter };
