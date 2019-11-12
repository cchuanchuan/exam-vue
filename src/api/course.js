import request from '@/utils/request'

export function queryCoursePage(params) {
  return request({
    url: '/course/queryPage',
    method: 'get',
    params
  })
}

export function queryCourseIdByClassId(params) {
  return request({
    url: '/course/queryCourseIdByClassId',
    method: 'get',
    params
  })
}

export function queryCoursePageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  return request({
    url: '/course/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function queryCourseAll() {
  return request({
    url: '/course/queryAll',
    method: 'get'
  })
}

export function queryCourseAllByCondition(data) {
  return request({
    url: '/course/queryAllByCondition',
    method: 'post',
    data
  })
}

// export function queryCourseByTimeGrade(params) {
//   return request({
//     url: '/course/queryCourseByTimeGrade',
//     method: 'get',
//     params
//   })
// }

export function addCourse(data) {
  console.log('course :' + data)
  return request({
    url: '/course/add',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request({
    url: '/course/update',
    method: 'put',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: '/course/delete',
    method: 'delete',
    data
  })
}
