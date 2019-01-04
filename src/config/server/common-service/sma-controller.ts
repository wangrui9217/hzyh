import { requestType } from '~/config/enum.config'

const SERVICE = 'common-service'
const CONTROLLER = 'smaController'

export default {
  /**
   * 开始电话呼叫
   */
  addTaskRecorder: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addTaskRecorder',
    type: requestType.Post
  },
  /**
   * 调用sma接口保存录音文件
   */
  addTaskVoiceFileByTaskId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addTaskVoiceFileByTaskId',
    type: requestType.Post
  },
  /**
   * 绑定呼叫ID(绑定主叫号码)
   */
  bindTaskDataByCallerId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'bindTaskDataByCallerId',
    type: requestType.Post
  },
  /**
   * 验证呼叫来源
   */
  checkCall: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkCall',
    type: requestType.Get
  },
  /**
   * 呼叫类型
   */
  getSmaType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getSmaType',
    type: requestType.Get
  },
  /**
   * 查询客户id的呼叫所有录音
   */
  getVoice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVoice',
    type: requestType.Get
  },
  /**
   * 签入
   */
  // signIn: {
  //   service: SERVICE,
  //   controller: CONTROLLER,
  //   action: 'signIn',
  //   type:  requestType.Post
  // },
  /**
   * 签出
   */
  signOut: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'signOut',
    type: requestType.Post
  },
  /**
   * 验证呼叫ID是否绑定
   */
  validateTaskIdInEmpId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'validateTaskIdInEmpId',
    type: requestType.Get
  },
}
