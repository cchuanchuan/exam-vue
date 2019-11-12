<template>
  <div class="app-container">
    <el-form ref="form" :model="examTemp" label-width="120px">
      <el-form-item>
        <h2 style="margin-left:300px">考试详情</h2>
      </el-form-item>
      <el-form-item label="考试课程">
        <el-input :value="row.courseName" disabled />
      </el-form-item>

      <el-form-item label="考试时间">
        <el-table
          v-show="displayTime"
          style="width: 800px;"
          :data="detailTime"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column align="center" label="学年">
            <template slot-scope="scope">{{ scope.row.grade }}</template>
          </el-table-column>
          <el-table-column label="学期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.semester }}</span>
            </template>
          </el-table-column>
          <el-table-column label="具体日期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.date }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="考试班级">
        <el-table
          v-show="displayClazs"
          style="width: 800px;"
          :data="clazsList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column align="center" label="班级名称">
            <template slot-scope="scope">{{ scope.row.className }}</template>
          </el-table-column>
          <el-table-column label="班级年级" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.classGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="班级人数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.classCount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="监考老师">
        <el-table
          v-show="displayTeacher"
          style="width: 800px;"
          :data="teacherList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column align="center" label="教师工号">
            <template slot-scope="scope">{{ scope.row.teacherNo }}</template>
          </el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.teacherName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="职称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.teacherProf }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话" align="center">
            <template slot-scope="scope">{{ scope.row.teacherPhone }}</template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="考试地点">
        <el-table
          v-show="displayClassRoom"
          style="width: 800px;"
          :data="classRoomList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column align="center" label="教室编号">
            <template slot-scope="scope">{{ scope.row.roomNo }}</template>
          </el-table-column>
          <el-table-column align="center" label="教室地点">
            <template slot-scope="scope">{{ scope.row.roomPlace }}</template>
          </el-table-column>
          <el-table-column align="center" label="教室容量">
            <template slot-scope="scope">{{ scope.row.roomCapacity }}</template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="margin-top: 15px">
        <router-link to="/welcome">
          <el-button type="warning" @click="handleDelete()">删除</el-button>
        </router-link>

        <el-button type="primary" @click="handleConfirm()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { queryTimeDatil, queryExamTeacherByExam, queryClassRoomByExam, queryClazsByExam, deleteExam } from '@/api/exam'

export default {
  data() {
    return {
      row: [],
      listLoading: false,
      displayTeacher: false,
      displayClass: false,
      displayClassRoom: false,
      displayClazs: false,
      displayTime: false,
      teacherList: [],
      teacherIdList: [],
      grades: [],
      clazses: [],
      classRoomList: [],
      clazsList: [],
      detailTime: [],
      examTime: {
        gradeId: '',
        timeDate: '',
        timeOrder: ''
      },
      examOrder: [
        { id: 1, name: '07:50-09:50' },
        { id: 2, name: '10:10-12:10' },
        { id: 3, name: '13:30-15:30' },
        { id: 4, name: '15:50-17:50' }
      ],
      examTemp: {
        examId: '',
        examTimeDto: '',
        courseId: '',
        roomIds: '',
        teacherIds: ''
      }
    }
  },
  created() { // create钩子
    this.row = JSON.parse(this.$route.query.flight) // 取
    console.log(this.row.id)
    console.log('flight=' + this.row.courseName)
    this.queryExamTeacherByExam()
    this.queryTimeDatil()
    this.queryClassRoomByExam()
    this.queryClazsByExam()
  },
  methods: { // 方法
    queryTimeDatil() {
      var examId = this.row.id
      var requestData = { examId }
      this.listLoading = true
      queryTimeDatil(requestData).then(res => {
        this.detailTime = res.data
        this.displayTime = true
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryExamTeacherByExam() {
      var examId = this.row.id
      var requestData = { examId }
      this.listLoading = true
      queryExamTeacherByExam(requestData).then(res => {
        this.teacherList = res.data
        this.displayTeacher = true
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryClassRoomByExam() {
      var examId = this.row.id
      var requestData = { examId }
      this.listLoading = true
      queryClassRoomByExam(requestData).then(res => {
        this.classRoomList = res.data
        this.displayClassRoom = true
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryClazsByExam() {
      var examId = this.row.id
      var requestData = { examId }
      this.listLoading = true
      queryClazsByExam(requestData).then(res => {
        console.log(res.data)
        this.clazsList = res.data
        this.displayClazs = true
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleConfirm() {
      this.$router.push({
        name: 'exam', // 页面名字
        path: '/exam' // 页面路劲 和上面名字任意一个都可以
      })
    },
    handleDelete() {
      this.temp = Object.assign({}, this.row) // copy obj
      deleteExam(this.temp).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
        this.handleConfirm()
      })
    }
  }
}
</script>
