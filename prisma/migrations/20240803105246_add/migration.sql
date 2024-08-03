/*
  Warnings:

  - Added the required column `sccessScope` to the `Storefront` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Storefront" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "sccessScope" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Storefront" ("accessToken", "createdAt", "id", "shop", "updatedAt") SELECT "accessToken", "createdAt", "id", "shop", "updatedAt" FROM "Storefront";
DROP TABLE "Storefront";
ALTER TABLE "new_Storefront" RENAME TO "Storefront";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
