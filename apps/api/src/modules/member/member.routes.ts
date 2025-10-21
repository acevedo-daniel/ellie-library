import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { memberController } from "./member.controller.js";
import { createMemberSchema } from "./member.schemas.js";

const router = Router();

router.get("/", memberController.getAllMembers);
router.post("/", validate(createMemberSchema), memberController.createMember);

export { router as memberRouter };
