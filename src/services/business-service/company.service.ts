import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class CompanyService extends Service {

  @Inject(NetService)
  private netService: NetService

  /**
   * 获取公司列表
   */
  getCompanyList() {
    return this.netService.send({
      server: businessService.companyController.getAllCompany
    })
  }
  /**
   * 查询公司
   * @param 查询条件
   * @page 页码信息
   */
  queryCompanyList(params, page) {
    return this.netService.send({
      server: businessService.companyController.queryCompany,
      data: {
        chinaName: params.chinaName,
        engName: params.engName,
        state: params.state,
        code: params.code,
        legPerson: params.legPerson,
        address: params.address,
        city: params.city,
        phone: params.phone,
        fax: params.fax,
        contactPerson: params.contactPerson
      },
      page
    })
  }
  /**
   * 创建公司
   * @param params
   */
  @Debounce()
  createCompany(data) {
    return this.netService.send({
      server: businessService.companyController.createCompany,
      data: data
    })
  }
  /**
   * 修改注册公司
   * @param params
   */
  @Debounce()
  updateCompany(data) {
    return this.netService.send({
      server: businessService.companyController.updateCompany,
      data: data
    })
  }
  /**
  * 获取所有公司
  * @param params
  */
  getAllCompany(data) {
    return this.netService.send({
      server: businessService.companyController.getAllCompany
    })
  }
  /**
 * 获取公司通过code
 * @param params
 */
  getCompanyByCode({ code }) {
    return this.netService.send({
      server: businessService.companyController.getCompanyByCode,
      code: code
    })
  }
}

