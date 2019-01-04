import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from "~/core/service"

export class DataDictService extends Service {

  @Inject(NetService)
  private netService: NetService

  /**
   * 获取数据字典HASH
   */
  @Debounce()
  getDictHash() {
    return this.netService.send({
      server: businessService.dataDictController.getHashCode,
    })
  }

  /**
   * 获取数据字典数据
   */
  @Debounce()
  getDictData() {
    return this.netService.send({
      server: businessService.dataDictController.getAll,
      data: {}
    })
  }
}

