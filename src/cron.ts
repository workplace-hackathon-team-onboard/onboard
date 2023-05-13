import {generateReport} from "./service/reportService";
import {CronJob} from "cron";
import {Config} from "./config";
import {askQuestions} from "./service/questionService";


export const startCronJobs = () => {
  new CronJob(
    Config.GenerateReportCron,
    generateReport,
    null,
    true,
  );

  new CronJob(
    Config.GenerateReportCron,
    askQuestions,
    null,
    true
  )
}
