/*
  Warnings:

  - You are about to drop the column `domain` on the `MarketsDomainCountry` table. All the data in the column will be lost.
  - Added the required column `url` to the `MarketsDomainCountry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MarketsDomainCountry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MarketsDomainCountry" ("createdAt", "id", "isoCode", "locale", "marketId", "shop", "updatedAt") SELECT "createdAt", "id", "isoCode", "locale", "marketId", "shop", "updatedAt" FROM "MarketsDomainCountry";
DROP TABLE "MarketsDomainCountry";
ALTER TABLE "new_MarketsDomainCountry" RENAME TO "MarketsDomainCountry";
CREATE UNIQUE INDEX "MarketsDomainCountry_url_key" ON "MarketsDomainCountry"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
