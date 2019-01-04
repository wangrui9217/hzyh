import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseFollowupAppController'

export default {
  /**
   * APP查询案件跟进记录
   */
  getAllFollowupsForApp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllFollowupsForApp',
    type: requestType.Get
  },
  /**
   * 根据申请号查询承诺信息(APP)
   */
  getPayPromiseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPayPromiseInfo',
    type: requestType.Get
  },
  /**
   * APP添加跟进记录
   */
  saveFollowupRecordForApp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveFollowupRecordForApp',
    type: requestType.Get
  }
}
