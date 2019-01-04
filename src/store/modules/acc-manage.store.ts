import router from '~/router'
const createAccTelPoolService = () => import("~/services/business-service/acc-tel-pool.service")
const createCaseInfoService = () => import("~/services/business-service/case-info.service")
const createPersonalInformationService = () => import("~/services/business-service/personal-Information.service")
export default {
  namespaced: true,
  state: {
    isMessage: 0, // 刷新短信记录
    caseId: '',
    custId: '',
    assistId: '',
    caseNum: '',
    taskId: '',
    caller: '',
    caseRepairId: '',
    /*
      上级页面查询数据的实体，用于右侧List　拼接查询
      案件数据查询实体 包含 
      caseType: collectionType
      status : collectionStatusList
    */
    searchModel: {},
    caseInfo: {},
    commonCaseCount: '',
    callInfo: {}, // 电话回传信息
    caseDetail: {}, // 案件详情信息
    repayInfo: {}, //还款信息
    callerInfo: {}, // 呼叫信息
    follRecordList: {}, //更新跟进记录
    assitRecordFlag: '', // 协催记录更新监听标识
    visitRecordFlag: '', // 外访记录更新标识
    repayRecordFlag: '', // 还款金额标识
    showContact: false,  // 是否显示通讯录
    currentDisplayAreaName: "base-info-area",
    currentCaseTabName: "base-info",
    currentBusinessTabName: "add-call-record", //默认显示Tab
    refreshState: ''
  },
  mutations: {
    updateRefreshState(state, data) {
      state.refreshState = data
    },
    updateCaseInfo(state, data) {
      state.caseInfo = data
      state.custId = data.id
      state.caseNum = data.caseNumber
    },
    updateIsMessage(state) {
      state.isMessage++
    },
    updateCaseId(state, id) {
      state.caseId = id
    },
    updateSearchModel(state, model) {
      state.searchModel = model
    },
    updateCaseRepairId(state, caseRepairId) {
      state.caseRepairId = caseRepairId
    },
    updateAssistId(state, id) {
      state.assistId = id
    },
    updateCommonCaseCount(state, id) {
      state.commonCaseCount = id
    },
    updateAssitRecord(state, time) {
      state.assitRecordFlag = time
    },
    updateVisitRecord(state, time) {
      state.visitRecordFlag = time
    },
    updateRepayRecord(state, time) {
      state.repayRecordFlag = time
    },
    resetState(state) {
      state.currentDisplayAreaName = "base-info-area"
      state.currentCaseTabName = "base-info"
      state.currentBusinessTabName = "follow-record"
      state.showContact = false
    },
    updateCurrentDisplayAreaName(state, name) {
      state.currentDisplayAreaName = name
    },
    updateCurrentCaseTabName(state, name) {
      state.currentCaseTabName = name
    },
    updateCurrentBusinessTabName(state, name) {
      state.currentBusinessTabName = name
    },
    //更新呼叫信息
    updateCallerInfo(state, value) {
      state.callerInfo = value
    },
    //更新跟进记录
    updateFollRecord(state, value) {
      state.follRecordList = value
    },
    //更新电话回传信息
    updateCallInfo(state, value) {
      state.callInfo = value
    },
    updateTaskId(state, value) {
      state.taskId = value
    },
    updateCaller(state, value) {
      state.caller = value
    },
    updateCaseDetail(state, value) {
      state.caseDetail = value
    },
    updateRepayInfo(state, value) {
      state.repayInfo = value
    }
  },
  actions: {
    /**
     * 获取公债案件数量
     * @param param
     */
    async getDebtCaseCount({ state, commit }) {
      let { CaseInfoService } = await createCaseInfoService()

      CaseInfoService
        .getInstance()
        .getCommonCaseCount(state.caseId)
        .subscribe(({ count }) => {
          commit("updateCommonCaseCount", count)
        })
    },

    async getCaseDetail({ state,commit }) {
      let { PersonalInformationService } = await createPersonalInformationService()

      PersonalInformationService
        .getInstance()
        .getPersonalByCaseId(state.caseId)
        .subscribe(data => {
          commit("updateCaseDetail", data)
        })

        PersonalInformationService
        .getInstance()
        .getCaseInformationModelByCaseId(state.caseId)
        .subscribe(data => {
          commit("updateRepayInfo", data)
        })
    },
    /**
     * 获取案件信息
     * @param param0
     * @param param1
     */
    async getCaseInfoByCaseId({ state, commit, dispatch }, caseId) {
      let { AccTelPoolService } = await createAccTelPoolService()
      return new Promise((resolve, reject) => {
        AccTelPoolService
          .getInstance()
          .getCaseInfoByCaseId(caseId).subscribe(data => {
            // 更新公债案件数量
            dispatch("getDebtCaseCount")
            // 更新案件详情
            dispatch("getCaseDetail")
            // 更新案件信息
            commit("updateCaseInfo", data)
            // 更新案件ID
            commit("updateCaseId", caseId)
            resolve()
          }, () => {
            reject()
          })
      })
    },

    async syanPersonalInfo({ state, commit, dispatch }, { personalId, cardId }) {
      let { AccTelPoolService } = await createAccTelPoolService()
      return new Promise((resolve, reject) => {
        AccTelPoolService
          .getInstance()
          .syncPersonalContact(personalId, cardId).subscribe(data => {
            resolve()
          }, (err) => {
            reject(err)
          })
      })
    },

    /**
     * 打开催收执行页面
     * @param param0
     * @param param1
     */
    async openAccCenter({ getters, dispatch, commit }, {
      caseId, searchModel, assistId, caseRepairId
    }) {
      // 重置页面状态
      commit("resetState")
      // 更新协催ID
      commit("updateAssistId", assistId)
      /*
         案件数据查询实体 包含 
         caseType: collectionType
         status : collectionStatusList
      */
      commit('updateSearchModel', searchModel)
      commit('updateCaseRepairId', caseRepairId)
      // 更新案件信息
      await Promise.all([
        dispatch("getCaseInfoByCaseId", caseId),
      ]).catch(ex => {
        console.log("用户信息同步异常")
      })

      router.push("/acc-manage/acc-center")
    }
  }
}
