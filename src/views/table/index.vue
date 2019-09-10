<template>
  <!-- {{scope.row}} =>获取整行的数据 -->
  <!-- {{scope.$index}} => 行的下标 -->
  <!-- “:” 是指令 “v-bind”的缩写，“@”是指令“v-on”的缩写； -->
  <div class="app-container">
    <div class="filter-container">
      <el-button
v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter"
>
        Search
      </el-button>
      <el-button
class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate"
>
        Add
      </el-button>
      <el-button
v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload"
>
        Export
      </el-button>
    </div>

    <el-table
v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
>

      <el-table-column
align="center"
                       label="ID"
                       width="80"
>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column
align="center"
                       label="学号"
                       width="130"
>
        <template slot-scope="scope">
          {{ scope.row.studentNo }}
        </template>
      </el-table-column>
      <el-table-column
label="姓名"
                       width="110"
                       align="center"
>
        <template slot-scope="scope">
          <span>{{ scope.row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column
label="性别"
                       width="80"
                       align="center"
>
        <template slot-scope="scope">
          {{ scope.row.studentSex }}
        </template>
      </el-table-column>
      <el-table-column
label="电话"
                       width="130"
                       align="center"
>
        <template slot-scope="scope">
          {{ scope.row.studentPhone }}
        </template>
      </el-table-column>
      <el-table-column
label="班级编号"
                       width="120"
                       align="center"
>
        <template slot-scope="scope">
          {{ scope.row.classId }}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.studentAddress }}
        </template>
      </el-table-column>
      <el-table-column
label="Actions"
                       align="center"
                       width="200"
                       class-name="small-padding fixed-width"
>
        <template slot-scope="{row}">
          <el-button
type="primary"
                     size="mini"
                     @click="handleUpdate(row)"
>
            编辑
          </el-button>
          <el-button
v-if="row.status!='deleted'"
                     size="mini"
                     type="danger"
                     @click="handleModifyStatus(row,'deleted')"
>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </br>
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
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getStudentList } from '@/api/student'

export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  data() {
    return {
      list: null,
      listLoading: true,
      pageNum: 1,
      pageSize: 1,
      total: 0,
      temp: {
        classId: '',
        id: '',
        studentAddress: '',
        studentName: '',
        studentNo: '',
        studentPhone: '',
        studentSex: ''
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var pageNum = this.pageNum
      var pageSize = this.pageSize
      var requestData = { pageNum, pageSize }
      console.log('requestData:' + requestData)
      this.listLoading = true
      getStudentList(requestData).then(response => {
        this.list = response.data
        console.log('list:' + this.list)
        this.pageNum = response.pageNum
        this.pageSize = response.pageSize
        this.total = response.total

        this.listLoading = false
      })
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
      console.log('pageSize: ' + this.pageSize) // 每页下拉显示数据
    },
    handleCurrentChange: function(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
      console.log('pageNum: ' + this.pageNum) // 点击第几页
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
