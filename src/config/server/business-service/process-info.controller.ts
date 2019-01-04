import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'processInfoController'

export default {
  /**
   * 审批链的创建
   */
  saveProcessTask: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveProcessTask',
    type: requestType.Post
  },
  /**
   * 审批链列表展示
   */
  queryFlowTaskList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryFlowTaskList',
    type: requestType.Get
  },
  /**
   * 根据任务id查询节点信息（审批链列表的展示操作）
   */
  getTaskInfoList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTaskInfoList',
    type: requestType.Get
  },
  /**
   * 获取所有的任务（下拉框使用）
   */
  getFlowTaskAll: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getFlowTaskAll',
    type: requestType.Get
  },
  /**
   * 获取审批过的历史记录（在展示待审批列表的操作）
   */
  getTaskHistoryList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTaskHistoryList',
    type: requestType.Get
  },
}
