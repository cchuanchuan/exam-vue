import request from '@/utils/request'

export function queryExamPage(params) {
  return request({
    url: '/exam/queryPage',
    method: 'get',
    params
  })
}

export function queryExamPageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  return request({
    url: '/exam/queryExamPageShow',
    method: 'post',
    params,
    data
  })
}

export function queryExamAll() {
  return request({
    url: '/exam/queryAll',
    method: 'get'
  })
}

export function queryExamAllByCondition(data) {
  return request({
    url: '/exam/queryAllByCondition',
    method: 'post',
    data
  })
}

export function addExamDto(data) {
  return request({
    url: '/exam/addExamDto',
    method: 'post',
    data
  })
}

export function addExam(data) {
  console.log('exam :' + data)
  return request({
    url: '/exam/add',
    method: 'post',
    data
  })
}

export function updateExam(data) {
  return request({
    url: '/exam/update',
    method: 'put',
    data
  })
}

export function deleteExam(data) {
  return request({
    url: '/exam/delete',
    method: 'delete',
    data
  })
}

export function queryTimeDatil(params) {
  return request({
    url: '/exam/queryTimeDatil',
    method: 'get',
    params
  })
}

export function queryExamTeacherByExam(params) {
  return request({
    url: '/exam/queryExamTeacherByExam',
    method: 'get',
    params
  })
}

export function queryClassRoomByExam(params) {
  return request({
    url: '/exam/queryClassRoomByExam',
    method: 'get',
    params
  })
}

export function queryClazsByExam(params) {
  return request({
    url: '/exam/queryClazsByExam',
    method: 'get',
    params
  })
}
