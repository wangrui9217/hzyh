import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'distributionController'

export default {
  /**
   * 获取委外预分案
   */
  queryOutSoutPoolCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOutSoutPoolCase',
    type: requestType.Get
  },
  /**
   * 获取委外预分案汇总数据
   */
  getOutSourceCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutSourceCaseInfo',
    type: requestType.Get
  },
  /**
   * 委外预分案确定分案
   */
  savePredistributionOutSource: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'savePredistributionOutSource',
    type: requestType.Post
  },
  /**
   * 获取汇总详情
   */
  getOutSourceCaseInfoDetail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutSourceCaseInfoDetail',
    type: requestType.Get
  },
}
