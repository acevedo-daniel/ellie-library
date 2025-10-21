-- AlterTable
CREATE SEQUENCE members_member_id_seq;
ALTER TABLE "members" ALTER COLUMN "member_id" SET DEFAULT nextval('members_member_id_seq');
ALTER SEQUENCE members_member_id_seq OWNED BY "members"."member_id";
