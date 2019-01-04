import { requestType } from '~/config/enum.config'

const SERVICE = 'dataimp-service'
const CONTROLLER = 'dataInfoExcelController'

export default {
  /**
   * 案件导入数据
   */
  getDataInfoExcelList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDataInfoExcelList',
    type: requestType.Get
  },
  /**
   * 案件导入确定
   */
  importExcelData:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importExcelData',
    type: requestType.Post
  },
  /**
   * 获取批次号列表
   */
  queryBatchNumGroup:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryBatchNumGroup',
    type: requestType.Get
  },
  checkCasesFile:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkCasesFile',
    type: requestType.Get
  },
  casesConfirmByBatchNum:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'casesConfirmByBatchNum',
    type: requestType.Get
  },
  deleteCasesByBatchNum:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteCasesByBatchNum',
    type: requestType.Get
  },
  exportError:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportError',
    type: requestType.Get
  },
  loadTemplate:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'loadTemplate',
    type: requestType.Get
  },
  specialAndStopLoadTemplate:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'specialAndStopLoadTemplate',
    type: requestType.Get
  },
  /**
   * 案件导入的案件详情附件信息其他材料
   */
  findUpload:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findUpload',
    type: requestType.Get
  },
  /**
   * 案件导入的案件详情客户信息
   */
  getDataInfoExcelDetails:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDataInfoExcelDetails',
    type: requestType.Get
  },
  /**
   * 导入单个案件附件
   */
  uploadCaseFileSingle:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'uploadCaseFileSingle',
    type: requestType.Post
  },
  /**
   * 错误列表
   */
  findError:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findError',
    type: requestType.Get
  }
}
