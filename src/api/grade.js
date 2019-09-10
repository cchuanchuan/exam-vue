import request from '@/utils/request'

export function queryGradePage(params) {
  return request({
    url: '/grade/queryPage',
    method: 'get',
    params
  })
}

export function queryGradePageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  console.log('data:' + JSON.stringify(data))

  return request({
    url: '/grade/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function queryGradeAll() {
  return request({
    url: '/grade/queryAll',
    method: 'get'
  })
}

export function queryGradeAllByCondition(params) {
  return request({
    url: '/grade/queryAllByCondition',
    method: 'post',
    params
  })
}

export function addGrade(data) {
  console.log('grade :' + data)
  return request({
    url: '/grade/add',
    method: 'post',
    data
  })
}

export function updateGrade(data) {
  return request({
    url: '/grade/update',
    method: 'put',
    data
  })
}

export function deleteGrade(data) {
  return request({
    url: '/grade/delete',
    method: 'delete',
    data
  })
}
