import { App } from '@slack/bolt';
import { prisma } from '../helpers/prismaClient';
import { generateComparison } from '../service/comparisonService';
import { blocks } from './blockBuilders';
import {getNextUnansweredQuestion} from "../service/questionService";

interface Question {
  questionId: number;
  question: string;
}

interface QAArgs {
  slackUserId: string;
  questions: Question[];
}

const app = new App({
  token: process.env.SLACK_TOKEN,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  // botId: 'B057ANMKK54',
  // stateSecret: 'my-secret',
  // scopes: ['calls:write', 'channels:history', 'channels:read', 'chat:write', 'im:write', 'users:read', 'users:read.email'],
  // redirectUri: 'https://91dc-49-255-91-18.ngrok-free.app/slack/oauth_redirect',
  // installationStore: new FileInstallationStore({baseDir: './file', historicalDataEnabled: false, clientId: '5225133679798.5255377016402' }),
});

app.event('member_joined_channel', async ({ event, client }) => {
  console.log('member joined channel', event);
  const userInfo = await client.users.info({ user: event.user });
  if (userInfo.user) {
    const email = userInfo.user.profile.email;
    const name = userInfo.user.profile.real_name;
    const slackId = userInfo.user.id;
    const user = await prisma.user.upsert({
      create: {
        email,
        name,
        slackId,
        createdAt: new Date(),
        updatedAt: new Date(),
        onboarded: false,
      },
      update: {
        slackId,
        onboarded: false,
        email,
        name
      },
      where: {
        email: email,
      },
    });
    console.log('new user onboarded', user);

    const question = await getNextUnansweredQuestion(user.id);

    if (question) {
      await sendQA({
        slackUserId: user.slackId,
        questions: [{
          questionId: question.id,
          question: question.question
        }]
      })
    }

  } else {
    console.error('no user info found for user: ', event);
  }
});

app.action('submit_question', async ({ ack, say, body, client }) => {
  await ack();
  // eslint-disable-next-line
  // @ts-ignore
  const questionIds = Object.keys(body.state.values.question_block);
  const userInfo = await client.users.info({ user: body.user.id });
  const email = userInfo.user.profile.email;
  const prismaUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!prismaUser) {
    console.error(
      'Could not find user by email', email
    )
    return;
  }

  console.log(JSON.stringify(body, null, 2));
  console.log(prismaUser);

  for (const questionId of questionIds) {
    // eslint-disable-next-line
    // @ts-ignore
    const answer = body.state.values.question_block[questionId].value;

    const prismaAnswer = await prisma.answer.create({
      data: {
        answer: answer,
        question: {
          connect: {
            id: Number(questionId),
          }
        },
        createdAt: new Date(),
        User: {
          connect: {
            id: prismaUser.id,
          }
        }
      },
    });

    const comparisons = await generateComparison(prismaAnswer, prismaUser);
    const response = await app.client.conversations.open({
      users: prismaUser.slackId,
    });

    const channelId = response.channel.id;
    await app.client.chat.postMessage({
      channel: channelId,
      blocks: [
        ...blocks.comparisonInsights(comparisons),
      ],
    });

    console.log('the answer is', answer);

    const question = await getNextUnansweredQuestion(prismaUser.id);

    if (question) {
      await sendQA({
        slackUserId: prismaUser.slackId,
        questions: [{
          questionId: question.id,
          question: question.question
        }]
      })
    }

  }
});

export async function getSlackUserByEmail(email: string) {
  const response = await app.client.users.lookupByEmail({ email });
  return response.user;
}

export async function sendQA(qaArgs: QAArgs) {
  // Open a conversation with the user - this is idempotent
  const response = await app.client.conversations.open({
    users: qaArgs.slackUserId,
  });

  const channelId = response.channel.id;
  console.log('asking questions in channel', channelId, qaArgs);
  await app.client.chat.postMessage({
    channel: channelId,
    blocks: [
      ...qaArgs.questions.map((question) =>
        blocks.question(question.question, 1),
      ),
      blocks.submitQuestionButton(),
    ],
  });
}

export async function sendComparisonResponse(
  slackUserId: string,
  comparisonResults: string,
) {
  const response = await app.client.conversations.open({ users: slackUserId });
  const channelId = response.channel.id;
  await app.client.chat.postMessage({
    channel: channelId,
    text: 'Welcome to the team bro',
  });
}

export async function startSlackBot(): Promise<void> {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  // app.client.oauth.v2.access({})
  // sendComparisonResponse('U057GHZBWFM', 'stuff')
  // sendQA({slackUserId: 'U057GHZBWFM', questions: [{questionId: 1, question: 'What is your name?'}]})

  // const res = await app.client.users.list()
  // console.log(res.members.map((user) => ( { id: user.id, name: user.name, email: user.} )))
}

/*
[
  { id: 'USLACKBOT', name: 'slackbot' },
  { id: 'U056D6Z8WR5', name: 'dave' },
  { id: 'U056TPRDT9Q', name: 'alex266' },
  { id: 'U056U04JG4X', name: 'valeriamichelle.ruiza' },
  { id: 'U056W701LUU', name: 'scott' },
  { id: 'U056W702XHS', name: 'alex' },
  { id: 'U056X9X111T', name: 'scott.mcdonald' },
  { id: 'U0571SLL1V5', name: 'hello348' },
  { id: 'U05725HV1TR', name: 'fenwickreece08' },
  { id: 'U0576BJC46B', name: 'samrithketisak.hun' },
  { id: 'U05785RAFGT', name: 'burton.wu' },
  { id: 'U05786SS943', name: 'lukemai1911' },
  { id: 'U0578LXGJBG', name: 'auraofintelligence' },
  { id: 'U0579QX8L2E', name: 'adamdevsmith' },
  { id: 'U057AE3U51C', name: 'devinwreeks' },
  { id: 'U057APKNCQ4', name: 'ben.aitcheson' },
  { id: 'U057AQZS0EQ', name: 'zach.barham' },
  { id: 'U057BP5KAGL', name: 'joshua.young' },
  { id: 'U057DMU9329', name: 'n11229101' },
  { id: 'U057DSN278D', name: 'anhadrs' },
  { id: 'U057ECSB1S7', name: 'hello' },
  { id: 'U057ECSQK8V', name: 'onboard' },
  { id: 'U057ES8QF5K', name: 'mitchellazj' },
  { id: 'U057FJ7DJ4T', name: 'trjstewart' },
  { id: 'U057GHZBWFM', name: 'connormonaghan1914' },
  { id: 'U057GLKQ3FU', name: 'leybs02' },
  { id: 'U057GLR1LFL', name: 'caleb.leungg' },
  { id: 'U057GPTCFBL', name: 'calacode' },
  { id: 'U057HCVEWF2', name: 'austin' },
  { id: 'U057HD0U9J4', name: 'adam' },
  { id: 'U057HM2935J', name: 'noah.davey' },
  { id: 'U057HU6T7RB', name: 'email' },
  { id: 'U057LPW2WG3', name: 'standa' },
  { id: 'U057MLNREDP', name: 'ahashganeshamoorthy' },
  { id: 'U057PBK4MV2', name: 'harrykeightley' },
  { id: 'U057UCSPUAD', name: 'wenlu669' },
  { id: 'U057VBJLA1X', name: 'b.riwukaho' },
  { id: 'U057VF5B87K', name: 'donelshaju' },
  { id: 'U057W1AMNKT', name: 'gcalabe' },
  { id: 'U05840HAM96', name: 'lachlanbyoung' },
  { id: 'U05857KUZS4', name: 'tim' },
  { id: 'U0586G2KQJU', name: 'elliott.moore.private' },
  { id: 'U058769T5PA', name: 'benmaggacis' },
  { id: 'U058AFP8H32', name: 'ashleigh_richardson' }
]
*/
