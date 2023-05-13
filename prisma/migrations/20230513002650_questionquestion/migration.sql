/*
  Warnings:

  - Added the required column `question` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);
INSERT INTO "new_Question" ("createdAt", "id") SELECT "createdAt", "id" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
