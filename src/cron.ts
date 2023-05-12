import {generateReport} from "./service/reportService";
import {CronJob} from "cron";

const EVERY_MINUTE = '* * * * * *';

export const startCronJobs = () => {
    new CronJob(
    EVERY_MINUTE,
    generateReport,
    null,
    true,
  );
}
