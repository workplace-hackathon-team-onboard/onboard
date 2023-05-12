/*
  Warnings:

  - You are about to drop the column `email` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `user` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "report" TEXT NOT NULL,
    CONSTRAINT "Comparison_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "answer" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("answer", "createdAt", "id", "questionId") SELECT "answer", "createdAt", "id", "questionId" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
