import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "express";

import { memberRouter } from "./modules/member/member.routes.js";
import { bookRouter } from "./modules/book/book.routes.js";
import { loanRouter } from "./modules/loan/loan.routes.js";
import { fineRouter } from "./modules/fine/fine.routes.js";

const app = express();
app.use(cors());
app.use(json());

app.use("/members", memberRouter);
app.use("/books", bookRouter);
app.use("/loans", loanRouter);
app.use("/fines", fineRouter);

// middleware de error final
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`📚 API running http://localhost:${PORT}`));
