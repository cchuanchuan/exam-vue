import request from '@/utils/request'

export function queryTeacherPage(params) {
  return request({
    url: '/teacher/queryPage',
    method: 'get',
    params
  })
}

export function queryTeacherPageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  console.log('data:' + JSON.stringify(data))

  return request({
    url: '/teacher/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function queryHasTimeTeacher(data) {
  return request({
    url: '/teacher/queryHasTimeTeacher',
    method: 'post',
    data
  })
}

export function addTeacher(data) {
  console.log('teacher :' + data)
  return request({
    url: '/teacher/add',
    method: 'post',
    data
  })
}

export function updateTeacher(data) {
  return request({
    url: '/teacher/update',
    method: 'put',
    data
  })
}

export function deleteTeacher(data) {
  return request({
    url: '/teacher/delete',
    method: 'delete',
    data
  })
}
