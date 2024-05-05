/*
  Warnings:

  - The values [pescado] on the enum `Plato` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Plato_new" AS ENUM ('carne', 'pastas', 'kid', 'vegetales', 'pescados');
ALTER TABLE "Product" ALTER COLUMN "plato" TYPE "Plato_new" USING ("plato"::text::"Plato_new");
ALTER TYPE "Plato" RENAME TO "Plato_old";
ALTER TYPE "Plato_new" RENAME TO "Plato";
DROP TYPE "Plato_old";
COMMIT;
