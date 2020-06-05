import Vue from 'vue'
import Router from 'vue-router'

import layout from '@/layout'

// const layout = () => import('@/components/layout')
Vue.use(Router)
// 固定的路由表
export const fixedRouter = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/',
    component: layout,
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('@/views/welcome/index'),
        meta: { title: '欢迎界面', icon: 'dashboard' },
      },
    ],
  },
]
// 需要权限判断展示的路由
export const permissionRouter = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/example',
    component: layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '信息管理', icon: 'example' },
    children: [
      {
        path: 'student',
        name: 'student',
        component: () => import('@/views/table/student'),
        meta: {
          title: '学生信息管理',
          roles: ['admin-user', 'teacher-user'],
          icon: 'table',
        },
      },
      {
        path: 'teacher',
        name: 'teacher',
        component: () => import('@/views/table/teacher'),
        meta: {
          title: '教师信息管理',
          roles: ['admin-user', 'teacher-user'],
          icon: 'table',
        },
      },
      {
        path: 'course',
        name: 'course',
        component: () => import('@/views/table/course'),
        meta: {
          title: '课程信息管理',
          roles: ['admin-user', 'teacher-user'],
          icon: 'table',
        },
      },
      {
        path: 'clazs',
        name: 'clazs',
        component: () => import('@/views/table/clazs'),
        meta: {
          title: '班级信息管理',
          roles: ['admin-user', 'teacher-user'],
          icon: 'table',
        },
      },
      {
        path: 'classroom',
        name: 'classroom',
        component: () => import('@/views/table/classroom'),
        meta: {
          title: '教室信息管理',
          roles: ['admin-user', 'teacher-user'],
          icon: 'table',
        },
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/table/department'),
        meta: {
          title: '院系信息管理',
          roles: ['admin-user', 'teacher-user'],
          icon: 'table',
        },
      },

      {
        path: 'student',
        name: 'student',
        component: () => import('@/views/stable/student'),
        meta: {
          title: '学生信息',
          roles: ['student-user'],
          icon: 'table',
        },
      },
      {
        path: 'teacher',
        name: 'teacher',
        component: () => import('@/views/stable/teacher'),
        meta: {
          title: '教师信息',
          roles: ['student-user'],
          icon: 'table',
        },
      },
      {
        path: 'course',
        name: 'course',
        component: () => import('@/views/stable/course'),
        meta: {
          title: '课程信息',
          roles: ['student-user'],
          icon: 'table',
        },
      },
      {
        path: 'clazs',
        name: 'clazs',
        component: () => import('@/views/stable/clazs'),
        meta: {
          title: '班级信息',
          roles: ['student-user'],
          icon: 'table',
        },
      },
      {
        path: 'classroom',
        name: 'classroom',
        component: () => import('@/views/stable/classroom'),
        meta: {
          title: '教室信息',
          roles: ['student-user'],
          icon: 'table',
        },
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/stable/department'),
        meta: {
          title: '院系信息',
          roles: ['student-user'],
          icon: 'table',
        },
      },
    ],
  },

  {
    path: '/form',
    component: layout,
    redirect: '/form/index',
    name: 'Form',
    meta: {
      title: '考务管理',
      icon: 'form',
    },
    children: [
      {
        path: 'addExam',
        name: 'AddExam',
        component: () => import('@/views/form/addExam'),
        meta: {
          title: '添加考试',
          roles: ['admin-user', 'teacher-user'],
          icon: 'form',
        },
      },
      {
        path: 'exam',
        name: 'exam',
        component: () => import('@/views/table/exam'),
        meta: {
          title: '考试信息管理',
          roles: ['admin-user', 'teacher-user'],
          icon: 'table',
        },
      },
      {
        path: '/examDetail',
        name: 'examDetail',
        component: () => import('@/views/table/examDetail'),
        hidden: true,
      },
      {
        path: 'exam',
        name: 'exam',
        component: () => import('@/views/stable/exam'),
        meta: {
          title: '考试信息查看',
          roles: ['student-user'],
          icon: 'table',
        },
      },
      {
        path: '/sexamDetail',
        name: 'sexamDetail',
        component: () => import('@/views/stable/examDetail'),
        hidden: true,
      },
    ],
  },
  {
    path: 'external-link',
    component: layout,
    children: [
      {
        path: 'http://jwc.njit.edu.cn/',
        roles: ['admin-user', 'teacher-user', 'student-user'],
        meta: { title: '教务处', icon: 'link' },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () => {
  console.log('create router')
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: fixedRouter,
  })
}

const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
