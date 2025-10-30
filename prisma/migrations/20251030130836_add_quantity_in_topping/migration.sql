/*
  Warnings:

  - Added the required column `quantity` to the `Topping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Topping" ADD COLUMN     "quantity" INTEGER NOT NULL;
