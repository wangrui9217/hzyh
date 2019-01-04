import { datasyncService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class DepartmentInfoService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 手工同步机构
   */
  @Debounce()
  handleDepartment() {
    return this.netService.send({
      server: datasyncService.departmentInfoController.handleDepartment
    })
  }
}
