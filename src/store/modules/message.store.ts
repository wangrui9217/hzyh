export default {
  namespaced: true,
  state: {
    currentUser:''
  },
  mutations: {
    updateCurrentUser(state,user){
      state.currentUser = user
    }
  },
  actions: {
  }
}
