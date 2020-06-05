<template>
  <div class="app-container">
    <el-form ref="form" :model="examTemp" label-width="120px">
      <el-form-item>
        <h2 style="margin-left:300px">添加考试</h2>
      </el-form-item>
      <el-form-item label="学期学年">
        <el-select
          v-model="examTime.gradeId"
          class="filter-item"
          placeholder="选择学期"
          @change="handleGrade"
        >
          <el-option
            v-for="item in grades"
            :key="item.id"
            :label="getGradeString(item.grade,item.semester)"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考试课程">
        <el-select
          v-model="examTemp.courseId"
          class="filter-item"
          clearable
          placeholder="选择课程"
          @change="handleCourse"
        >
          <el-option
            v-for="item in courses"
            :key="item.id"
            :label="item.courseName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="displayClass" label="考试班级">
        <el-table
          style="width: 800px;"
          :data="clazses"
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
          <el-table-column align="center" label="班级年级">
            <template slot-scope="scope">{{ scope.row.classGrade }}</template>
          </el-table-column>
          <el-table-column align="center" label="班级人数">
            <template slot-scope="scope">{{ scope.row.classCount }}</template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="考试时间">
        <el-date-picker
          v-model="examTime.timeDate"
          class="filter-item"
          placeholder="选择考试时间"
          @change="handleTime"
        />-
        <el-select
          v-model="examTime.timeOrder"
          class="filter-item"
          placeholder="选择场次"
          @change="handleTime"
        >
          <el-option v-for="item in examOrder" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
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
        <div style="margin-top: 10px">
          <el-button @click="displayTeacherForm=true">选择监考老师</el-button>
        </div>
      </el-form-item>
      <el-form-item label="考试地点">
        <el-table
          v-show="displayClassRoom"
          style="width: 800px;"
          :data="classList"
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
        <div style="margin-top: 10px">
          <el-button @click="handleClassRoom()">选择教室</el-button>
        </div>
      </el-form-item>
      <el-form-item style="margin-top: 15px">
        <router-link to="/welcome">
          <el-button type="info" @click="displayClassForm=false">取消</el-button>
        </router-link>

        <el-button type="primary" @click="handleConfirm()">确认添加</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="选择考试教室" :visible.sync="displayClassForm">
      <el-table
        :data="classRooms"
        element-loading-text="Loading"
        height="250"
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
        <el-table-column align="center" label="请选择" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.ischoose" />
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px">
        <el-button type="info" @click="displayClassForm=false">取消</el-button>
        <el-button type="primary" @click="handleChooseClassRoom()">确认选择</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择监考老师" :visible.sync="displayTeacherForm">
      <el-table
        :data="teachers"
        element-loading-text="Loading"
        height="250"
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
        <el-table-column align="center" label="请选择" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.ischoose" />
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px">
        <el-button type="info" @click="displayTeacherForm=false">取消</el-button>
        <el-button type="primary" @click="handleChooseTeacher()">确认选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryCourseAllByCondition } from '@/api/course'
import { queryGradeAll } from '@/api/grade'
import { queryHasTimeTeacher } from '@/api/teacher'
import { checkCourseStudentBusy } from '@/api/student'
import { queryEmptyClassRoom } from '@/api/classroom'
import { queryClazsByCourse } from '@/api/clazs'
import { addExamDto } from '@/api/exam'

export default {
  data() {
    return {
      listLoading: false,
      displayClassForm: false,
      displayTeacherForm: false,
      displayTeacher: false,
      displayClass: false,
      displayClassRoom: false,
      grades: [],
      courses: [],
      teachers: [],
      teacherList: [],
      teacherIdList: [],

      clazses: [],
      classList: [],
      classIdList: [],
      classRooms: [],
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
    this.getGradeList()
  },
  methods: { // 方法
    getGradeList() {
      queryGradeAll().then(res => {
        this.grades = res.data
        console.log(JSON.stringify(this.grades))
      })
    },
    getCourseByGrade() {
      var gradeId = this.examTime.gradeId
      var requestData = {}
      requestData.gradeId = gradeId
      console.log(requestData)
      queryCourseAllByCondition(requestData).then(res => {
        this.courses = res.data
      })
    },
    getGradeString(grade, semester) {
      if (semester = 1) {
        return '第' + (grade - 1) + '-' + grade + '学年,第二学期'
      } else if (semester = 2) {
        return '第' + grade + '-' + (grade + 1) + '学年,第一学期'
      }
      return ''
    },
    getTeacherList() {
      queryHasTimeTeacher(this.examTime).then(res => {
        this.teachers = res.data
      })
    },
    handleGrade() {
      this.getCourseByGrade()
    },
    handleCourse() {
      var courseId = this.examTemp.courseId
      var requestData = { courseId }
      queryClazsByCourse(requestData).then(res => {
        this.clazses = res.data
      })
      this.displayClass = true
    },
    handleTime() {
      console.log('handleTime')
      if (this.examTime.timeOrder !== '') {
        var examTimeDto = this.examTime
        var requestData = {}
        requestData.courseId = this.examTemp.courseId
        requestData.examTimeDto = examTimeDto
        checkCourseStudentBusy(requestData).then(res => {
          if (res.data !== true) {
            alert('该时间段部分学生有课或有考试!')
            this.teachers = []
          } else {
            this.getTeacherList()
          }
        })
      } else {
        this.teachers == null
      }
    },
    handleTeacher() {
      console.log('handleTeacher')
    },
    handleClassRoom() {
      queryEmptyClassRoom(this.examTime).then(res => {
        this.classRooms = res.data
      })
      this.displayClassForm = true
      console.log('handleClassRoom')
    },
    handleChooseClassRoom() {
      console.log('handleChooseClassRoom')
      var tempList = []
      var tempIdList = []
      this.displayClassForm = false
      this.classRooms.forEach(function(val, index) {
        if (val.ischoose === true) {
          tempList.push(val)
          tempIdList.push(val.id)
        }
      })
      this.classList = tempList
      this.classIdList = tempIdList
      this.displayClassRoom = true
    },
    handleChooseTeacher() {
      console.log('handleChooseClassRoom')
      var tempList = []
      var tempIdList = []
      this.displayTeacherForm = false
      this.teachers.forEach(function(val, index) {
        if (val.ischoose === true) {
          tempList.push(val)
          tempIdList.push(val.id)
        }
      })
      this.teacherList = tempList
      this.teacherIdList = tempIdList
      this.displayTeacher = true
    },
    handleConfirm() {
      this.examTemp.roomIds = this.classIdList
      this.examTemp.teacherIds = this.teacherIdList
      this.examTemp.examTimeDto = this.examTime
      console.log(JSON.stringify(this.examTemp))
      addExamDto(this.examTemp).then(res => {
        alert('添加成功')
        this.$router.push({
          name: 'exam', // 页面名字
          path: '/exam' // 页面路劲 和上面名字任意一个都可以
        })
      }).catch(() => {
        alert('添加失败，请检查是否重复提交!')
      })
      // var requestData = []
    }

  }
}
</script>
