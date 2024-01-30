-- CreateTable
CREATE TABLE "todo" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "todo_pkey" PRIMARY KEY ("id")
);
