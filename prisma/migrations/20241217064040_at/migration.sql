/*
  Warnings:

  - You are about to drop the column `quantity` on the `GoodsOrderInfo` table. All the data in the column will be lost.
  - Added the required column `number` to the `GoodsOrderInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GoodsOrderInfo` DROP COLUMN `quantity`,
    ADD COLUMN `number` INTEGER NOT NULL;
