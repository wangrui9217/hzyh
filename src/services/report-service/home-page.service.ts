import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';
import { dashboardTimeType } from '~/config/enum.config'
import moment from 'moment'

// 日期类型
const dateType = {
  [dashboardTimeType.year]: {
    startType: <any>"year",
    addType: <any>"years"
  },
  [dashboardTimeType.month]: {
    startType: <any>"month",
    addType: <any>"months"
  },
  [dashboardTimeType.week]: {
    startType: <any>"week",
    addType: <any>"weeks"
  },
}

/**
 * 日期转换
 * @param date 
 * @param type 
 */
const getDateTimeRange = function (date, type) {
  let start = moment(date).startOf(dateType[type].startType)
  let end = moment(start).add(1, dateType[type].addType)
  return {
    start: start.format("YYYY-MM-DD"),
    end: end.format("YYYY-MM-DD")
  }
}

export class HomePageService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 获取已还款案件数量和金额
   */
  getCaseAmtAndCount(data) {
    // 修正日期
    let dateTime = getDateTimeRange(data.date, data.timeType)

    return this.netService.send({
      server: reportService.homePageController.getCaseAmtAndCount,
      data: {
        timeType: data.timeType,
        queryType: data.queryType,
        startDate: dateTime.start,
        endDate: dateTime.end
      }
    })
  }

  /**
   * 获取案件反馈信息
   * @param data 
   */
  getCaseGroupInfo(data) {
    // 修正日期
    let dateTime = getDateTimeRange(data.date, data.timeType)

    return this.netService.send({
      server: reportService.homePageController.getCaseGroupInfo,
      data: {
        timeType: data.timeType,
        queryType: data.queryType,
        startDate: dateTime.start,
        endDate: dateTime.end
      }
    })
  }

  /**
   * 管理员首页 根据年份查询该年度各月的催记，外呼数据量
   * @param data 
   */
  getRecordReport(data) {
    // 修正日期
    let dateTime = getDateTimeRange(data.date, dashboardTimeType.month)

    return this.netService.send({
      server: reportService.homePageController.getRecordReport,
      data: {
        startDate: dateTime.start
      }
    })
  }

  /**
   * 管理员首页 按省份获取催收数据
   * @param data 
   */
  getCollectionedDate() {
    return this.netService.send({
      server: reportService.homePageController.getCollectionedDate
    })
  }


  /**
   * 管理员首页 内催汇款排行榜
   * @param data 
   */
  getCollectorRanking(data, page) {
    return this.netService.send({
      server: reportService.homePageController.collectorRanking,
      data: {
        rankType: data.rankType,
        timeType: data.timeType
      },
      page
    })
  }

  /**
  * 管理员首页 委外汇款排行榜
  * @param data 
  */
  getOutsourceRanking(data, page) {
    return this.netService.send({
      server: reportService.homePageController.outsourceRanking,
      data: {
        rankType: data.rankType,
        timeType: data.timeType
      },
      page
    })
  }

  /**
   * 管理员首页 获取催收进度数
   * @param data 
   */
  getCollectedCount() {
    return this.netService.send({
      server: reportService.homePageController.getHomePageCollectedPage
    })
  }

  /**
   * 获取催记数量
   */
  getFollowCountInfo() {
    return this.netService.send({
      server: reportService.homePageController.getHomePagePreviewTotalFollow
    })
  }

  /**
   * 获取案件状态数
   */
  getCaseStatusInfo() {
    return this.netService.send({
      server: reportService.homePageController.getHomePageCaseFollowedPreview
    })
  }

  /**
   * 统计催收员首页回款金额排名
   */
  getCollectedCaseBackRank({ timeType }) {
    return this.netService.send({
      server: reportService.homePageController.getHomePageCollectedCaseBackRank,
      data: {
        timeType
      }
    })
  }


  /**
   * 统计催收员首页跟催量排名
   */
  getCollectedFollowedRank({ timeType }) {
    return this.netService.send({
      server: reportService.homePageController.getHomePageCollectedFollowedRank,
      data: {
        timeType
      }
    })
  }

  /**
   * 获取快速催收信息
   */
  getQuickAccessCaseInfo() {
    return this.netService.send({
      server: reportService.homePageController.quickAccessCaseInfo
    })
  }
}



