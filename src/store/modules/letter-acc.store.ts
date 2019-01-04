export default {
  namespaced: true,
  state: {
    printInfo: {},
    someSymbol: {},
    browserType: {},
    ymdDate: {}
  },
  mutations: {
    updatePrintInfo(state, value) {
      state.printInfo = value
    },
    printSomeSymbol(state, value) {
      state.someSymbol = value
    },
    browserType(state, value) {
      state.browserType = value
    },
    printYmdDate(state, value) {
      state.ymdDate = value
    }
  },
  actions: {
  }
}
