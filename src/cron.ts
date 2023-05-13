import {generateReport} from "./service/reportService";
import {CronJob} from "cron";
import {Config} from "./config";


export const startCronJobs = () => {
  new CronJob(
    Config.GenerateReportCron,
    generateReport,
    null,
    true,
  );
}
