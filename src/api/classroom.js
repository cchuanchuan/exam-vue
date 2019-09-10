import request from '@/utils/request'

export function queryClassRoomPage(params) {
  return request({
    url: '/classRoom/queryPage',
    method: 'get',
    params
  })
}

export function queryEmptyClassRoom(data) {
  return request({
    url: '/classRoom/queryEmptyClassRoom',
    method: 'post',
    data
  })
}

export function queryClassRoomPageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  return request({
    url: '/classRoom/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function queryClassRoomAll() {
  return request({
    url: '/classRoom/queryAll',
    method: 'get'
  })
}

export function addClassRoom(data) {
  console.log('classRoom :' + data)
  return request({
    url: '/classRoom/add',
    method: 'post',
    data
  })
}

export function updateClassRoom(data) {
  return request({
    url: '/classRoom/update',
    method: 'put',
    data
  })
}

export function deleteClassRoom(data) {
  return request({
    url: '/classRoom/delete',
    method: 'delete',
    data
  })
}
