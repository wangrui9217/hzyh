<template>
  <section class="page daily-process-report">
    <data-form :model="dailyProcessModel" @onSearch="refreshData" :rules="rules">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型 " prop="type" v-auth="5479">
          <el-select v-model="dailyProcessModel.type" @change="dailyProcessDataSet = null,dailyProcessModel.time = ''">
            <el-option label="实时" :value="0"></el-option>
            <el-option label="历史" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构" prop="deptIds" v-auth="5480">
          <el-cascader v-model="dailyProcessModel.deptIds" @change="changeUserName" :options="departmentData" @blur="getcupoName" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="当前催收员" prop="userName" v-auth="5481">
          <el-input v-model="dailyProcessModel.userName" v-if="dailyProcessModel.deptIds.length===0"></el-input>
          <el-select v-model="dailyProcessModel.userName" placeholder="请选择" clearable v-else>
            <el-option v-for="{userName,realName} in orgCuponameList" :key="userName" :label="realName" :value="userName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time" v-if="dailyProcessModel.type===1" v-auth="5482">
          <el-date-picker v-model="dailyProcessModel.time" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportReportClick" v-auth="5483">导出</el-button>
      </template>
    </data-form>
    <data-box :data="dailyProcessDataSet">
      <template slot="columns">
        <el-table-column prop="date" label="考察对象">
          <el-table-column prop="deptName" label="部门" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>

          <el-table-column prop="groupName" label="组别" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <el-col class="item" :style="getStyle(m.dailyProcessThiModels)" :min-width="$helper.getColumnWidth(3)">{{m.groupName}}</el-col>
                <el-col class="item-sum" v-if="dailyProcessModel.type===0">累计</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">
                    <span> {{val.realName}}</span>
                  </el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0"></el-col>
                </div>
              </div>
            </template>
          </el-table-column>

        </el-table-column>
        <el-table-column label="考察数据类型 (金额单位：元)">
          <el-table-column prop="nowDate" label="日期" :min-width="$helper.getColumnWidth(3)" class-name="hidden-children-item">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">{{val.nowDate | dateFormat}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0"></el-col>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="caseNum" label="案件数量" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">{{val.caseNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.caseSum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="caseAmt" label="逾期金额" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item-right">{{val.caseAmt|toThousands}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.amtSum|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="handleNum" label="当日处理案件数量" :min-width="$helper.getColumnWidth(6)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">{{val.handleNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.handleSum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="有效联络案件数量">

            <el-table-column prop="promiseNum" label="承诺还款" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                  <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===0">
                      <span>{{val.promiseNum}}</span>
                    </el-col>
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===1">{{val.promiseNum}}</el-col>
                    <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.promiseSum}}</el-col>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="consultNum" label="协商跟进" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                  <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===0">
                      <span>{{val.consultNum}}</span>
                    </el-col>
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===1">{{val.consultNum}}</el-col>
                    <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.consultSum}}</el-col>
                  </div>
                </div>
              </template>
            </el-table-column>

          </el-table-column>

          <el-table-column label="非有效联案件数量">

            <el-table-column prop="otherTellNum" label="他人转告" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                  <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===0">
                      <span>{{val.otherTellNum}}</span>
                    </el-col>
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===1">{{val.otherTellNum}}</el-col>
                    <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.otherTellSum}}</el-col>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="findNum" label="查找" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                  <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===0">
                      <span>{{val.findNum}}</span>
                    </el-col>
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===1">{{val.findNum}}</el-col>
                    <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.findSum}}</el-col>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="noAnswerNum" label="无人应答" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                  <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===0">
                      <span>{{val.noAnswerNum}}</span>
                    </el-col>
                    <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item" v-if="dailyProcessModel.type===1">{{val.noAnswerNum}}</el-col>
                    <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.noAnswerSum}}</el-col>
                  </div>
                </div>
              </template>
            </el-table-column>

          </el-table-column>

          <el-table-column prop="callNum" label="每日呼叫数量" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">{{val.callNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.callSum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="effectiveCallNum" label="每日有效呼叫数量" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">{{val.effectiveCallNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.effectiveCallSum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="每日通话时长" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">{{val.callDuration}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0">{{v.sum.callDurationSum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="communicateNum" label="沟通记录条数" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyProcessSecModels" :key="n">
                <div v-for="(v,i) in m.dailyProcessThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyProcessReports" :key="index" class="item">{{val.communicateNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyProcessModel.type===0"></el-col>
                </div>
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
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { UserService } from '~/services/business-service/user.service'
import { ReportService } from '~/services/report-service/report.service'
import { CommonService } from '~/utils/common.service'
const fileName = '每日过程报表'

@Auth(774)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class DailyProcessReport extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ReportService) private reportService: ReportService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Getter departmentData;
  private orgCuponameList: any = [];
  private dailyProcessModel: any = {
    companyCode: "",
    type: 0,
    deptId: "",
    userName: "",
    time: "",
    deptIds: []
  }
  private rules: any = {
    time: { required: true, message: '请选择日期范围', trigger: 'blur' }
  }
  private dailyProcessDataSet: any = null

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.dailyProcessModel.companyCode = this.userData.companyCode
    }
    return this.dailyProcessModel.companyCode
  }

  set companyCode(value) {
    this.dailyProcessModel.companyCode = value
  }

  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    // 最后一次选择的机构
    let lastDeptId = this.dailyProcessModel.deptIds[this.dailyProcessModel.deptIds.length - 1]
    if (lastDeptId && lastDeptId !== this.dailyProcessModel.deptId) {
      this.dailyProcessModel.cupoName = ''
      this.dailyProcessModel.deptId = lastDeptId
      this.userService.queryNoPage(lastDeptId)
        .subscribe(data => {
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
    if(this.dailyProcessModel.deptIds.length===0){
      this.dailyProcessModel.userName = ''
    }
  } 
  /**
   * 刷新数据
   */
  refreshData() {
    this.reportService
      .getDailyProcessReport(this.dailyProcessModel)
      .subscribe(data => {
        this.dailyProcessDataSet = data

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
        this.dailyProcessDataSet.forEach(x => {
          x.dailyProcessSecModels.forEach(k => {
            k.dailyProcessThiModels.forEach(l => {
              let arrays: any = []
              fun(l, arrays)
              l.sum = {
                caseSum: arrays.map(x => x.caseNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                amtSum: arrays.map(x => x.caseAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                handleSum: arrays.map(x => x.handleNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                promiseSum: arrays.map(x => x.promiseNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                otherTellSum: arrays.map(x => x.otherTellNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                findSum: arrays.map(x => x.findNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                noAnswerSum: arrays.map(x => x.noAnswerNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                callSum: arrays.map(x => x.callNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                effectiveCallSum: arrays.map(x => x.effectiveCallNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                communicateSum: arrays.map(x => x.communicateNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                consultSum: arrays.map(x => x.consultNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                callDurationSum: arrays.map(x => x.callDuration).reduce((a, b) => (a * 100 + b * 100) / 100, 0)
              }
            })
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
    this.reportService.exportDailyProcessReport(this.dailyProcessModel)
      .subscribe(data => CommonService.downloadFile(data, fileName),
      error => this.$message.error(error.msg))
  }
  getStyle(arr) {
    if (arr) {
      let num = 0
      arr.forEach(v => {
        num = num + v.dailyProcessReports.length
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
