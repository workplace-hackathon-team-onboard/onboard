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
      name: 'John Smith',
      email: 'johnsmith@gmail.com',
      slackId: 'temp1',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: true,
    },
    {
      name: 'Mary Jane',
      email: 'maryjane@gmail.com',
      slackId: 'temp2',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: true,
    },
    {
      name: 'Doah Navey',
      email: 'doahnavey@gmail.com',
      slackId: 'temp3',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: true,
    },
    {
      name: 'Guy Incognito',
      email: 'guyincognito@gmail.com',
      slackId: 'temp4',
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarded: true,
    },
  ];

  for (let user of users) {
    const res = await prisma.user.upsert({
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
      id: 2,
      questionId: 1,
      answer: `I'm a big fan of sushi. The freshness of the fish, the delicate flavors, and the beautiful presentation make it a culinary delight for me. Whether it's sashimi, nigiri, or maki rolls, I always enjoy the experience.`,
      userId: 2,
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
