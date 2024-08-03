/*
  Warnings:

  - Added the required column `locale` to the `MarketsDomainCountry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketId` to the `MarketsDomainCountry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MarketsDomainCountry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MarketsDomainCountry" ("createdAt", "domain", "id", "isoCode", "shop", "updatedAt") SELECT "createdAt", "domain", "id", "isoCode", "shop", "updatedAt" FROM "MarketsDomainCountry";
DROP TABLE "MarketsDomainCountry";
ALTER TABLE "new_MarketsDomainCountry" RENAME TO "MarketsDomainCountry";
CREATE UNIQUE INDEX "MarketsDomainCountry_domain_key" ON "MarketsDomainCountry"("domain");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
