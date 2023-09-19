-- CreateTable
CREATE TABLE "Block" (
    "id" STRING NOT NULL,
    "type" STRING NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteData" (
    "id" STRING NOT NULL,
    "time" INT4 NOT NULL,
    "blocks" JSONB NOT NULL,
    "version" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteData_pkey" PRIMARY KEY ("id")
);
