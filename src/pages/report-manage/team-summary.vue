<template>
  <section class="page team-summary">
    <data-form :model="teamSummaryModel" @onSearch="refreshData" :rules="rules">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型 " prop="type" v-auth="5492">
          <el-select v-model="teamSummaryModel.type" @change="teamSummaryDataSet = null,teamSummaryGroupDataSet = null,teamSummaryModel.time = ''">
            <el-option label="实时" :value="0"></el-option>
            <el-option label="历史" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time" v-if="teamSummaryModel.type===1" v-auth="5493">
          <el-date-picker v-model="teamSummaryModel.time" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportReportClick" v-auth="5494">导出</el-button>
      </template>
    </data-form>
    <data-box :data="teamSummaryDataSet">
      <!--数据列区域-->
      <template slot="columns">
        <el-table-column prop="date" label="考察对象">
          <el-table-column prop="deptName" label="部门" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>

          <el-table-column prop="groupName" label="组别" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <el-col class="item" :style="getStyle(m.performanceRankingReports)" :min-width="$helper.getColumnWidth(3)">
                  {{m.groupName}}{{'(' + (m.performanceRankingReports[0].manageName || '无') + ')'}}
                </el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <div v-for="(v,i) in m.performanceRankingReports" :key="i">
                  <el-col :class="v.deptCode ? 'item' : 'item-sum'">
                    <span> {{v.realName}}</span>
                  </el-col>
                </div>
              </div>
            </template>
          </el-table-column>

        </el-table-column>
        <el-table-column label="考察数据类型 (金额单位：元)">

          <el-table-column prop="caseNum" label="案件数量" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <div v-for="(v,i) in m.performanceRankingReports" :key="i">
                  <el-col :class="v.deptCode ? 'item' : 'item-sum'">{{v.caseNum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="dayBackMoney" label="当日回款金额" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <div v-for="(v,i) in m.performanceRankingReports" :key="i">
                  <el-col :class="v.deptCode ? 'item-right' : 'item-sum'">{{v.dayBackMoney|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="monthBackMoney" label="月累计回款金额" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <div v-for="(v,i) in m.performanceRankingReports" :key="i">
                  <el-col :class="v.deptCode ? 'item-right' : 'item-sum'">{{v.monthBackMoney|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="rank" label="排名" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <div v-for="(v,i) in m.performanceRankingReports" :key="i">
                  <el-col :class="v.deptCode ? 'item-right' : 'item-sum'">{{v.rank}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="target" label="月度回款金额目标" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <div v-for="(v,i) in m.performanceRankingReports" :key="i">
                  <el-col :class="v.deptCode ? 'item-right' : 'item-sum'">{{v.target|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="月度目标差距" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSummarySecModels" :key="n">
                <div v-for="(v,i) in m.performanceRankingReports" :key="i">
                  <el-col :class="v.deptCode ? 'item-right' : 'item-sum'">{{v.targetDisparity|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
    </data-box>
    <div style="height:15px"></div>
    <data-box :data="teamSummaryGroupDataSet">
      <!--数据列区域-->
      <template slot="columns">

        <el-table-column prop="groupName" label="组别" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item' : 'item-sum'">{{scope.row.groupName}}{{ scope.row.groupCode ? (scope.row.manageName || '(无)') : '' }}</el-col>
          </template>
        </el-table-column>
        <el-table-column prop="caseNum" label="案件数量" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item' : 'item-sum'">{{scope.row.caseNum}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="manageNum" label="管理人数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item' : 'item-sum'">{{scope.row.manageNum}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="dayBackMoney" label="当日回款金额" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item-right' : 'item-sum'">{{scope.row.dayBackMoney|toThousands}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="monthBackMoney" label="月累计回款金额" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item-right' : 'item-sum'">{{scope.row.monthBackMoney|toThousands}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="averageMoney" label="人均回款金额" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item-right' : 'item-sum'">{{scope.row.averageMoney|toThousands}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="rank" label="排名" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item' : 'item-sum'">{{scope.row.rank}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="target" label="月度回款金额目标" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item-right' : 'item-sum'">{{scope.row.target|toThousands}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="targetDisparity" label="月度目标差距" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col :class="scope.row.groupCode ? 'item-right' : 'item-sum'">{{scope.row.targetDisparity|toThousands}}</el-col>
          </template>
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
const fileName = '小组汇总报表'

@Auth(793)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class TeamSummary extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ReportService) private reportService: ReportService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  private teamSummaryModel: any = {
    companyCode: "",
    type: 0,
    time: ""
  };
  private rules: any = {
    time:{ required:true,message:'请选择日期范围',trigger:'blur'}
  }
  private teamSummaryDataSet: any = null;
  private teamSummaryGroupDataSet: any = null;

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.teamSummaryModel.companyCode = this.userData.companyCode
    }
    return this.teamSummaryModel.companyCode
  }

  set companyCode(value) {
    this.teamSummaryModel.companyCode = value
  }


  /**
   * 刷新数据
   */
  refreshData() {
    this.reportService.getSummaryReport(this.teamSummaryModel)
      .subscribe(data => this.teamSummaryDataSet = data,
      error => this.$message.error(error.msg)
      )
    this.reportService.getGroupLeaderReport(this.teamSummaryModel)
      .subscribe(data => this.teamSummaryGroupDataSet = data,
      error => this.$message.error(error.msg)
      )
  }

  isTotalRow(scope, index) {
    if (!scope.row.performanceRankingReports || !index) {
      return false;
    }
    return (scope.row.performanceRankingReports.length - 1 === index)
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
    this.reportService.exportSummaryReport(this.teamSummaryModel)
      .subscribe(data => CommonService.downloadFile(data, fileName),
      error => this.$message.error(error.msg))
  }
  getStyle(arr) {
    return {
      height: `${arr.length * 40}px`,
      lineHeight: `${arr.length * 40}px`
    }
  }
}
</script>

<style lang="less">

</style>
