import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseInfoController'

export default {
  /**
   * 一键审批提前流转
   */
  approveAllAdvanceTurn: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'approveAllAdvanceTurn',
    type: requestType.Post
  },
  /**
   * 内催待分配案件分配
   */
  distributeCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'distributeCaseInfo',
    type: requestType.Post
  },
  /**
   * 案件重新分配
   */
  distributeCeaseInfoAgain: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'distributeCeaseInfoAgain',
    type: requestType.Post
  },
  /**
   * 内催待分配预览
   */
  distributePreview: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'distributePreview',
    type: requestType.Post
  },
  /**
   * 电催强制流转池
   */
  electricForceCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'electricForceCirculation',
    type: requestType.Get
  },
  /**
   * 电催小流转池
   */
  electricSmallCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'electricSmallCirculation',
    type: requestType.Get
  },
  /**
   * 导出跟进记录
   */
  exportCaseInfoFollowRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportCaseInfoFollowRecord',
    type: requestType.Post
  },
  /**
   * 导出跟进记录(单案件)
   */
  exportFollowRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportFollowRecord',
    type: requestType.Get
  },
  /**
   * 内催案件管理查询回收案件
   */
  findAllCaseInfoReturn: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllCaseInfoReturn',
    type: requestType.Get
  },
  /**
   * 案件查找
   */
  findCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCaseInfo',
    type: requestType.Get
  },
  /**
   * 查看附件
   */
  findUpload: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findUpload',
    type: requestType.Get
  },
  /**
   * 获取所有批次号
   */
  getAllBatchNumber: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllBatchNumber',
    type: requestType.Get
  },
  /**
   * 分页查询案件管理案件
   */
  getAllCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllCaseInfo',
    type: requestType.Get
  },
  /**
   * 多条件查询退案案件
   */
  getAllCaseInfoReturn: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllCaseInfoReturn',
    type: requestType.Get
  },
  /**
   * 案件详情查询操作
   */
  getCaseInfoDetails: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoDetails',
    type: requestType.Get
  },
  /**
   * 案件跟进记录
   */
  getCaseInfoFollowRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoFollowRecord',
    type: requestType.Get
  },
  /**
   * 查询备注信息
   */
  getCaseInfoRemark: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoRemark',
    type: requestType.Get
  },
  /**
   * 案件流转记录
   */
  getCaseInfoTurnRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoTurnRecord',
    type: requestType.Get
  },
  /**
   * 内催按批次号查询催收中案件
   */
  getCollectingCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCollectingCase',
    type: requestType.Get
  },
  /**
   * 查询共债案件数量
   */
  getCommonCaseCount: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCommonCaseCount',
    type: requestType.Get
  },
  /**
   * 下载凭证
   */
  getFollowupFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getFollowupFile',
    type: requestType.Get
  },
  /**
   * 分页查询内催结案案件
   */
  getInnerOverCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getInnerOverCase',
    type: requestType.Get
  },
  /**
   * 分页查询内催待分配案件
   */
  getInnerWaitCollectCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getInnerWaitCollectCase',
    type: requestType.Get
  },
  /**
   * 分页查询电催案件
   */
  getTelCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTelCaseInfo',
    type: requestType.Get
  },
  /**
   * 内催案件 待分配案件 策略分配
   */
  innerStrategyDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'innerStrategyDistribute',
    type: requestType.Get
  },
  /**
   * 案件到期提醒
   */
  maturityRemind: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'maturityRemind',
    type: requestType.Get
  },
  /**
   * 修改备注
   */
  modifyCaseMemo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'modifyCaseMemo',
    type: requestType.Post
  },
  /**
   * 移入待分配案件池
   */
  moveToDistribution: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'moveToDistribution',
    type: requestType.Post
  },
  /**
   * 外访强制流转池
   */
  outForceCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outForceCirculation',
    type: requestType.Get
  },
  /**
   * 外访小流转池
   */
  outSmallCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outSmallCirculation',
    type: requestType.Get
  },
  /**
   * 查询共债案件
   */
  queryCaseInfoList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCaseInfoList',
    type: requestType.Get
  },
  /**
   * 案件退案
   */
  returnCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'returnCase',
    type: requestType.Post
  },
  /**
   * 撤销分案(单个案件)
   */
  revertCaseInfoDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'revertCaseInfoDistribute',
    type: requestType.Get
  },
  /**
   * 撤销分案(多个案件)
   */
  revertCaseInfoDistributeByCaseId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'revertCaseInfoDistributeByCaseId',
    type: requestType.Post
  },
  /**
   * 更新案件评分(手动)
   */
  updateAllScoreStrategyManual: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateAllScoreStrategyManual',
    type: requestType.Get
  },
  /**
   * 内催待分配案件评分
   */
  updateInnerWaitCollScore: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateInnerWaitCollScore',
    type: requestType.Get
  },
  /**
   * 内催案件管理案件回收核销申请
   */
  veriyApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'veriyApply',
    type: requestType.Post
  },
  /**
  * 分配案件时判断所选用户是否有催收类型
  */
  checkUser: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkUser',
    type: requestType.Post
  },
  /**
  * 逾期信息查询
  */
  getOverdueInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOverdueInfo',
    type: requestType.Get
  }
}
