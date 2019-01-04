import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'callReportController'

export default {
  /**
   * 双向外呼通话个数统计
   */
  getCountSmaRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCountSmaRecord',
    type: requestType.Post
  },
  /**
   * 双向外呼通话时长统计
   */
  getCountTimeSmaRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCountTimeSmaRecord',
    type: requestType.Post
  },
  /**
  *查询对呼数据
  */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  }
}
