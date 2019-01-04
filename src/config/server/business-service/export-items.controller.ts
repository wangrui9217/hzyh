import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'exportItemsController'

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
   * 查询委外导出项
   */
  getOutsourceExportItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutsourceExportItems',
    type: requestType.Get
  },
  /**
   * 查询更新项
   */
  getUpdateItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getUpdateItems',
    type: requestType.Get
  },
  /**
   * 设置导出项
   */
  saveExportItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveExportItems',
    type: requestType.Post
  },
  /**
   * 设置更新项
   */
  saveUpdateItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveUpdateItems',
    type: requestType.Post
  },
  /**
   * 设置委外导出项
   */
  saveOutsourceExportItems: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveOutsourceExportItems',
    type: requestType.Post
  }
}
