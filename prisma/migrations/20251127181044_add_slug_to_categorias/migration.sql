/*
  Warnings:

  - Added the required column `slug` to the `categorias` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categorias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cor" TEXT,
    "imagemUrl" TEXT,
    "clienteId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categorias_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_categorias" ("clienteId", "createdAt", "id", "nome", "updatedAt") SELECT "clienteId", "createdAt", "id", "nome", "updatedAt" FROM "categorias";
DROP TABLE "categorias";
ALTER TABLE "new_categorias" RENAME TO "categorias";
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
