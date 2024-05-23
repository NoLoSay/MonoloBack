-- CreateTable
CREATE TABLE "UserActionLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensitiveActionLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SensitiveActionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserActionLog" ADD CONSTRAINT "UserActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensitiveActionLog" ADD CONSTRAINT "SensitiveActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
