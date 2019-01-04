
import { requestType } from '~/config/enum.config'
const SERVICE = 'business-service'
/**
 * 系统备份控制器
 */
const CONTROLLER = 'systemBackupController'

export default {
  /**
   * 增加系统数据库备份
   */
  createSystemBackup: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createSystemBackup',
    type: requestType.Post
  },
  /**
   * 删除系统数据库备份
   */
  deleteSystemBackup: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteSystemBackup',
    type: requestType.Post
  },
  /**
   * 查询系统备份
   */
  querySystemBackup: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'querySystemBackup',
    type: requestType.Get
  },
  /**
   * 恢复系统数据库备份
   */
  recoverSystemBackup: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'recoverSystemBackup',
    type: requestType.Post
  }
}
