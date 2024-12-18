-- AlterTable
ALTER TABLE `Goods` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `GoodsAttribute` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `GoodsAttributeValue` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `GoodsOrder` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ShippingAddress` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Sku` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `updatedAt` DATETIME(3) NULL;
