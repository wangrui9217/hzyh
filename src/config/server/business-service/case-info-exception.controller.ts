import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'CaseInfoExceptionController'

export default {
  /**
   * 新增案件
   */
  addCaseInfoException: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addCaseInfoException',
    type: requestType.Get
  },
  /**
   * 异常案件批量新增
   */
  batchAddCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchAddCaseInfo',
    type: requestType.Post
  },
  /**
   * 批量删除异常池案件
   */
  batchDeleteCaseInfoException: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchDeleteCaseInfoException',
    type: requestType.Post
  },
  /**
   * 检查异常案件
   */
  checkExceptionCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkExceptionCase',
    type: requestType.Get
  },
  /**
   * 删除异常池案件
   */
  deleteCaseInfoException: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteCaseInfoException',
    type: requestType.Delete
  },
  /**
   * 获取所有异常案件
   */
  findAllCaseInfoException: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllCaseInfoException',
    type: requestType.Get
  },
  /**
   * 获取所有重复案件
   */
  findAllRepeatCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllRepeatCaseInfo',
    type: requestType.Get
  },
  /**
   * 获取重复案件
   */
  findRepeatCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRepeatCaseInfo',
    type: requestType.Get
  },
  /**
   * 获取所有重复的案件（不排除本身、包括重案件类型）
   */
  getAllRepeatCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRepeatCaseInfo',
    type: requestType.Get
  },
  /**
   * 更新案件
   */
  updateExceptionCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateExceptionCase',
    type: requestType.Post
  }
}
