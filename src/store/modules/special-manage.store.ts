export default {
  namespaced: true,
  state: {
    allotCase: []
  },
  mutations: {
    updateWaitAllotCase(state, someCases: any[]) {
      state.allotCase = someCases || []
    }
  },
  actions: {

  }
}