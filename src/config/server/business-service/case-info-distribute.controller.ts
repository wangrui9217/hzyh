import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseInfoDistributeController'

export default {
  /**
   * 案件分配手动分案统计
   */
  allocationCount: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'allocationCount',
    type: requestType.Post
  },
  /**
   * 根据备注解析联系人信息
   */
  batchAddPersonContacts: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchAddPersonContacts',
    type: requestType.Get
  },
  /**
   * 策略分配情况统计
   */
  countStrategyAllocation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'countStrategyAllocation',
    type: requestType.Post
  },
  /**
   * 删除待分配案件回收案件
   */
  deleteRecoverDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteRecoverDistribute',
    type: requestType.Delete
  },
  /**
   * 案件分配(机构时传入机构的ID)
   */
  distributeCeaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'distributeCeaseInfo',
    type: requestType.Post
  },
  /**
   * 案件分配页面（多条件查询）
   */
  findCaseInfoDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCaseInfoDistribute',
    type: requestType.Get
  },
  /**
   * 查询待分配案件的回收案件
   */
  findRecoverDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRecoverDistribute',
    type: requestType.Get
  },
  /**
   * 查找部门下的案件数
   */
  getCaseCountOnDept: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseCountOnDept',
    type: requestType.Get
  },
  /**
   * 案件详情查询操作
   */
  getCaseInfoDistributedDetails: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoDistributedDetails',
    type: requestType.Get
  },
  /**
   * 查找用户的案件数
   */
  getUserInfoByUserId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getUserInfoByUserId',
    type: requestType.Post
  },
  /**
   * 案件导入待分配案件评分
   */
  importCaseScore: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importCaseScore',
    type: requestType.Post
  },
  /**
   * 案件分配手动分案
   */
  manualAllocation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'manualAllocation',
    type: requestType.Post
  },
  /**
   * 策略预览结果
   */
  previewResult: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'previewResult',
    type: requestType.Post
  },
  /**
   * 案件导入分配策略分案
   */
  strategyAllocation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'strategyAllocation',
    type: requestType.Post
  },
  /**
   * 案件导入待分配案件导出
   */
  caseInfoDistributedExport: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'caseInfoDistributedExport',
    type: requestType.Get
  }
}
