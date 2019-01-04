import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'batchManageController'

export default {
  /**
   * 查询批量处理
   */
  queryBatchManage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryBatchManage',
    type: requestType.Get
  },
  /**
   * 首页批量系统公告
   */
  getBatchSysNotice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getBatchSysNotice',
    type: requestType.Get
  },
  /**
   * 获取当日跑批总状态
   */
  getStatus: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getStatus',
    type: requestType.Get
  },
  /**
   * 批量处理
   */
  manualBatchManage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'manualBatchManage',
    type: requestType.Post
  },
  /**
   * 多条件查询批量处理记录
   */
  getBatchManage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getBatchManage',
    type: requestType.Get
  },
  /**
   * 暂停触发器
   */
  pauseTriggerForJob: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'pauseTriggerForJob',
    type: requestType.Get
  },
  /**
   * 启用触发器
   */
  resumeTriggerForJob: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'resumeTriggerForJob',
    type: requestType.Get
  }
}
