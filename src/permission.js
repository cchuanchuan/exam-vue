// 取到需要权限判断的路由表
import { permissionRouter, fixedRouter } from '@/router'
import router from '@/router'
var addRouFlag = false

import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  // console.log("permission.hasToken:"+hasToken);

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          console.log('role===:' + store.getters.roles)
          // 取到用户的角色
          const GetRole = store.getters.roles[0]

          console.log(GetRole)
          // 如果登录了
          if (GetRole && GetRole !== 'unload') {
            next() // next()方法后的代码也会执行
            // 1.如果路由表 没根据角色进行筛选,就筛选一次
            if (!addRouFlag) {
              addRouFlag = true
              // 2.根据用户的角色、和需要动态展示的路由，生成符合用户角色的路由
              var getRoutes = baseRoleGetRouters(
                permissionRouter,
                GetRole.split(',')
              )
              // 3.利用global属性，让渲染菜单的组件sideMeuns.vue重新生成左侧菜单
              global.antRouter = fixedRouter.concat(getRoutes)
              // 4.将生成好的路由addRoutes
              router.addRoutes(fixedRouter.concat(getRoutes))
              // 5.push之后，会重新进入到beforeEach的钩子里,直接进入第一个if判断
              router.push({ path: to.path })
            }
          } else {
            // 用户没登录，跳转到登录页面
            if (to.path === '/') {
              next()
            } else {
              next('/')
            }
          }
          next()
        } catch (error) {
          // console.log("catch(error)")
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function hasPermission(route, roles) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}
// 根据用户的角色取到该用户对应的路由
function baseRoleGetRouters(allRoutes, roles) {
  // allRoutes是动态路由表
  // roles是取到的用户角色，数组
  const rightRoutes = allRoutes.filter((route, index) => {
    if (hasPermission(route, roles)) {
      if (route.children && route.children.length) {
        route.children = baseRoleGetRouters(route.children, roles)
      }
      return true
    }
    return false
  })
  return rightRoutes
}
