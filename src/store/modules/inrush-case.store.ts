import Axios from "../../../node_modules/axios";

export default {
  namespaced: true,
  state: {
    caseAllotUser: [],
    caseAllotOrg: {},
    waitCollectCase: [],
    selectedCase: [],//选中的案件，要分配的案件的ID
    selectedList: []
  },
  mutations: {
    updateCaseAllotUser(state, user: string[]) {
      state.caseAllotUser = user || []
    },
    updateCaseAllotOrg(state, org) {
      state.caseAllotOrg = org
    },
    /**
     * 更新state里面选中的案件
     * @param state 
     * @param someCase 选择的申请号组数
     * 
     */
    updateSelectedCase(state, someCase: string[]) {
      state.selectedCase = someCase || [];

    },
    /**
     * 更新state里面选中的案件
     * @param state 
     * @param selectCase 选择的案件列表
     */
    updateSelectedList(state, selectCase: string[]) {
      state.selectedList = selectCase || [];

    },
    updateWaitCollectCase(state, waitCases: any[]) {
      state.waitCollectCase = waitCases || []
    }
  },
  actions: {
  }
}
