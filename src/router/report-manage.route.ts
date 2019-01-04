
const DailyProcessReport = () => import('~/pages/report-manage/daily-process-report.vue')
const DailyResultReport = () => import('~/pages/report-manage/daily-result-report.vue')
const PerformanceRank = () => import('~/pages/report-manage/performance-rank.vue')
const RealtimeReport = () => import('~/pages/report-manage/realtime-report.vue')
const WeekReport = () => import('~/pages/report-manage/week-report.vue')
const TeamSummary = () => import('~/pages/report-manage/team-summary.vue')
// const MessageStatistics = () => import('~/pages/report-manage/message-statistics.vue')

export default [
  {
    path: '/report-manage/daily-process-report',
    title: '催收员业绩进展报表',
    name: 'daily-process-report',
    component: DailyProcessReport
  }, {
    path: '/report-manage/daily-result-report',
    name: 'daily-result-report',
    title: '每日催收结果报表',
    component: DailyResultReport
  }, {
    path: '/report-manage/performance-rank',
    title: '催收员业绩排名报表',
    name: 'performance-rank',
    component: PerformanceRank
  }, {
    path: '/report-manage/realtime-report',
    title: '催收员回款报表',
    name: 'realtime-report',
    component: RealtimeReport
  }, {
    path: '/report-manage/week-report',
    title: '催收员业绩进展报表',
    name: 'week-report',
    component: WeekReport
  }, {
    path: '/report-manage/team-summary',
    title: '小组汇总报表',
    name: 'team-summary',
    component: TeamSummary
  }
  // , {
  //   path: '/report-manage/message-statistics',
  //   title: '短信发送统计报表',
  //   name: 'message-statistics',
  //   component: MessageStatistics
  // }
]
