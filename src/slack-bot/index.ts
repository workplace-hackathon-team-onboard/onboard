import { App } from "@slack/bolt";

const app = new App({
  token:'xoxb-5225133679798-5252434835301-6pLzWzFvcgzMpyouuzdnH73w',
  clientId: '5225133679798.5255377016402',
  clientSecret: '6d002315132274f9cb3875e55f8b6018',
  signingSecret: '8d965db0ab92534c5168712b6f081427',
  appToken: 'xapp-1-A057HB30GBU-5282612485776-197eb46a4bc58950329e77e46d46c78f01faf1c06c315dc9d39e92d807e55f1a',
  socketMode: true,
});


app.message('cm', async ({say}) => {
  console.log('some stuff and things')
  await say('sup CM')
})

app.action('submit_question', async ({ack, say, body}) => {
  await say('sup bro')
})

// Listen to when "A new member has joined"
app.event('team_join', async ({event, client}) => {
 // TODO collect known user's slack ids & names -> store in db
 console.log('A new team member has joined!')
 console.log(event)
})



interface Question {
  questionId: string
  question: string
}

interface QAArgs {
  slackUserId: string
  questions: Question[]
}

// send qanda messages to known users
export async function sendQA() {
  // TODO only open if one doesn't exist - pending testing this
  // Open a converstaion with the user
  const response = await app.client.conversations.open({users: 'U057GHZBWFM'})

  // TODO save channel id somewhere?
  const channelId = response.channel.id;
  console.log('ChannelId is : ', channelId)

  await app.client.chat.postMessage({
    channel: channelId,
    blocks: [
      {
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "plain_text_input-action"
        },
        "label": {
          "type": "plain_text",
          "text": "Q1",
          "emoji": true
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Submit",
              "emoji": true
            },
            "value": "click_me_123",
            "action_id": "submit_question"
          }
        ]
      }
    ]
  })


}

// TODO will this be returned from the 'postMessage' above? or an event
// store responses to qanda messages in db


// send messages to sets of users based on matches generated from quand responses

export async function startSlackBot (): Promise<void> {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');

  sendQA()

  // const res = await app.client.users.list()
  // console.log(res.members.map((user) => ( { id: user.id, name: user.name } )))
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
