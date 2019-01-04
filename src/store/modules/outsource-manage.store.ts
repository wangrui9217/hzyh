export default {
  namespaced: true,
  state: {
    selectedList: []

  },
  mutations: {
    /**
     * 更新state里面选中的案件
     * @param state 
     * @param selectCase 选择的案件列表
     */
    updateSelectedList(state, selectCase: string[]) {
      state.selectedList = selectCase || [];
    }
  },
  actions: {
  }
}
