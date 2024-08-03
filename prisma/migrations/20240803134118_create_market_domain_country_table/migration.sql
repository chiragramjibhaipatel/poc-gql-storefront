-- CreateTable
CREATE TABLE "MarketsDomainCountry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketsDomainCountry_domain_key" ON "MarketsDomainCountry"("domain");
