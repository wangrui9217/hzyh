import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'strateDataManualController'

export default {
  /**
   * 预览策略
   */
  previewResult: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'previewResult',
    type: requestType.Post
  }
}
