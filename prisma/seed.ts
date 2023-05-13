import { prisma } from '../src/helpers/prismaClient';

// create an array of icebreaker questions
const questions = [
  { question: 'What is your favorite food?' },
  { question: 'What is your favorite animal?' },
  { question: 'What is your favorite movie?' },
  { question: 'What is your favorite song?' },
  { question: 'What is your favorite TV show?' },
  { question: 'What is your favorite sport?' },
];

// create a function to insert questions into the database
const insertQuestions = async () => {
  for (let { question } of questions) {
    await prisma.question.upsert({
      create: {
        question,
        createdAt: new Date(),
      },
      update: {},
      where: {
        question,
      },
    });
  }
};

const insertUsers = async () => {
  const users = [
    {
      name: 'Connor',
      email: 'connor_monaghan@hotmail.com',
      slackId: 'U0576N70Z8F',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: true,
    },
    {
      name: 'Brian',
      email: 'b.riwukaho@gmail.com',
      slackId: 'U057ZTF981F',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: false,
    },
    {
      name: 'Noah',
      email: 'noah.davey@gmail.com',
      slackId: 'U0576N72UKZ',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: true,
    },
    {
      name: 'Reece',
      email: 'fenwickreece08@gmail.com',
      slackId: 'U057M4QUE75',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: true,
    },
  ];

  for (let user of users) {
    await prisma.user.upsert({
      create: user,
      update: user,
      where: {
        email: user.email,
      },
    });
  }
};

const insertAnswers = async () => {
  const answers = [
    {
      id: 1,
      questionId: 1,
      answer: `My favorite food is pizza. I love the combination of flavors from the melted cheese, tangy tomato sauce, and various toppings. It's a classic comfort food that always satisfies my cravings.`,
      userId: 1,
      createdAt: new Date(),
    },
    {
      id: 3,
      questionId: 1,
      answer: `I have a sweet tooth, so my favorite food is chocolate. Whether it's a rich dark chocolate bar, a decadent chocolate cake, or even a simple chocolate chip cookie, I can't resist the indulgent taste and smooth texture.`,
      userId: 3,
      createdAt: new Date(),
    },
    {
      id: 4,
      questionId: 1,
      answer: `I absolutely adore Mexican cuisine, so my favorite food is tacos. The combination of seasoned meat, fresh vegetables, salsa, and the crunch of the tortilla shell creates a burst of flavors and textures that I find incredibly satisfying.`,
      userId: 4,
      createdAt: new Date(),
    },
  ];

  for (let answer of answers) {
    await prisma.answer.upsert({
      where: { id: answer.id },
      create: answer,
      update: answer,
    });
  }
};

insertUsers().then(insertQuestions).then(insertAnswers);
