


export enum Crons {
   EVERY_MINUTE = '* * * * * *',
}

export const Config = {
  GenerateReportCron: Crons.EVERY_MINUTE,
  ComparisonsCron: Crons.EVERY_MINUTE
}
