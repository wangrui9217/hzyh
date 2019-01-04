<template>
  <section class="page system-backup">
    <data-form :model="backupModel" @onSearch="refreshData" hiddenReset hiddenSearch>
      <template slot="default-input">
        <el-form-item label="公司名称" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="备份时间" prop="operateTime" v-role="0x090702">
          <el-date-picker v-model="params.operateTime" type="date" placeholder="选择日期" :editable="false">
          </el-date-picker>
        </el-form-item>-->
      </template>
      <template slot="default-button">
        <el-button @click="createClick" style="margin-right:10px" v-auth="5571">新增备份</el-button>
      </template>
    </data-form>
    <data-box @onPageChange="refreshData" :data="backupDataSet" :page="pageService">
      <template slot="columns">
        <el-table-column prop="operator" label="操作人" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="operateTime" label="备份时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="备份方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.type===1">手动</span>
            <span v-if="scope.row.type===0">自动</span>
          </template>
        </el-table-column>
        <el-table-column prop="exeMethod" label="操作" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button type="text" @click="restoreData(scope)" v-auth="5572">恢复数据</el-button>
            <el-button type="text" @click="deleteBackupData(scope)" v-auth="5573">删除备份</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { SystemBackUpService } from "../../services/business-service/system-backup.service";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";

@Auth(860)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class SystemBackup extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SystemBackUpService)
  private systemBackUpService: SystemBackUpService;
  @State companyList;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  private backupModel: any = {
    companyCode: ""
  };
  private backupDataSet = null;
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.backupModel.companyCode = this.userData.companyCode
    }
    return this.backupModel.companyCode
  }

  set companyCode(value) {
    this.backupModel.companyCode = value
  }
  /**
    * 页面激活
    */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.systemBackUpService
      .querySystemBackup(this.backupModel, this.pageService)
      .subscribe(
      data => {
        this.backupDataSet = data;
      },
      msg => {
        this.$message.error(msg);
      }
      );
  }
  createClick() {
    this.systemBackUpService.createSystemBackup(this.backupModel).subscribe(
      data => {
        this.$message({
          type: "info",
          message: "新增备份成功"
        });
        this.refreshData();
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  restoreData(scope) {
    this.systemBackUpService
      .recoverSystemBackup({
        id: scope.row.id,
        companyCode: this.userData.companyCode || this.backupModel.companyCode,
        type: scope.row.type,
        mongdbName: scope.row.mongdbName,
        mysqlName: scope.row.mysqlName,
        operateTime: scope.row.operateTime,
        operator: scope.row.operator
      })
      .subscribe(
      data => {
        this.$message({
          type: "info",
          message: "恢复备份成功"
        });
        this.refreshData();
      },
      msg => {
        this.$message.error(msg);
      }
      );
  }
  deleteBackupData(scope) {
    this.systemBackUpService
      .deleteSystemBackup({
        ids: [scope.row.id]
      })
      .subscribe(
      data => {
        this.$message({
          type: "info",
          message: "删除备份成功"
        });
        this.refreshData();
      },
      msg => {
        this.$message.error(msg);
      }
      );
  }
}
</script>

<style scoped>

</style>
