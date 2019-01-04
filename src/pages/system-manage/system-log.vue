<template>
  <!--系统日志-->
  <section class="page system-log">
    <data-form :model="systemLogModel" @onSearch="refreshData" :page="pageService">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="公司名称" v-show="isSupperAdmin" prop="companyCode">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" prop="operator" v-auth="5562">
          <el-input v-model="systemLogModel.operator"></el-input>
        </el-form-item>
        <el-form-item label="操作时间" prop="operatorTime" v-auth="5563">
          <div class="block">
            <el-date-picker v-model="systemLogModel.operatorTime" class="daterange-large" type="daterange" :editable="false">
            </el-date-picker>
          </div>
        </el-form-item>
      </template>
    </data-form>
    <!--数据列区域-->
    <data-box :data="systemLogDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="remark" label="描述" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="operator" label="操作人" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="clientIp" label="客户端IP" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="operateTime" label="操作时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.operateTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="exeTime" label="请求执行时长(秒)" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.exeTime/1000}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="exeMethod" label="执行方法" :min-width="$helper.getColumnWidth(13)">
        </el-table-column>
      </template>
      <!--按钮区域-->
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { SystemLogService } from "~/services/business-service/system-log.service";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";

@Auth(858)
@Layout("workspace")
@Component({
  components: {
    DataBox,
    DataForm
  }
})
export default class SystemLog extends Vue {
  @State companyList;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Dependencies(SystemLogService) private systemLogService: SystemLogService;
  @Dependencies(PageService) private pageService: PageService;
  private systemLogModel: any = {
    operator: "",
    companyCode: "",
    operatorTime: []
  };
  private systemLogDataSet: any = [];
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.systemLogModel.companyCode = this.userData.companyCode;
    }
    return this.systemLogModel.companyCode;
  }
  set companyCode(value) {
    this.systemLogModel.companyCode = value;
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }

  mounted() {
    this.systemLogModel.companyCode = this.userData.companyCode;
    this.refreshData();
  }
  refreshData() {
    this.systemLogService
      .query(this.systemLogModel, this.pageService, { operateTime: "desc" })
      .subscribe(
        data => {
          this.systemLogDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
}
</script>

<style lang="less">
</style>

