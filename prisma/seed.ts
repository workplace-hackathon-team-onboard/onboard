import {prisma} from '../src/helpers/prismaClient'

// create an array of icebreaker questions
const questions = [
  { question: "What is your favorite food?" },
  { question: "What is your favorite animal?" },
  { question: "What is your favorite movie?" },
  { question: "What is your favorite song?" },
  { question: "What is your favorite TV show?" },
  { question: "What is your favorite sport?" },
  ]



// create a function to insert questions into the database
const insertQuestions = async () => {
  for (let {question} of questions) {
    await prisma.question.upsert({
      create: {
        question,
        createdAt: new Date(),
      },
      update: {},
      where: {}
    });
  }
}


insertQuestions()
