export default {
  namespaced: true,
  state: {
    stopCaseList: []
  },
  mutations: {
    updateWaitStopCase(state, someCase: any[]) {
      state.stopCaseList = someCase || []
    }
  },
  actions: {

  }
}