import request from '@/utils/request'

export function queryTimePage(params) {
  return request({
    url: '/time/queryPage',
    method: 'get',
    params
  })
}

export function queryTimePageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  return request({
    url: '/time/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function queryTimeAll() {
  return request({
    url: '/time/queryAll',
    method: 'get'
  })
}

export function queryDistinctGrade() {
  return request({
    url: '/time/queryDistinctGrade',
    method: 'get'
  })
}

export function addTime(data) {
  console.log('time :' + data)
  return request({
    url: '/time/add',
    method: 'post',
    data
  })
}

export function updateTime(data) {
  return request({
    url: '/time/update',
    method: 'put',
    data
  })
}

export function deleteTime(data) {
  return request({
    url: '/time/delete',
    method: 'delete',
    data
  })
}
