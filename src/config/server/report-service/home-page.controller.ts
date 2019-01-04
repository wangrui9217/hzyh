import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'homePageController'

export default {
  /**
   * 管理员首页催收员排行榜
   */
  collectorRanking: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'collectorRanking',
    type: requestType.Get
  },
  /**
   * 管理员首页 获取已还款案件数量/获取还款审核中案件数量/
   */
  getCaseAmtAndCount: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseAmtAndCount',
    type: requestType.Get
  },
  /**
   * 获取案件池中所有的日期
   */
  getCaseDate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseDate',
    type: requestType.Get
  },
  /**
   * 管理员首页 案件催收反馈数据 获取某时间段根据回款类型分组得到案件金额和数量
   */
  getCaseGroupInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseGroupInfo',
    type: requestType.Get
  },
  /**
   * 管理员首页 管理员首页获取催收中数据
   */
  getCollectionedDate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCollectionedDate',
    type: requestType.Get
  },
  /**
   * 管理员首页 统计催收员首页案件状况总览
   */
  getHomePageCaseFollowedPreview: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getHomePageCaseFollowedPreview',
    type: requestType.Get
  },
  /**
   * 管理员首页 统计催收员首页回款金额排名
   */
  getHomePageCollectedCaseBackRank: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getHomePageCollectedCaseBackRank',
    type: requestType.Get
  },
  /**
   * 管理员首页 统计催收员首页跟催量排名
   */
  getHomePageCollectedFollowedRank: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getHomePageCollectedFollowedRank',
    type: requestType.Get
  },
  /**
   * 管理员首页 统计催收员首页周月完成数据
   */
  getHomePageCollectedPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getHomePageCollectedPage',
    type: requestType.Get
  },
  /**
   * 管理员首页 统计首页数据
   */
  getHomePageInformation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getHomePageInformation',
    type: requestType.Get
  },
  /**
   * 管理员首页 统计催收员首页跟催量总览
   */
  getHomePagePreviewTotalFollow: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getHomePagePreviewTotalFollow',
    type: requestType.Get
  },
  /**
   * 管理员首页 根据年份查询该年度各月的催记，外呼数据量
   */
  getRecordReport: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRecordReport',
    type: requestType.Get
  },
  /**
   * 管理员首页 管理员首页委外方排行榜
   */
  outsourceRanking: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outsourceRanking',
    type: requestType.Get
  },
  /**
   * 管理员首页 催收员首页快速催收
   */
  quickAccessCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'quickAccessCaseInfo',
    type: requestType.Get
  }
}
