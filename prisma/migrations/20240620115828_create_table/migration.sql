/*
  Warnings:

  - A unique constraint covering the columns `[id_user_water_supplier]` on the table `water_suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_user_water_supplier` to the `water_suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "water_suppliers" ADD COLUMN     "id_user_water_supplier" VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE "user_water_suppliers" (
    "id" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "user_water_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_water_suppliers_email_key" ON "user_water_suppliers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "water_suppliers_id_user_water_supplier_key" ON "water_suppliers"("id_user_water_supplier");

-- AddForeignKey
ALTER TABLE "water_suppliers" ADD CONSTRAINT "water_suppliers_id_user_water_supplier_fkey" FOREIGN KEY ("id_user_water_supplier") REFERENCES "user_water_suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
