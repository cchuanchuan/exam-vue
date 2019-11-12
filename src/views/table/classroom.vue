<template>
  <!-- {{scope.row}} =>获取整行的数据 -->
  <!-- {{scope.$index}} => 行的下标 -->
  <!-- “:” 是指令 “v-bind”的缩写，“@”是指令“v-on”的缩写； -->
  <div class="app-container">
    <div class="filter-container">
      <!-- clearable 可以清除 -->
      <el-input
        v-model="listQuery.id"
        placeholder="ID"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.roomPlace"
        placeholder="教室地点"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.roomNo"
        placeholder="教室编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Add</el-button>
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
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="教室编号">
        <template slot-scope="scope">{{ scope.row.roomNo }}</template>
      </el-table-column>
      <el-table-column label="教室地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomPlace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教室容量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomCapacity }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >删除</el-button>
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
        <el-form-item label="ID" prop="classRoomNo">
          <el-input v-model="temp.id" disabled />
        </el-form-item>
        <el-form-item label="教室编号" prop="roomNo">
          <el-input v-model="temp.roomNo" />
        </el-form-item>
        <el-form-item label="教室地点" prop="roomPlace">
          <el-input v-model="temp.roomPlace" />
        </el-form-item>
        <el-form-item label="教室容量" prop="roomCapacity">
          <el-input v-model="temp.roomCapacity" />
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
import { updateClassRoom, addClassRoom, deleteClassRoom, queryClassRoomPageByCondition } from '@/api/classroom'
import { queryDepartmentAll } from '@/api/department'

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
        id: '',
        roomNo: '',
        roomPlace: '',
        roomCapacity: ''
      },
      temp: { // 数据模板（修改增加时使用）
        id: '',
        roomNo: '',
        roomPlace: '',
        roomCapacity: ''
      },
      profs: ['高级教师', '中级教师', '初级教师'],
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
      depInfo: {}, // 班级信息
      depName: {} // 班级id及name
    }
  },
  created() { // create钩子
    this.getList()
    this.getDeps()
  },
  methods: { // 方法
    getDeps() { // 获取班级信息
      queryDepartmentAll().then(response => { // 查询班级信息
        this.depInfo = response.data
        console.log('departmentInfo:' + this.depInfo)
      }).then(() => {
        this.depName = this.depInfo.reduce((acc, cur) => {
          acc[cur.id] = cur.depName
          return acc
        }, {})
        console.log(JSON.stringify(this.depName))
      })
    },
    getDepName(depId) { // 获取名称
      return this.depName[depId] == null ? depId : this.depName[depId]
    },
    getList() { // 获取表格数据信息
      var pageNum = this.pageNum
      var pageSize = this.pageSize
      var requestData = { pageNum, pageSize }
      console.log('requestData:' + requestData)
      this.listLoading = true
      queryClassRoomPageByCondition(requestData, this.listQuery).then(response => { // 查询信息
        this.list = response.data
        console.log('list:' + JSON.stringify(this.list))
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
      deleteClassRoom(this.temp).then(() => {
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
    // 重新设置数据（add操作）
    resetTemp() {
      this.temp = {
        id: '',
        classRoomNo: '',
        classRoomName: '',
        classRoomProf: '',
        classRoomPassword: '',
        depId: ''
      }
    },
    // 插入数据请求
    createData() {
      console.log('createData')
      // var ClassRoom = this.temp
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('ClassRoom:' + this.temp)
          addClassRoom(this.temp).then(() => {
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
          updateClassRoom(tempData).then(() => {
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
