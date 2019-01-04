import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class TaskBoxService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 查询
   */
  query(page?) {
    return this.netService.send({
      server: businessService.taskBoxController.query,
      page
    })
  }
}
