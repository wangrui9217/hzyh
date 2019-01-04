import { commonService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class SmaService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 开始电话呼叫
   */
  @Debounce()
  addTaskRecorder(data) {
    return this.netService.send({
      server: commonService.smaController.addTaskRecorder,
      data
    })
  }
  /**
   * 开始电话呼叫
   */
  @Debounce()
  callByPhoneNum(data) {
    return this.netService.send({
      server: commonService.udeskCallController.callByPhoneNum,
      data
    })
  }
  /**
   * 验证呼叫来源
   */
  checkCall(data) {
    return this.netService.send({
      server: commonService.smaController.checkCall,
      data: data
    })
  }
  /**
   * 绑定呼叫ID(绑定主叫号码)
   */
  @Debounce()
  bindTaskDataByCallerId(data) {
    return this.netService.send({
      server: commonService.smaController.bindTaskDataByCallerId,
      data: data
    })
  }
  /**
   * 签入
   */
  // signIn(data) {
  //   return this.netService.send({
  //     server: commonService.smaController.signIn,
  //     data: data
  //   })
  // }
  /**
   * 签入
   */
  @Debounce()
  validateTaskIdInEmpId() {
    return this.netService.send({
      server: commonService.smaController.validateTaskIdInEmpId,
    })
  }
}
