import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'personalController'

export default {
  /**
   * 查询案件流转记录
   */
  getCaseTurnRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseTurnRecord',
    type: requestType.Get
  },
  /**
   * 查询客户地图
   */
  getMapInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getMapInfo',
    type: requestType.Get
  },
  /**
   * 客户查询
   */
  getPersonalCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPersonalCaseInfo',
    type: requestType.Get
  },
  /**
   * 客户信息导出
   */
  personalInfoExport: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'personalInfoExport',
    type: requestType.Post
  },
  /**
   * 通讯录
   */
  getPersonalPhones: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPersonalPhones',
    type: requestType.Get
  }
}
