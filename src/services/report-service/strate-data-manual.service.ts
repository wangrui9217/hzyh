import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class StrateDataManualService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 预览策略
   */
  previewResult(data) {
    return this.netService.send({
      server: reportService.strateDataManualController.previewResult,
      data: {
        strategyJson: data.jsonString,
        productIds: data.productIds,
        seriesIds: data.seriesIds,
        strategyType: data.type,
        stripMark: data.stripMark,
        shops: data.shops,
        priority: data.priority,
        name: data.name
      }
    })
  }
}

