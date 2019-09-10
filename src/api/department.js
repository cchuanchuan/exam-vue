import request from '@/utils/request'

export function queryDepartmentPage(params) {
  return request({
    url: '/department/queryPage',
    method: 'get',
    params
  })
}

export function queryDepartmentPageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  return request({
    url: '/department/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function queryDepartmentAll() {
  return request({
    url: '/department/queryAll',
    method: 'get'
  })
}

export function addDepartment(data) {
  console.log('department :' + data)
  return request({
    url: '/department/add',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/department/update',
    method: 'put',
    data
  })
}

export function deleteDepartment(data) {
  return request({
    url: '/department/delete',
    method: 'delete',
    data
  })
}
