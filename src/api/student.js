import request from '@/utils/request'

export function getStudentList(params) {
  return request({
    url: '/student/queryStudentPage',
    method: 'get',
    params
  })
}

export function checkCourseStudentBusy(data) {
  return request({
    url: '/student/checkCourseStudentBusy',
    method: 'post',
    data
  })
}

export function queryStudentPageByCondition(params, data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && data[prop] === '') {
      delete data[prop]
    }
  }
  console.log('data:' + JSON.stringify(data))

  return request({
    url: '/student/queryPageByCondition',
    method: 'post',
    params,
    data
  })
}

export function addStudent(data) {
  console.log('student :' + data.studentNo)
  return request({
    url: '/student/addStudent',
    method: 'post',
    data
  })
}

export function updateStudent(data) {
  return request({
    url: '/student/updateStudent',
    method: 'put',
    data
  })
}

export function deleteStudent(data) {
  return request({
    url: '/student/deleteStudent',
    method: 'delete',
    data
  })
}
