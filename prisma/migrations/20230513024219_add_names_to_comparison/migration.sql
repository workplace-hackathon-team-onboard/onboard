/*
  Warnings:

  - You are about to drop the column `userId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `newStarterName` to the `Comparison` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamMemberName` to the `Comparison` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);
INSERT INTO "new_Question" ("createdAt", "id", "question") SELECT "createdAt", "id", "question" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");
CREATE TABLE "new_Comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "newStarterName" TEXT NOT NULL,
    "teamMemberName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "report" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Comparison_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comparison" ("createdAt", "id", "questionId", "report", "userId") SELECT "createdAt", "id", "questionId", "report", "userId" FROM "Comparison";
DROP TABLE "Comparison";
ALTER TABLE "new_Comparison" RENAME TO "Comparison";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
