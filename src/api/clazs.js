import request from '@/utils/request'

export function getClazstList(params) {
  return request({
    url: '/clazs/queryPage',
    method: 'get',
    params
  })
}

export function getAllClazs(params) {
  return request({
    url: '/clazs/queryAll',
    method: 'get',
    params
  })
}

export function queryClazsPageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  return request({
    url: '/clazs/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function queryClazsByCourse(params) {
  return request({
    url: '/clazs/queryClazsByCourse',
    method: 'get',
    params
  })
}

export function addClazs(data) {
  return request({
    url: '/clazs/add',
    method: 'post',
    data
  })
}

export function updateClazs(data) {
  return request({
    url: '/clazs/update',
    method: 'put',
    data
  })
}

export function deleteClazs(data) {
  return request({
    url: '/clazs/delete',
    method: 'delete',
    data
  })
}
