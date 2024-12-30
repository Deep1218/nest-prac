-- CreateEnum
CREATE TYPE "activities_type_enum" AS ENUM ('new memeber add', 'memeber loged in', 'memeber created a new post');

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "type" "activities_type_enum" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id")
);
