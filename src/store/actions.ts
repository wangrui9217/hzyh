import router from '~/router'
import { ReminderService } from "~/utils/reminder.service"

const creatCompanyService = () => import('~/services/business-service/company.service')
const createPrincipalService = () => import('~/services/business-service/principal.service')
const createDepartmentService = () => import('~/services/business-service/department.service')
const createOutsourceService = () => import('~/services/business-service/outsource.service')
const createProductSeriesService = () => import("~/services/business-service/product-series.service");

export default {
  /**
   * 更新公司列表
   */
  async getCompanyList({ getters, dispatch, commit }) {
    let { CompanyService } = await creatCompanyService()

    CompanyService.getInstance()
      .getCompanyList()
      .subscribe(data => {
        commit('updateCompanyList', data)
      })
  },
  /**
   * 更新委托方列表
   */
  async getPrincipalList({ state, commit }) {
    let { PrincipalService } = await createPrincipalService()

    PrincipalService.getInstance()
      .getPrincipalList(state.userData.companyCode)
      .subscribe(data => {
        commit('updatePrincipalList', data)
      })
  },
  /**
   * 更新门店列表
   */
  async getStoreList({ state, commit }) {
    let { DepartmentService } = await createDepartmentService()

    DepartmentService.getInstance()
      .queryShopDept(state.userData.companyCode)
      .subscribe(data => {
        commit('updateStoreList', data)
      })
  },
  /**
   * 获取部门数据
   * @param param0
   */
  async getDepartmentList({ commit }) {
    let { DepartmentService } = await createDepartmentService()

    DepartmentService.getInstance()
      .queryOwnDepartment()
      .subscribe(data => {
        commit('updateDepartmentList', data)
      });
  },
  /**
  * 更新受托方列表
  */
  async getAllOutsource({ state, commit }) {
    let { OutsourceService } = await createOutsourceService()

    OutsourceService.getInstance()
      .getAllOutsource(state.userData.companyCode)
      .subscribe(data => {
        commit('updateOutSourceList', data)
      });
  },
  /**
   * 更新产品类型下拉菜单列表
   */
  async getProductSeriesName({state,commit}) {
    let { ProductSeriesService } = await createProductSeriesService()
    ProductSeriesService.getInstance()
      .getAllProductSeries()
      .subscribe(data => {
        commit('updateProductSeriesName',data)
      });
  },
  /**
   * 更新用户登录数据
   */
  updateUserLoginData({ state, commit, dispatch }, { token, user }) {
    // 更新用户token
    if (!!token) {
      commit('updateUserToken', token);
    }
    // 更新用户控件资源
    commit('updateUserMenuResource', user.menu);

    // 更新用户菜单资源
    commit('updateUserControlResource', user.resource);

    // 更新公司编号
    commit('updateCompanyCode', user.companyCode);

    // 更新用户数据
    commit('updateUserData', {
      id: user.id,
      callPhone: user.callPhone,
      companyCode: user.companyCode,
      deptId: user.deptId,
      email: user.email,
      field: user.field,
      loginAddress: user.loginAddress,
      loginDevice: user.loginDevice,
      loginType: user.loginType,
      manager: user.manager,
      messagePushId: user.messagePushId,
      operateTime: user.operateTime,
      operator: user.operator,
      phone: user.phone,
      photo: user.photo,
      realName: user.realName,
      remark: user.remark,
      sex: user.sex,
      signature: user.signature,
      status: user.status,
      type: user.type,
      userName: user.userName,
      zoneno: user.zoneno,
    });

    // 根据用户信息更新用户相关数据
    // 更新委托方数据
    dispatch('getPrincipalList')
    // 更新受托方数据
    dispatch('getAllOutsource')
    // 更新机构数据
    dispatch('getDepartmentList')
    // 更新产品类型下拉菜单
    dispatch('getProductSeriesName')
    // 更新门店数据
    // dispatch('getStoreList')
    // 连接消息推送
    ReminderService.connect()
  },
  /**
   * 清除登录数据
   */
  clearUserLoginData({ commit }) {
    // 重置用户token
    commit('updateUserToken', "");
    // 更新用户菜单资源
    commit('updateUserMenuResource', []);
    // 重置用户控件资源
    commit('updateUserControlResource', []);
    // 重置用户数据
    commit('updateUserData', {})
    // 重置受托方列表
    commit('updateOutSourceList', [])
    // 重置委托方列表
    commit("updatePrincipalList", [])
    // 重置门店列表
    commit("updateStoreList", [])
    // 更新公司编号
    commit('updateCompanyCode', "");
    //重置token过期标识
    commit('updateTokenExpire', false);
  }
}
