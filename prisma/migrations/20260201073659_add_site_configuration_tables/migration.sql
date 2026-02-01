-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL DEFAULT 'settings',
    "isMaintenance" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT DEFAULT 'Hệ thống đang bảo trì để nâng cấp.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteConfiguration" (
    "id" TEXT NOT NULL DEFAULT 'global_config',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMsg" TEXT DEFAULT 'Chúng tôi đang nâng cấp hệ thống để mang lại trải nghiệm tốt hơn.',
    "maintenanceStart" TIMESTAMP(3),
    "maintenanceEnd" TIMESTAMP(3),
    "bypassTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "SiteConfiguration_pkey" PRIMARY KEY ("id")
);
