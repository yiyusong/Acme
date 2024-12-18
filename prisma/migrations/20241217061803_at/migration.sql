/*
  Warnings:

  - You are about to drop the column `addressId` on the `GoodsOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GoodsOrder` DROP COLUMN `addressId`,
    ADD COLUMN `shippingAddress` VARCHAR(191) NULL,
    ADD COLUMN `shippingArea` VARCHAR(191) NULL,
    ADD COLUMN `shippingCity` VARCHAR(191) NULL,
    ADD COLUMN `shippingName` VARCHAR(191) NULL,
    ADD COLUMN `shippingPhone` VARCHAR(191) NULL,
    ADD COLUMN `shippingProvince` VARCHAR(191) NULL;
