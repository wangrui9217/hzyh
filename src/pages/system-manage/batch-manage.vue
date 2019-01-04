<template>
  <!--批量管理-->
  <section class="page batch-manage">
    <data-form :model="queryModel" @onSearch="refreshData" hiddenReset hiddenSearch>
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode" @change="refreshData()">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="batchManageclick" v-auth="5557">批量管理</el-button>
      </template>
    </data-form>
    <data-box @onPageChange="refreshData" :data="queryBatchManageDataSet" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="taskName" label="任务名称" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="taskGroup" label="任务所在组" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="taskDescription" label="任务描述" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="taskClassName" label="任务类名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="triggerName" label="触发器名称" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="triggerGroup" label="触发器所在组" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="nextExecutionTime" label="下次执行时间" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{Number(scope.row.nextExecutionTime) | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expression" label="表达式" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="triggerState" label="状态" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.triggerState==='PAUSED'">暂停</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="timeZone" label="时区" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="enablementClick(scope)" :disabled="scope.row.triggerState!=='PAUSED'" v-auth="5558">启用</el-button>
            <el-button type="text" @click="pauseClick(scope)" :disabled="scope.row.triggerState==='PAUSED'" v-auth="5559">暂停</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Auth, Layout, Dependencies } from '~/core/decorator';
import DataForm from '~/components/common/data-form.vue';
import DataBox from '~/components/common/data-box.vue';
import { BatchManageService } from '~/services/business-service/batch-manage.service';
import { State, Getter } from 'vuex-class';
import { PageService } from '~/utils/page.service';
import MoneyInput from '~/components/common/money-input.vue';

@Auth(856)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    MoneyInput
  }
})
export default class BatchManage extends Vue {
  @State companyList;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Dependencies(BatchManageService) private batchManageService: BatchManageService;
  @Dependencies(PageService) private pageService: PageService;

  // form 查询表单参数
  private queryModel: any = {
    companyCode: ""
  };
  private queryBatchManageDataSet: Array<any> = [];
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.queryModel.companyCode = this.userData.companyCode
    }
    return this.queryModel.companyCode
  }

  set companyCode(value) {
    this.queryModel.companyCode = value
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
    if (this.isSupperAdmin) {
      //不为空说明是管理员 否则是超级管理员
      this.refreshData();
    }
  }
  refreshData() {
    this.batchManageService
      .queryBatchManage(this.queryModel, this.pageService)
      .subscribe(
      data => {
        this.queryBatchManageDataSet = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
      );
  }
  /**
   * 批量管理
   */
  batchManageclick() {
    this.$confirm("您确定要批量管理？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info"
    })
      .then(() => {
        this.batchManageService
          .manualBatchManage({
            companyCode: this.queryModel.companyCode
              ? this.queryModel.companyCode
              : this.userData.companyCode
          })
          .subscribe(
          data => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.refreshData();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
          );
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消操作!"
        });
      });
  }
  /**
   * 停用
   */
  pauseClick(scope) {
    this.$confirm("您确定要暂停该触发器？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info"
    })
      .then(() => {
        this.batchManageService
          .pauseTriggerForJob({
            triggerName: scope.row.triggerName,
            triggerGroup: scope.row.triggerGroup
          })
          .subscribe(
          data => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.refreshData();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
          );
      })
      .catch(() => {
        this.$message({
          type: "success",
          message: "取消暂停"
        });
      });
  }
  /**
   * 启用
   */
  enablementClick(scope) {
    this.$confirm("您确定要启用该触发器？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info"
    })
      .then(() => {
        this.batchManageService
          .resumeTriggerForJob({
            triggerName: scope.row.triggerName,
            triggerGroup: scope.row.triggerGroup
          })
          .subscribe(
          data => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.refreshData();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
          );
      })
      .catch(() => {
        this.$message({
          type: "success",
          message: "取消启用"
        });
      });
  }
}
</script>

<style lang="less">

</style>
