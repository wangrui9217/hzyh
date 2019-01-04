import Vue from 'vue'
import Router from 'vue-router'
import store from '~/store'
import storeInit from '~/core/bootstrap/store.init'

import MessageAcc from './message-acc.route'
import systemManageRoute from './system-manage.route'
import caseImportRoute from './case-import.route'
import callAccRoute from './call-acc.route'
import VisitAccRoute from './visit-acc.route'
import EmailAcc from './email-acc.route'
import AssistAcc from './assist-acc.route'
import judicialAcc from './judicial-acc.route'
import caseSearch from './case-search.route'
import inrushcaseManage from './inrushcase-manage.route'
import outsourceManage from './outsource-manage.route'
import repaireManage from './repair-manage.route'
import reportManage from './report-manage.route'
import specialCaseManage from './special-case-manage.route'
import stopCollectionManage from './stop-collection-manage.route'
import letterAcc from './letter-acc.route'
import approvalManageRoute from './approval-manage.route'
import TemplateManage from './templete-manage.route'
import TaticsManage from './tatics-manage.route'
import AccManage from './acc-manage.route'
import DashboardRoute from './dashboard.route'
import RemindAccRoute from './remind-acc.route'
import FlowManageRoute from './flow-manage.route'
import { Message } from "element-ui"
const Login = () => import('~/pages/login.vue')
const NotFound = () => import('~/pages/not-found.vue')

Vue.use(Router)

// 生成路由配置
const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  ...MessageAcc,
  ...systemManageRoute,
  ...caseImportRoute,
  ...callAccRoute,
  ...VisitAccRoute,
  ...EmailAcc,
  ...AssistAcc,
  ...judicialAcc,
  ...caseSearch,
  ...inrushcaseManage,
  ...outsourceManage,
  ...repaireManage,
  ...reportManage,
  ...letterAcc,
  // ...caseManageRoute,
  ...approvalManageRoute,
  ...TemplateManage,
  ...TaticsManage,
  ...AccManage,
  ...DashboardRoute,
  ...RemindAccRoute,
  ...FlowManageRoute,
  ...specialCaseManage,
  ...stopCollectionManage,
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]

// 生成路由实体
const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.path === "/") {
    await store.dispatch("clearUserLoginData")
  }

  if (store.state.tokenExpire && to.path !== "/") {
    // 重置用户过期状态
    store.commit('updateTokenExpire', false)
    Message.info("用户登录过期,请重新登录")
    next("/")
  }

  if (!store.state.ready) {
    await storeInit({
      store,
      router
    })
  }

  next()
})

/**
 * 路由前置守卫
 * 权限检测
 */
router.beforeResolve(({ matched, path }, from, next) => {
  let component = getComponent(matched)
  if (component && authCheck(component)) {
    next('/404')
  } else {
    next()
  }
})

/**
 * 路由后置守卫
 * 布局检测
 */
router.afterEach((to, from) => {
  //  布局检测
  layoutCheck(to.matched)
  // Tab更新检测
  tabsCheck(to.path, from.path)
  localStorage.setItem('fromPath', from.path); //存储上级路由地址
})

function authCheck(component) {
  let auth = component['$auth']
  if (auth) {
    let target = store.state.menuResource.find(x => x.id === auth || auth < 0)
    return !target
  }
}

// 布局监测
function layoutCheck(matched) {
  let component = getComponent(matched)
  if (component) {
    let targetLayout = component['$layout'] || 'default'
    if (store.state.layout !== targetLayout) {
      store.commit('updateLayout', targetLayout )
    }
  }
}

function getComponent(matched) {
  if (matched && matched.length > 0) {
    let [{ components }] = matched
    return components.default
  }
}

/**
 * Tabs更新检测
 * @param toPath
 * @param fromPath
 */
function tabsCheck(toPath, fromPath) {
  if (!toPath || toPath == '/') {
    return
  }

  let toItem: any = store.state.menuResource.find((x: any) => x.url === toPath);
  let fromItem: any = store.state.menuResource.find((x: any) => x.url === fromPath);

  if (!toItem) {
    return
  }
  if (store.state.workspace.currentTabs.length == 0 || !fromItem) {
    store.dispatch('workspace/updateTabs', toItem.parentId)
  }

  if (toItem.url !== store.state.workspace.currentTab) {
    // 更新当前选中tab
    store.commit('workspace/updateCurrentTab', toItem.url)
  }
}

export default router
