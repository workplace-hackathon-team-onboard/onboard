import { App } from "@slack/bolt";
import { blocks } from "./blockBuilders";
import {prisma} from "../helpers/prismaClient";

interface Question {
  questionId: number
  question: string
}

interface QAArgs {
  slackUserId: string
  questions: Question[]
}



const app = new App({
  token:'xoxb-5225133679798-5252434835301-wkyZCVRAfouEmXvLUwzKEXlH',
  clientId: '5225133679798.5255377016402',
  clientSecret: '6d002315132274f9cb3875e55f8b6018',
  signingSecret: '8d965db0ab92534c5168712b6f081427',
  appToken: 'xapp-1-A057HB30GBU-5256188192293-81778a4b0234b51106cdc6c90a66c68c3b06dfa6729744521caf58b1d7230a55',
  socketMode: true,
});

app.event('member_joined_channel', async ({event, client}) => {
  console.log('member joined channel', event);
  const userInfo = await client.users.info({user: event.user})
  if (userInfo.user) {
    const email = userInfo.user.profile.email;
    const name = userInfo.user.profile.real_name;
    const user = await prisma.user.upsert({
      create: {
        email: email,
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
        onboarded: false,
      },
      update: {},
      where: {
        email: email
      }
    })
    console.log('new user onboarded', user)
  } else {
    console.error('no user info found for user: ', event)
  }
})

app.action('submit_question', async ({ack, say, body, client}) => {
  // eslint-disable-next-line
  // @ts-ignore
  const questionIds = Object.keys(body.state.values.question_block)
  const userInfo = await client.users.info({user: body.user.id})
  const email = userInfo.user.profile.email;
  const prismaUser = await prisma.user.findFirst({
    where: {
      email: email
    }
  })

  console.log(JSON.stringify(body, null, 2))
  console.log(prismaUser)


  for(const questionId of questionIds) {
    // eslint-disable-next-line
    // @ts-ignore
    const answer = body.state.values.question_block[questionId].value

    // prisma.user.findFirst({})
    await prisma.answer.create({
      data: {
        answer: answer,
        questionId: Number(questionId),
        createdAt: new Date(),
        userId: prismaUser.id,
      }
    })

    console.log('the answer is', answer)
  }

  await ack()
})


export async function sendQA(qaArgs: QAArgs) {
  // Open a converstaion with the user - this is idempotent
  const response = await app.client.conversations.open({users: qaArgs.slackUserId})

  const channelId = response.channel.id;
  await app.client.chat.postMessage({
    channel: channelId,
    blocks: [
      ...qaArgs.questions.map(
        (question) => blocks.question(question.question, 1)
      ),
      blocks.submitQuestionButton()
    ]
  })
}

export async function sendComparisonResponse(slackUserId: string, comparisonResults: string) {
  const response = await app.client.conversations.open({users: slackUserId})
  const channelId = response.channel.id;
  await app.client.chat.postMessage({
    channel: channelId,
    text: 'Welcome to the team bro'
  })
}

export async function startSlackBot (): Promise<void> {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');

  // sendComparisonResponse('U057GHZBWFM', 'stuff')
  sendQA({slackUserId: 'U057GHZBWFM', questions: [{questionId: 1, question: 'What is your name?'}]})

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
