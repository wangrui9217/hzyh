import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

// 引入模块
import workspace from './modules/workspace.store'
import message from './modules/message.store'
import inrushCase from './modules/inrush-case.store'
import taticManage from './modules/tatic-manage.store'
import accManage from './modules/acc-manage.store'
import outSourceManage from './modules/outsource-manage.store'
import caseManage from './modules/case-manage.store'
import systemManage from './modules/system-manage.store'
import letterAcc from './modules/letter-acc.store'
import specialManage from './modules/special-manage.store'
import stopCase from './modules/stop-case.store'


Vue.use(Vuex)

const filterList = ['ready', "layout"]

const store = new Vuex.Store({
  // 子模块
  modules: {
    "workspace": workspace,
    "message": message,
    "inrush-case": inrushCase,
    "tatic-manage": taticManage,
    "acc-manage": accManage,
    "outsource-manage": outSourceManage,
    "case-manage": caseManage,
    "letter-acc": letterAcc,
    "system-manage": systemManage,
    "special-manage": specialManage,
    "stop-case": stopCase,



  },
  state,
  getters,
  mutations,
  actions,
  plugins: [
    // 持久化存储插件
    createPersistedState({
      key: "vuex",
      reducer: (state, paths) => {
        return Object.assign({}, state, { ready: false, layout: "default" })
      },
      storage: localStorage,
      filter: ({ type, payload }) => {
        return !filterList.includes(type)
      }
    })
  ]
})

export default store
