import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class ReportService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 导出催收员回款报表
   */
  exportBackMoneyReport(data) {
    return this.netService.send({
      server: reportService.reportController.export_back_money_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 导出催收员每日催收过程报表
   */
  exportDailyProcessReport(data) {
    return this.netService.send({
      server: reportService.reportController.export_daily_process_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 导出催收员每日催收结果报表
   */
  exportDailyResultReport(data) {
    return this.netService.send({
      server: reportService.reportController.export_daily_result_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 导出催收员业绩进展报表
   */
  exportPerformanceReport(data) {
    return this.netService.send({
      server: reportService.reportController.export_performance_report,
      data: {
        userName: data.userName,
        id: data.deptId,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 催收员回款报表
   */
  getBackMoneyReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_back_money_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 催收员每日催收过程报表
   */
  getDailyProcessReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_daily_process_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 催收员每日催收结果报表
   */
  getDailyResultReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_daily_result_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 催收员业绩进展报表
   */
  getPerformanceReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_performance_report,
      data: {
        userName: data.userName,
        code: data.code,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 催收员业绩报名汇总报表
   */
  getGroupLeaderReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_group_leader_report,
      data: {
        type: data.type,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 催收员业绩报名小组汇总报表
   */
  getSummaryReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_summary_report,
      data: {
        type: data.type,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 催收员业绩排名报表
   */
  getPerformanceRankingReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_performance_ranking_report,
      data: {
        type: data.type,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 导出催收员业绩排名报表
   */
  exportPerformanceRankingReport(data) {
    return this.netService.send({
      server: reportService.reportController.export_performance_ranking_report,
      data
    })
  }
  /**
   * 导出催收员业绩排名小组汇总报表
   */
  exportSummaryReport(data) {
    return this.netService.send({
      server: reportService.reportController.export_summary_report,
      data: {
        type: data.type,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 短信发送统计报表
   */
  getSmsReport(data) {
    return this.netService.send({
      server: reportService.reportController.get_sms_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 导出短信发送统计报表
   */
  exportSmsReport(data) {
    return this.netService.send({
      server: reportService.reportController.export_sms_report,
      data: {
        type: data.type,
        userName: data.userName,
        id: data.deptId,
        startDate: FilterService.dateRanageFormat(data.time).start,
        endDate: FilterService.dateRanageFormat(data.time).end,
        companyCode: data.companyCode
      }
    })
  }

  /**
   * 案件详情查询操作
   */
  @Debounce()
  getCaseInfoDistributedDetails(id) {
    return this.netService.send({
      server: reportService.caseInfoDistributeController.get_case_info_distributed_details,
      data: {
        id
      }
    })
  }
}

