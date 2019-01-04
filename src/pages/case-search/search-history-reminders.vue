<template>
  <section class="page search-history-reminder">
    <data-form :model="searchModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="客户姓名" prop="clientName" >
          <el-input v-model="searchModel.clientName"></el-input>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectionUser" >
          <el-input v-model="searchModel.collectionUser" ></el-input>
        </el-form-item>
      </template>
      <template slot="default-button">
      </template>
    </data-form>
    <data-box :data="searchDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="applicationNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="clientName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="divisionMonth" label="分案月份" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="collectionRemark" label="催记" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="collectionUser" label="当前催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter, Mutation, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { OfflineHistoryRemarkService } from "~/services/business-service/offline-history-remark.service";
import { CommonService } from "~/utils/common.service";

const accManageModule = namespace("acc-manage");
@Auth(375)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class SearchCase extends Vue {
  @Dependencies(OfflineHistoryRemarkService)
  private offlineHistoryRemarkService: OfflineHistoryRemarkService;
  @Dependencies(PageService) private pageService: PageService;

  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @State storeList: any;
  @Getter isSupperAdmin: boolean;
  @accManageModule.Mutation updateCaseInfo;

  private searchModel: any = {
    clientName: "",
    collectionUser: ""
  };
  private remarkLoading: any = false;
  private searchDataSet: Array<any> = [];

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.searchModel.companyCode = this.userData.companyCode;
    }
    return this.searchModel.companyCode;
  }

  set companyCode(value) {
    this.searchModel.companyCode = value;
  }

  // 过滤公司数据
  getPrincipalList() {
    return this.principalList.filter(
      x => x.companyCode === this.searchModel.companyCode
    );
  }

  refreshData() {
    // // 判断查询实体是否全部为空
    // let key: Array<string> = Object.keys(this.searchModel).filter(
    //   x => this.searchModel[x] !== "" && x !== "companyCode"
    // );
    // if (key && key.length > 0) {
    //   // 根据实体的内容进行查找
    //   this.offlineHistoryRemarkService
    //     .queryOfflineHistoryRemark(this.searchModel, this.pageService)
    //     .subscribe(
    //       data => (this.searchDataSet = data),
    //       err => this.$message.error(err.msg)
    //     );
    // } else {
    //   this.$message("请至少填写一项查找条件");
    // }
    this.offlineHistoryRemarkService
      .queryOfflineHistoryRemark(this.searchModel, this.pageService)
      .subscribe(
        data => (this.searchDataSet = data),
        err => this.$message.error(err.msg)
      );
  }
  created(){
    this.refreshData();
  }
}
</script>

<style lang="less">
</style>
