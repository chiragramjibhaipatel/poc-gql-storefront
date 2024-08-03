/*
  Warnings:

  - A unique constraint covering the columns `[shop]` on the table `Storefront` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Storefront_shop_key" ON "Storefront"("shop");
