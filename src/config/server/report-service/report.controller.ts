import { requestType } from '~/config/enum.config'

// 报表相关
const SERVICE = 'report-service'
const CONTROLLER = 'ReportController'

export default {
  /**
   * 导出催收员回款报表
   */
  export_back_money_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportBackMoneyReport',
    type: requestType.Get
  },
  /**
   * 导出催收员每日催收过程报表
   */
  export_daily_process_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportDailyProcessReport',
    type: requestType.Get
  },
  /**
   * 导出催收员每日催收结果报表
   */
  export_daily_result_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportDailyResultReport',
    type: requestType.Get
  },
  /**
   * 导出催收员业绩进展报表
   */
  export_performance_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportPerformanceReport',
    type: requestType.Get
  },
  /**
   * 催收员回款报表
   */
  get_back_money_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getBackMoneyReport',
    type: requestType.Get
  },
  /**
   * 催收员每日催收过程报表
   */
  get_daily_process_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDailyProcessReport',
    type: requestType.Get
  },
  /**
   * 催收员每日催收结果报表
   */
  get_daily_result_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDailyResultReport',
    type: requestType.Get
  },
  /**
   * 催收员业绩进展报表
   */
  get_performance_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPerformanceReport',
    type: requestType.Get
  },
  /**
   * 催收员业绩报名汇总报表
   */
  get_group_leader_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getGroupLeaderReport',
    type: requestType.Get
  },
  /**
   * 催收员业绩报名小组汇总报表
   */
  get_summary_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getSummaryReport',
    type: requestType.Get
  },
  /**
   * 催收员业绩排名报表
   */
  get_performance_ranking_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPerformanceRankingReport',
    type: requestType.Get
  },
  /**
   * 导出催收员业绩排名报表
   */
  export_performance_ranking_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportPerformanceRankingReport',
    type: requestType.Get
  },
  /**
   * 导出催收员业绩排名小组汇总报表
   */
  export_summary_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportSummaryReport',
    type: requestType.Get
  },
  /**
   * 短信发送统计报表
   */
  get_sms_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getSmsReport',
    type: requestType.Get
  },
  /**
   * 导出短信发送统计报表
   */
  export_sms_report: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportSmsReport',
    type: requestType.Get
  }
}
