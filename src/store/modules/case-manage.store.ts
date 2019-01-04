const createDataInfoExcelService = () => import("~/services/dataimp-service/data-info-excel.service")
export default {
  namespaced: true,
  state: {
    caseAllotOrg: null, // 案件分配机构列表
    clientList: [], // 委托方列表
    batchList: [], // 批次号列表
    caseAllotUser: [], //案件分配用户Id
    importSuccess: false // 案件导入是否成功
  },
  getters: {},
  mutations: {
    // 更新委托方列表
    updateClientList(state, data) {
      state.clientList = data
    },
    updateStatus(state, flag:Boolean) {
      state.importSuccess = flag
    },
    // 更新批次号列表
    updateBatchList(state, data) {
      state.batchList = data
    },
    // 案件分配机构列表
    updateCaseAllotOrg(state, data) {
      state.caseAllotOrg = data
    },
    // 案件分配用户Id
    updateCaseAllotUser(state, data) {
      state.caseAllotUser = data
    }
  },
  actions: {
    /**
     * 获取批次号列表
     */
    async getBatchList({ state, commit }, { companyCode }) {
      let { DataInfoExcelService } = await createDataInfoExcelService()
      DataInfoExcelService.
        getInstance()
        .queryBatchNumGroup(companyCode).subscribe(data => {
          commit("updateBatchList", data)
          if (state.importSuccess) {
            commit("updateStatus", false)
          }
        })
    }
  }


}
