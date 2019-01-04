import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseInfoVerificationController'

export default {
  /**
   * 案件申请审批
   */
  saveCaseInfoVerification: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveCaseInfoVerification',
    type: requestType.Post
  },
  /**
   * 案件按催收类型查询
   */
  getCaseInfoVerification: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoVerification',
    type: requestType.Get
  },
  /**
   * 核销管理导出
   */
  exportVerification: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportVerification',
    type: requestType.Post
  },
  /**
   * 案件下载记录查询
   */
  getCaseInfoVerificationPackaging: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoVerificationPackaging',
    type: requestType.Get
  },
  /**
   * 案件下载记录单个下载
   */
  download: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'download',
    type: requestType.Post
  },
  /**
   * 案件下载记录批量下载
   */
  batchDownload: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchDownload',
    type: requestType.Post
  },
  /**
   * 获取核销申请系统参数
   */
  getSysparm: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getSysparm',
    type: requestType.Get
  },
  /**
   * 核销案件审批查询
   */
  getCaseInfoVerificationApproval: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoVerificationApproval',
    type: requestType.Get
  },
  /**
   * 核销单个案件查询
   */
  caseInfoVerification:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'caseInfoVerification',
    type: requestType.Get
  },
  /**
   * 案件申请审批通过
   */
  caseInfoVerificationApply:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'caseInfoVerificationApply',
    type: requestType.Post
  }
}
