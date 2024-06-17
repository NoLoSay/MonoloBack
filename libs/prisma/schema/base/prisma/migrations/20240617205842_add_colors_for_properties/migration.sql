-- CreateTable
CREATE TABLE "RoleColor" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "RoleColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationStatusColor" (
    "id" SERIAL NOT NULL,
    "validationStatus" "ValidationStatus" NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "ValidationStatusColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonTypeColor" (
    "id" SERIAL NOT NULL,
    "personType" "PersonType" NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "PersonTypeColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteTypeColor" (
    "id" SERIAL NOT NULL,
    "siteType" "SiteType" NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "SiteTypeColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteTagColor" (
    "id" SERIAL NOT NULL,
    "siteTag" "SiteTag" NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "SiteTagColor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleColor_role_key" ON "RoleColor"("role");

-- CreateIndex
CREATE UNIQUE INDEX "ValidationStatusColor_validationStatus_key" ON "ValidationStatusColor"("validationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "PersonTypeColor_personType_key" ON "PersonTypeColor"("personType");

-- CreateIndex
CREATE UNIQUE INDEX "SiteTypeColor_siteType_key" ON "SiteTypeColor"("siteType");

-- CreateIndex
CREATE UNIQUE INDEX "SiteTagColor_siteTag_key" ON "SiteTagColor"("siteTag");
