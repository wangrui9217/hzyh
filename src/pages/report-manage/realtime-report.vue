<template>
  <section class="page realtime-report">
    <data-form :model="realtimeModel" @onSearch="refreshData" :rules="rules">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型 " prop="type" v-auth="5471">
          <el-select v-model="realtimeModel.type" @change="realtimeDataSet = null,realtimeModel.time = ''">
            <el-option label="实时" :value="0"></el-option>
            <el-option label="历史" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构" prop="deptIds" v-auth="5472">
          <el-cascader v-model="realtimeModel.deptIds" :options="departmentData" @change="changeUserName" @blur="getcupoName" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="当前催收员" prop="userName" v-auth="5473">
          <el-input v-model="realtimeModel.userName" v-if="realtimeModel.deptIds.length===0"></el-input>
          <el-select v-model="realtimeModel.userName" placeholder="请选择" clearable v-else>
            <el-option v-for="{userName,realName} in orgCuponameList" :key="userName" :label="realName" :value="userName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time" v-if="realtimeModel.type===1" v-auth="5474">
          <el-date-picker v-model="realtimeModel.time" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportReportClick" v-auth="5475">导出</el-button>
      </template>
    </data-form>
    <data-box :data="realtimeDataSet">
      <template slot="columns">
        <el-table-column prop="date" label="考察对象">

          <el-table-column prop="deptName" label="部门" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>

          <el-table-column label="组别" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.backMoneySecModels" :key="n">
                <el-col class="item" :style="getStyle(m.backMoneyThiModels)">{{m.groupName}}</el-col>
                <el-col class="item-sum" v-if="realtimeModel.type===0">累计</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.backMoneySecModels" :key="n">
                <div v-for="(v,i) in m.backMoneyThiModels" :key="i">
                  <el-col v-for="(val,index) in v.backMoneyReports" :key="index" class="item">
                    <span>{{val.realName}}</span>
                  </el-col>
                </div>
                <el-col class="item-sum" v-if="realtimeModel.type===0"></el-col>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="考察数据类型 (金额单位：元)">

          <el-table-column prop="backDate" label="日期" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.backMoneySecModels" :key="n">
                <div v-for="(v,i) in m.backMoneyThiModels" :key="i">
                  <el-col v-for="(val,index) in v.backMoneyReports" :key="index" class="item">{{val.backDate|dateFormat}}</el-col>
                </div>
                <el-col class="item-sum" v-if="realtimeModel.type===0"></el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="backMoney" label="回款金额" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.backMoneySecModels" :key="n">
                <div v-for="(v,i) in m.backMoneyThiModels" :key="i">
                  <el-col v-for="(val,index) in v.backMoneyReports" :key="index" class="item-right">{{val.backMoney|toThousands}}</el-col>
                </div>
                <el-col class="item-sum" v-if="realtimeModel.type===0">{{m.sum.backMoneySum|toThousands}}</el-col>
              </div>
            </template>
          </el-table-column>

        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import Component from "vue-class-component";
import { State, Getter } from "vuex-class"
import { Auth,Layout, Dependencies } from "~/core/decorator";
import { UserService } from '~/services/business-service/user.service'
import { ReportService } from '~/services/report-service/report.service'
import { CommonService } from '~/utils/common.service'
const fileName = '催收员回款报表'

@Auth(762)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class RealtimeReport extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ReportService) private reportService: ReportService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Getter departmentData;
  private orgCuponameList: any = [];
  private realtimeModel: any = {
    companyCode: "",
    type: 0,
    deptId: "",
    id: "",
    userName: "",
    time: "",
    deptIds: []
  }
  private rules: any = {
    time: { required: true, message: '请选择日期范围', trigger: 'blur' }
  }
  private realtimeDataSet: any = null

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.realtimeModel.companyCode = this.userData.companyCode
    }
    return this.realtimeModel.companyCode
  }

  set companyCode(value) {
    this.realtimeModel.companyCode = value
  }


  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    // 最后一次选择的机构
    let lastDeptId = this.realtimeModel.deptIds[this.realtimeModel.deptIds.length - 1]
    if (lastDeptId && lastDeptId !== this.realtimeModel.deptId) {
      this.realtimeModel.cupoName = ''
      this.realtimeModel.userName = ''
      this.realtimeModel.deptId = lastDeptId
      this.userService.queryNoPage(lastDeptId)
        .subscribe(data => {
          this.orgCuponameList = {},
          this.orgCuponameList = data.map(x => {
            return {
              id: x.id,
              userName: x.userName,
              realName: x.realName
            }
          })
        }, error => this.$message.error(error.msg))
    }
  }
  changeUserName() {
    if(this.realtimeModel.deptIds.length===0){
      this.realtimeModel.userName = ''
    }
  }
  /**
   * 刷新数据
   */
  refreshData() {
    this.reportService
      .getBackMoneyReport(this.realtimeModel)
      .subscribe(data => {
        this.realtimeDataSet = data
        let fun = (item, arrays) => {
          if (item.realName) {
            arrays.push(item)
          } else {
            let list: any = Object.values(item).find(x => x instanceof Array)
            if (list) {
              list.forEach(listItem => {
                fun(listItem, arrays)
              })
            }
          }
        }
        this.realtimeDataSet.forEach(x => {
          x.backMoneySecModels.forEach(v => {
            let arrays: any = []
            fun(v, arrays)
            v.sum = {
              backMoneySum: arrays.map(x => x.backMoney).reduce((a, b) => (a * 100 + b * 100) / 100, 0)
            }
          })
        })
      },
      error => this.$message.error(error.msg))
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }

  /**
   * 报表文件下载
   */
  exportReportClick() {
    this.reportService.exportBackMoneyReport(this.realtimeModel)
      .subscribe(data => CommonService.downloadFile(data, fileName),
      error => this.$message.error(error.msg))
  }
  getStyle(arr) {
    if (arr) {
      let num = 0
      arr.forEach(v => {
        num = num + v.backMoneyReports.length
      })
      return {
        height: `${num * 40}px`,
        lineHeight: `${num * 40}px`
      }
    }
  }
}

</script>

<style lang="less">

</style>
