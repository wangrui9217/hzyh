import { fileService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class FileUploadService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 文件在线查看
   */
  view() {
    return this.netService.send({
      server: fileService.fileUploadController.view
    })
  }
  /**
   * 上传压缩文件，后台进行解压缩
   */
  @Debounce()
  unZipCaseFile(data) {
    return this.netService.send({
      server: fileService.fileUploadController.unZipCaseFile,
      data
    })
  }
}
