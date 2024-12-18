/*
  Warnings:

  - You are about to drop the column `goodsId` on the `GoodsOrder` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `GoodsOrder` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `GoodsOrder` table. All the data in the column will be lost.
  - You are about to drop the column `skuId` on the `GoodsOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GoodsOrder` DROP COLUMN `goodsId`,
    DROP COLUMN `price`,
    DROP COLUMN `quantity`,
    DROP COLUMN `skuId`;

-- CreateTable
CREATE TABLE `GoodsOrderInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `goodsId` INTEGER NOT NULL,
    `skuId` INTEGER NOT NULL,
    `goodsName` VARCHAR(191) NOT NULL,
    `goodsImage` VARCHAR(191) NOT NULL,
    `properties` JSON NOT NULL,
    `originalPrice` DECIMAL(10, 2) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GoodsOrderInfo_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GoodsOrderInfo` ADD CONSTRAINT `GoodsOrderInfo_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `GoodsOrder`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
