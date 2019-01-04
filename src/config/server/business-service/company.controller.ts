import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'companyController'

export default {
  /**
   * 获取所有公司
   */
  getAllCompany: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllCompany',
    type: requestType.Get
  },
  /**
   * 查询注册公司
   */
  queryCompany: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCompany',
    type: requestType.Get
  },
  /**
   * 新增公司
   */
  createCompany: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createCompany',
    type: requestType.Post
  },
  /**
   *修改注册公司
   */
  updateCompany: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateCompany',
    type: requestType.Post
  },
  /**
   *获取公司通过code
   */
  getCompanyByCode: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCompanyByCode',
    type: requestType.Get
  }
}
