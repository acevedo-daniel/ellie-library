-- CreateTable
CREATE TABLE "fines" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "loan_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fines_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "fines_loan_id_key" ON "fines"("loan_id");
CREATE INDEX "fines_member_id_idx" ON "fines"("member_id");

-- Foreign Keys
ALTER TABLE "fines" ADD CONSTRAINT "fines_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "fines" ADD CONSTRAINT "fines_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

