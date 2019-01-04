import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'outsourcePoolController'

export default {
  /**
   * 退案
   */
  backOutsourcePool: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'backOutsourcePool',
    type: requestType.Post
  },
  /**
   * 财务数据确认操作
   */
  affirmReconciliation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'affirmReconciliation',
    type: requestType.Post
  },
  /**
   * 移入待分配
   */
  changeToBeAssigned: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'changeToBeAssigned',
    type: requestType.Post
  },
  /**
   * 委外结案
   */
  closeOutsourcePool: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'closeOutsourcePool',
    type: requestType.Post
  },
  /**
   * 委外案件导出
   */
  exportAccOutsourcePool: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportAccOutsourcePool',
    type: requestType.Post
  },
  /**
   * 导出委外财务对账数据
   */
  exportOutsideFinanceData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportOutsideFinanceData',
    type: requestType.Get
  },
  /**
   * 查询已确认的数据
   */
  findConfirmFinanceData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findConfirmFinanceData',
    type: requestType.Get
  },
  /**
   * 查询未确认的数据
   */
  findFinanceData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findFinanceData',
    type: requestType.Get
  },
  /**
   * 查询可委外案件
   */
  getAllOutCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllOutCase',
    type: requestType.Get
  },
  /**
   * 查询委外分配信息
   */
  getOutDistributeInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutDistributeInfo',
    type: requestType.Get
  },
  /**
   * 查询委外记录
   */
  getOutRecored: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutRecored',
    type: requestType.Get
  },
  /**
   * 按批次号查看委外案件详情
   */
  getOutSourceCaseByBatchnum: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutSourceCaseByBatchnum',
    type: requestType.Get
  },
  /**
   * 按批次号和委外名称查看委外案件详情
   */
  getOutSourceCaseByOutName: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutSourceCaseByOutName',
    type: requestType.Post
  },
  /**
   * 查看委外案件跟进记录
   */
  getOutSourceCaseFollowRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutSourceCaseFollowRecord',
    type: requestType.Get
  },
  /**
   * 多条件查询回收案件
   */
  getReturnCaseByConditions: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getReturnCaseByConditions',
    type: requestType.Get
  },
  /**
   * 账目导入/委外跟进记录导入
   */
  importFinancData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importFinancData',
    type: requestType.Get
  },
  /**
   * 下载模板
   */
  loadTemplate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'loadTemplate',
    type: requestType.Get
  },
  /**
   * 待委外案件评分(手动)
   */
  outCaseScore: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outCaseScore',
    type: requestType.Get
  },
  /**
   * 委外中案件评分(手动)
   */
  outCurrentCaseScore: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outCurrentCaseScore',
    type: requestType.Get
  },
  /**
   * 委外案件 待分配案件 策略分配
   */
  outerStrategyDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outerStrategyDistribute',
    type: requestType.Get
  },
  /**
   * 委外待分配案件分配
   */
  outsourceDistributeCeaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outsourceDistributeCeaseInfo',
    type: requestType.Post
  },
  /**
   * 委外待分配按数量平均分配预览
   */
  outsourceDistributePreview: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outsourceDistributePreview',
    type: requestType.Post
  },
  /**
   * 查询待分配委外案件
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  },
  /**
   * 撤回
   */
  recallOutCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'recallOutCase',
    type: requestType.Post
  },
  /**
   * 回收委外案件
   */
  returnOutsourceCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'returnOutsourceCase',
    type: requestType.Post
  },
  /**
   * 根据批次撤销分配案件
   */
  revertOutCaseInfoDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'revertOutCaseInfoDistribute',
    type: requestType.Get
  },
  /**
   * 核销申请
   */
  verificationApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'verificationApply',
    type: requestType.Post
  },
  /**
   * 财务数据删除操作
   */
  deleteFinanceData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteFinanceData',
    type: requestType.Post
  }
}
