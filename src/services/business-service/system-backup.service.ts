import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class SystemBackUpService {

    @Inject(NetService)
    private netService: NetService

    /**
     * 查询部门下的特定用户
     * @companyCode 公司编码
     */
    @Debounce()
    queryBackupList(companyCode: string) {
        return this.netService.send({
            server: businessService.systemBackupController.querySystemBackup,
            data: {
                companyCode: companyCode
            }
        })
    }
  /**
   * 增加系统数据库备份
   */
  @Debounce()
  createSystemBackup(data) {
    return this.netService.send({
      server: businessService.systemBackupController.createSystemBackup,
      data
    })
  }
  /**
   * 删除系统数据库备份
   */
  @Debounce()
  deleteSystemBackup(data) {
    return this.netService.send({
      server: businessService.systemBackupController.deleteSystemBackup,
      data
    })
  }
  /**
   * 查询系统备份
   */
  @Debounce()
  querySystemBackup(data,page) {
    return this.netService.send({
      server: businessService.systemBackupController.querySystemBackup,
      data,
      page
    })
  }
  /**
   * 恢复系统数据库备份
   */
  @Debounce()
  recoverSystemBackup(data) {
    return this.netService.send({
      server: businessService.systemBackupController.recoverSystemBackup,
      data
    })
  }
}

