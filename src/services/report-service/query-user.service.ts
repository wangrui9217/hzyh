import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class queryUserService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 委外催收中查询
   */
  @Debounce()
  queryUsers(data, page?) {
    return this.netService.send({
      server: reportService.queryUserController.queryUsers,
      data: {
        deptCode: data.deptCode
      },
      page
    })
  }
}



