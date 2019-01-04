import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'
import { FilterService } from '~/utils/filter.service'

export class OutsourceService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 查询所有委外方
   */
  getAllOutsource(companyCode) {
    return this.netService.send({
      server: businessService.outsourceController.getAllOutsource,
      data: {
        companyCode
      }
    })
  }
  /**
   * 新增/修改委外方管理
   */
  @Debounce()
  createOutsource(data) {
    return this.netService.send({
      server: businessService.outsourceController.createOutsource,
      data: {
        id: data.id,
        outsCode: data.outsCode,
        outsName: data.outsName,
        outsOrgtype: data.outsOrgtype,
        outsAddress: data.outsAddress,
        outsContacts: data.outsContacts,
        outsMobile: data.outsMobile,
        outsPhone: data.outsPhone,
        outsEmail: data.outsEmail,
        outsRemark: data.outsRemark,
        areaId: data.areaId,
        prinCityid: data.prinCityid,
        prinCtyid: data.prinCtyid,
        companyCode: data.companyCode||'0001',
        flag: data.flag,
        areaList: data.areaList,
        outsLevel: data.outsLevel,
        contractStartTime: FilterService.dateRanageFormat(data.contractTime).start,
        contractEndTime: FilterService.dateRanageFormat(data.contractTime).end
      }
    })
  }
  /**
   * 删除委外方
   */
  @Debounce()
  deleteOutsource(id) {
    return this.netService.send({
      server: businessService.outsourceController.deleteOutsource,
      data: {
        id: id
      }
    })
  }
  /**
   * 统计委托方信息的 案件信息
   */
  getAllOutSourceInfoByCase(data, page) {
    return this.netService.send({
      server: businessService.outsourceController.getAllOutSourceInfoByCase,
      data,
      page
    })
  }
  /**
   * 查询委外方
   */
  query(data, page) {
    return this.netService.send({
      server: businessService.outsourceController.query,
      data: {
        areaCityId: data.cityList ? data.cityList[data.cityList.length-1] : "",
        outsCode: data.outsCode,
        outsName: data.outsName,
        outsOrgtype: data.outsOrgtype,
        outsMobile: data.outsMobile,
        outRegion: data.outRegion,
        companyCode: data.companyCode,
        flag: data.flag
      },
      page: page
    })
  }
}
