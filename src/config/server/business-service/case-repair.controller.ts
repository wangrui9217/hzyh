import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseRepairController'

export default {
  /**
   * 修复分配
   */
  distributeRepairCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'distributeRepairCase',
    type: requestType.Post
  },
  /**
   * 已分配案件查询
   */
  getAllDistributeCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllDistributeCase',
    type: requestType.Get
  },
  /**
   * 已修复案件查询
   */
  getAllRepairedCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRepairedCase',
    type: requestType.Get
  },
  /**
   * 待修复案件查询
   */
  getAllRepairingCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRepairingCase',
    type: requestType.Get
  },
  /**
   * 修改案件状态
   */
  toRepair: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'toRepair',
    type: requestType.Post
  },
  /**
   * 查看已修复案件信息
   */
  viewCaseRepair: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'viewCaseRepair',
    type: requestType.Get
  },
  /**
   * 修复附件查看
   */
  viewCaseRepairRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'viewCaseRepairRecord',
    type: requestType.Get
  }
}
