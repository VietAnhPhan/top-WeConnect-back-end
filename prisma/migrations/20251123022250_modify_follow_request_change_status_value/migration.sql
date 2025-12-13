/*
  Warnings:

  - The `status` column on the `FollowRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."FollowRequest" DROP COLUMN "status",
ADD COLUMN     "status" "public"."FollowStatus" NOT NULL DEFAULT 'following';
