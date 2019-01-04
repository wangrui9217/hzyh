import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'productSeriesController'

export default {
  /**
   * 获取所有的产品名称
   */
  getAllProductSeries: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllProductSeries',
    type: requestType.Get
  },
  /**
   * 获取产品类型
   */
  getProductSeriesName: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getProductSeriesName',
    type: requestType.Get
  }
}
