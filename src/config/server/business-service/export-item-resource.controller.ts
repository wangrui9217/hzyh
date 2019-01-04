import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'exportItemResource'

export default {
  /**
   * 查询导出项
   */
  getExportItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getExportItems',
    type: requestType.Get
  },
  /**
   * 查询内催已结案导出项
   */
  getExportItemsClosed: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getExportItemsClosed',
    type: requestType.Get
  },
  /**
   * 查询委外已结案跟进记录导出项
   */
  getOutsourceClosedFollowUpExportItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutsourceClosedFollowUpExportItems',
    type: requestType.Get
  },
  /**
   * 查询委外跟进记录导出项
   */
  getOutsourceFollowUpExportItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutsourceFollowUpExportItems',
    type: requestType.Get
  },
  /**
   * 查询委外案件导出项
   */
  getOutsourceExportItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutsourceExportItems',
    type: requestType.Get
  }
}
