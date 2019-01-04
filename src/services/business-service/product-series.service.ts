import { Service } from '~/core/service';
import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class ProductSeriesService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 获取所有的产品名称
   */
  getAllProductSeries() {
    return this.netService.send({
      server: businessService.productSeriesController.getAllProductSeries
    })
  }
   /**
   * 获取产品类型
   */
  getProductSeriesName(){
    return this.netService.send({
      server: businessService.productSeriesController.getProductSeriesName
    })
  }
}
