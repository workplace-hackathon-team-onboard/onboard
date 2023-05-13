/*
  Warnings:

  - You are about to drop the column `userId` on the `Question` table. All the data in the column will be lost.

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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
