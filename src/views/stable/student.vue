<template>
  <!-- {{scope.row}} =>获取整行的数据 -->
  <!-- {{scope.$index}} => 行的下标 -->
  <!-- “:” 是指令 “v-bind”的缩写，“@”是指令“v-on”的缩写； -->
  <div class="app-container">
    <div class="filter-container">
      <!-- listQuery: {
        classId: '',
        studentNo: '',
        studentSex: '',
      },-->
      <!-- clearable 可以清除 -->
      <el-input
        v-model="listQuery.studentNo"
        placeholder="学号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.studentSex"
        placeholder="性别"
        clearable
        style="width: 90px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option label="男" value="男" />
        <el-option label="女" value="女" />
      </el-select>
      <el-select
        v-model="listQuery.classId"
        class="filter-item"
        clearable
        placeholder="班级"
        @change="handleFilter"
      >
        <el-option
          v-for="item in clazsInfo"
          :key="item.id"
          :label="item.className"
          :value="item.id"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

      <!-- <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>-->
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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="学号" width="130">
        <template slot-scope="scope">{{ scope.row.studentNo }}</template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.studentSex }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="130" align="center">
        <template slot-scope="scope">{{ scope.row.studentPhone }}</template>
      </el-table-column>
      <el-table-column label="班级" width="120" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row.classId | clazsFilter }} -->
          {{ getClazsName(scope.row.classId) }}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">{{ scope.row.studentAddress }}</template>
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

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="学号" prop="studentNo">
          <el-input v-model="temp.studentNo" />
        </el-form-item>
        <el-form-item label="姓名" prop="studentName">
          <el-input v-model="temp.studentName" />
        </el-form-item>
        <el-form-item label="密码" prop="studentName">
          <el-input v-model="temp.studentPassword" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="性别" prop="studentSex">
          <template>
            <el-radio v-model="temp.studentSex" label="男">男</el-radio>
            <el-radio v-model="temp.studentSex" label="女">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="电话" prop="studentPhone">
          <el-input v-model="temp.studentPhone" />
        </el-form-item>
        <el-form-item label="班级" prop="id">
          <el-select v-model="temp.classId" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in clazsInfo"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="studentAddress">
          <el-input v-model="temp.studentAddress" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateStudent, addStudent, deleteStudent, queryStudentPageByCondition } from '@/api/student'
import { getAllClazs } from '@/api/clazs'

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
        classId: '',
        studentSex: '',
        studentNo: ''
      },
      temp: { // 数据模板（修改增加时使用）
        classId: '',
        id: '',
        studentAddress: '',
        studentName: '',
        studentNo: '',
        studentPhone: '',
        studentSex: '',
        studentPassword: ''
      },
      dialogFormVisible: false, // 是否显示对话框
      dialogStatus: '', // 对话框状态
      rules: { // 对话框输入数据规则
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        classId: [{ validate: 'Integer', required: true, message: 'classId is required', trigger: 'change' }],
        studentPassword: [{ required: true, message: 'studentPassword is required', trigger: 'change' }],
        studentName: [{ required: true, message: 'studentName is required', trigger: 'change' }],
        studentNo: [{ required: true, message: 'studentNo is required', trigger: 'change' }]
      },
      textMap: { // 对话框状态显示
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false, // 显示下载（暂未用到）
      clazsInfo: {}, // 班级信息
      classNameValue: {} // 班级id及name
    }
  },
  created() { // create钩子
    this.getList()
    this.getClazs()
  },
  methods: { // 方法
    getClazs() { // 获取班级信息
      getAllClazs().then(response => { // 查询班级信息
        this.clazsInfo = response.data
        console.log('clazsInfo:' + this.clazsInfo)
      }).then(() => {
        this.classNameValue = this.clazsInfo.reduce((acc, cur) => {
          acc[cur.id] = cur.className
          return acc
        }, {})
      })
    },
    getClazsName(classId) { // 获取班级名称
      // return classId
      return this.classNameValue[classId] == null ? classId : this.classNameValue[classId]
    },
    getList() { // 获取表格数据信息
      var pageNum = this.pageNum
      var pageSize = this.pageSize
      var requestData = { pageNum, pageSize }
      console.log('requestData:' + requestData)
      this.listLoading = true
      queryStudentPageByCondition(requestData, this.listQuery).then(response => { // 查询学生信息
        this.list = response.data
        console.log('list:' + this.list)
        this.pageNum = response.pageNum
        this.pageSize = response.pageSize
        this.total = response.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 分页管理，页面大小改变
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
      this.pageNum = 1
      this.getList()
      console.log('pageSize: ' + this.pageSize) // 每页下拉显示数据
    },
    // 分页管理 当前页码改变
    handleCurrentChange: function(pageNum) {
      this.pageNum = pageNum
      this.getList()
      console.log('pageNum: ' + this.pageNum) // 点击第几页
    },
    // 点击编辑按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 点击删除按钮
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteStudent(this.temp).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
      })
      const index = this.list.indexOf(row) // 更新页面数据
      this.list.splice(index, 1)
    },
    // 点击创建按钮
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 查询操作
    handleFilter() {
      this.pageNum = 1 // 显示第一页
      this.getList()
    },
    // 重新设置数据（add造作）
    resetTemp() {
      this.temp = {
        classId: '',
        id: '',
        studentAddress: '',
        studentName: '',
        studentNo: '',
        studentPhone: '',
        studentSex: '',
        studentPassword: ''
      }
    },
    // 插入数据请求
    createData() {
      console.log('createData')
      var student = this.temp
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addStudent(student).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 更新数据请求
    updateData() {
      this.$refs['dataForm'].validate((valid) => { // 验证表单
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateStudent(tempData).then(() => {
            for (const v of this.list) { // 更新页面数据
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
