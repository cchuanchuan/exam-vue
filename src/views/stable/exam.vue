<template>
  <!-- {{scope.row}} =>获取整行的数据 -->
  <!-- {{scope.$index}} => 行的下标 -->
  <!-- “:” 是指令 “v-bind”的缩写，“@”是指令“v-on”的缩写； -->
  <div class="app-container">
    <div class="filter-container">
      <!-- clearable 可以清除 -->
      <el-select
        v-model="listQuery.gradeId"
        class="filter-item"
        placeholder="选择学期"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in grades"
          :key="item.id"
          :label="getGradeString(item.grade,item.semester)"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.courseName"
        placeholder="课程名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="classId"
        class="filter-item"
        placeholder="班级"
        clearable
        @change="handleClass"
      >
        <el-option v-for="item in clazses" :key="item.id" :label="item.className" :value="item.id" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="exportExcel()"
      >导出当前考试信息</el-button>
    </div>

    <!-- 主要内容 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="考试ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="考试学科">
        <template slot-scope="scope">{{ scope.row.courseName }}</template>
      </el-table-column>
      <el-table-column label="考试时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学科绩点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.courseGpa }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br >
    <!-- 分页部分 -->
    <el-pagination
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[1, 5, 10, 20, 40]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { queryExamPageByCondition, deleteExam } from '@/api/exam'
import { queryGradeAll } from '@/api/grade'
import { getClazstList } from '@/api/clazs'
import { queryCourseIdByClassId } from '@/api/course'

// reduce 用法
// total 必需。初始值, 或者计算结束后的返回值。
// currentValue 必需。当前元素
// currentIndex 可选。当前元素的索引
// arr 可选。当前元素所属的数组对象。
export default {
  data() {
    return {
      list: null, // 数据
      listLoading: true, // 显示加载
      pageNum: 1, // 页码
      pageSize: 10, // 每页大小
      total: 0, // 数据总量
      listQuery: { // 查询筛选条件
        gradeId: '',
        courseName: '',
        courseIds: ''
      },
      classId: '', // 班级信息
      grades: '',
      clazses: ''
    }
  },
  created() { // create钩子
    this.getList()
    this.getGradeList()
    this.getClazstList()
  },
  methods: { // 方法
    getList() { // 获取表格数据信息
      var pageNum = this.pageNum
      var pageSize = this.pageSize
      var requestData = { pageNum, pageSize }
      this.listLoading = true
      queryExamPageByCondition(requestData, this.listQuery).then(response => { // 查询信息
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getGradeList() {
      queryGradeAll().then(res => {
        this.grades = res.data
        console.log(JSON.stringify(this.grades))
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
    getClazstList() {
      getClazstList().then(res => {
        this.clazses = res.data
      })
    },

    // 分页管理，页面大小改变
    handleSizeChange: function(pageSize) {
      this.pageNum = 1
      this.pageSize = pageSize
      this.getList()
      console.log('pageSize: ' + this.pageSize) // 每页下拉显示数据
    },
    // 分页管理 当前页码改变
    handleCurrentChange: function(pageNum) {
      this.pageNum = pageNum
      this.getList()
      console.log('pageNum: ' + this.pageNum) // 点击第几页
    },
    // 点击删除按钮
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteExam(this.temp).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row) // 更新页面数据
        this.list.splice(index, 1)
      })
    },
    handleDetail(row) {
      this.$router.push({
        name: 'sexamDetail', // 页面名字
        path: '/sexamDetail', // 页面路劲 和上面名字任意一个都可以
        query: { flight: JSON.stringify(row) } // 参数传值
      })
    },
    // 查询操作
    handleFilter() {
      this.pageNum = 1 // 显示第一页
      this.getList()
    },
    handleClass() {
      this.listQuery.courseIds = ''
      var classId = this.classId
      if (classId != null && classId !== '') {
        var requestData = { classId }
        this.listLoading = true
        queryCourseIdByClassId(requestData).then(res => { // 查询信息
          var tempids = []
          tempids.push(0)
          if (res.data != null && res.data.length !== 0) {
            tempids = res.data
          }
          this.listQuery.courseIds = tempids
        }).then(res => {
          this.handleFilter()
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    // 导出的方法
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../excel/Export2Excel')
        const tHeader = ['考试ID', '考试学科', '考试时间', '学科绩点']
        // 上面设置Excel的表格第一行的标题
        const filterVal = ['id', 'courseName', 'date', 'courseGpa']
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.list // 把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '列表excel')
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
