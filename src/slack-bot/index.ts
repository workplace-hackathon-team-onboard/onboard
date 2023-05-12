import { App } from "@slack/bolt";

const app = new App({
  signingSecret: '8d965db0ab92534c5168712b6f081427',
  token: 'xoxb-5225133679798-5252434835301-0XqHrCIN6TiHMrRqKpkpWm2e',
  clientSecret: '6d002315132274f9cb3875e55f8b6018',
  clientId: '5225133679798.5255377016402',
  appToken: 'xapp-1-A057HB30GBU-5248939271174-5a8c8ed8d4a289cc7b2c5e4d8758668bc8842408e48e8c972f600c5e3f008341',
  socketMode: true,
});


app.message('cm', async ({say}) => {
  console.log('some stuff and things')
  await say('sup CM')
})

export async function startSlackBot (): Promise<void> {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
}

