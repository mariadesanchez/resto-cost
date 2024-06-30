/*
  Warnings:

  - Added the required column `moza` to the `Pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedidos" ADD COLUMN     "moza" TEXT NOT NULL;
