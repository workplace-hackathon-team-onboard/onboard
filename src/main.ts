import {startCronJobs} from "./cron";
import { startSlackBot } from "./slack-bot";


console.log('420691337')

async function main() {
  startCronJobs();
  await startSlackBot();
}

main()
  .then(() => console.log('started'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })



