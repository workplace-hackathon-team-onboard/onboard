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
      where: {
        question,
      }
    });
  }
}

const insertUsers = async () => {
  const users = [
    {
      name: "Connor",
      email: "john@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Brian",
      email: "brian@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Noah",
      email: "noah@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Reece",
      email: "reece@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  for (let user of users) {
    const res = await prisma.user.upsert({
      create: user,
      update: {},
      where: {
        email: user.email
      },
    });
  }

}

insertUsers()
  .then(insertQuestions);

