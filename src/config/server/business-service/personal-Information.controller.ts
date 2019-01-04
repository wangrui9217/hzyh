import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'personalInformationController'

export default {
  /**
   * 案件详情页获取客户信息
   */
  getPersonalByCaseId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPersonalByCaseId',
    type: requestType.Get
  },
  /**
   * 案件详情页获取还款信息
   */
  getCaseInformationModelByCaseId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInformationModelByCaseId',
    type: requestType.Get
  },
  /**
   * 案件详情页获取附件信息
   */
  getCaseFIleModelByCaseId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseFIleModelByCaseId',
    type: requestType.Get
  }
}
