import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { bookController } from "./book.controller.js";
import { createBookSchema, updateBookSchema } from "./book.schemas.js";

const router = Router();

router.get("/", bookController.list);
router.get("/:isbn", bookController.get);
router.post("/", validate(createBookSchema), bookController.create);
router.patch("/:isbn", validate(updateBookSchema), bookController.update);
router.delete("/:isbn", bookController.remove);

export { router as bookRouter };
