import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from "~/core/service"

import md5 from "md5"
export class LoginService extends Service {

  @Inject(NetService)
  private netService: NetService

  /**
   * 登录
   */
  @Debounce()
  login({ username, password, usdeType }) {
    return this.netService.send({
      server: businessService.loginController.login,
      data: {
        username,
        password: md5(password),
        usdeType
      }
    })
  }

  /**
   * 登录
   */
  getUserByToken() {
    return this.netService.send({
      server: businessService.loginController.getUserByToken,
      skipAuth: true
    })
  }

  /**
   * 重置密码
   */
  resetPassword({ oldPassword, userId }) {
    return this.netService.send({
      server: businessService.loginController.resetPassword,
      data: {
        oldPassword,
        userId
      }
    })
  }
  /**
   * 修改密码
   */
  updatePassword({ oldPassword, newPassword }) {
    return this.netService.send({
      server: businessService.loginController.updatePassword,
      data: {
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword)
      }
    })
  }
  /**
   * 启用禁用设备
   */
  disableDevice({ userIds, usdeType, validate, usdeStatus }) {
    return this.netService.send({
      server: businessService.loginController.disableDevice,
      data: {
        userIds,
        usdeType,
        usdeStatus
      }
    })
  }
  /**
   * 启用禁用设备锁
   */
  enableDeviceKey({ userIds, usdeType, validate, usdeStatus }) {
    return this.netService.send({
      server: businessService.loginController.enableDeviceKey,
      data: {
        userIds,
        usdeType,
        validate
      }
    })
  }
  /**
   * 重置设备
   */
  resetDevice({ userIds, usdeType, validate, usdeStatus }) {
    return this.netService.send({
      server: businessService.loginController.resetDevice,
      data: {
        userIds,
        usdeType,
        validate,
        usdeStatus
      }
    })
  }
}

