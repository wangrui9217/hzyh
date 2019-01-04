<template>
  <section class="page excel-template">
    <data-form :model="excelModel" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName" v-auth="5501">
          <el-input v-model="excelModel.templateName"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalName" v-auth="5502">
          <el-select v-model="excelModel.principalName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="dialog.createTemplate = true" v-auth="5503">新增模板</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :data="excelDataSet" @onPageChange="refreshData">
      <!--数据列区域-->
      <template slot="columns">
        <el-table-column prop="templateName" label="模板名称" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="operatorTime" label="创建时间" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="创建人" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="caseHandNum" label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button @click="updateClick(scope)" type="text" size="small" v-auth="5504">修改</el-button>
            <el-button @click="deleteClick(scope)" type="text" size="small" v-auth="5505">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--新增模板-->
    <el-dialog title="新增模板" width="58%" :center="true" :visible.sync="dialog.createTemplate"   :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <new-excel-template @success="refreshData" @errMsg="errMsgShow" @dialogOpen="dialogOpen" @close="dialog.createTemplate=false" ref="create"></new-excel-template>
    </el-dialog>
    <!--修改-->
    <el-dialog @open="updateTemplateData" title="修改模板" :center="true" :visible.sync="dialog.updateExcel" width="50%" :close-on-click-modal="false" :show-close="true" :close-on-press-escape="false">
      <new-excel-template @success="refreshData" @errMsg="errMsgShow" @dialogOpen="dialogOpen" @close="dialog.updateExcel=false" ref="change"></new-excel-template>
    </el-dialog>
    <el-dialog title="请选择映射字段" :center="true" :visible.sync="dialog.relateNameOpen" width="50%" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <relate-name-dialog ref="relateName" @close="dialog.relateNameOpen = false" :relateData="relateNameData" :rowName="rowName" :disableName="disableName"></relate-name-dialog>
    </el-dialog>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { CommonService } from "~/utils/common.service";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { Prop } from "vue-property-decorator";
import { State, Getter } from "vuex-class";
import clone from "clone";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NewExcelTemplate from "~/components/templete-manage/excel-template/new-excel-template.vue";
import RelateNameDialog from "~/components/templete-manage/excel-template/relate-name-dialog.vue";
import { PageService } from "~/utils/page.service";
import { AccImportExcelDataService } from "~/services/dataimp-service/acc-import-excel-data.service";

@Auth(821)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NewExcelTemplate,
    RelateNameDialog
  }
})
export default class ExcelTemplate extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccImportExcelDataService)
  private accImportExcelDataService: AccImportExcelDataService;
  @Getter isSupperAdmin: boolean;
  private excelModel: any = {};
  private excelDataSet: Array<any> = [];
  private dialog: any = {};
  private relateNameData: any = {};
  private rowName: any = {};
  private modifyData: any = {};
  private listData: any = {};
  private disableName: Array<any> = [];
  private errMsgData: Array<any> = [];
  @State principalList: any;
  @State companyList: any;
  @State userData: any;
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.excelModel.companyCode = this.userData.companyCode;
    }
    return this.excelModel.companyCode;
  }

  set companyCode(value) {
    this.excelModel.companyCode = value;
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }

  created() {
    this.dialog = {
      createTemplate: false,
      relateNameOpen: false,
      errMsgOpen: false,
      updateExcel: false
    };
    this.excelModel = {
      principalName: "",
      companyCode: "",
      principalId: ""
    };
  }
  mounted() {
    this.refreshData();
    this.getExcelData();
  }
  getExcelData() {
    this.accImportExcelDataService.getExcelList().subscribe(
      data => {
        this.listData = data;
      },
      ({ msg }) => {
        this.$message({
          type: "error",
          message: msg
        });
      }
    );
  }
  refreshData() {
    this.accImportExcelDataService
      .getExcelTemplateList(this.pageService, this.excelModel)
      .subscribe(
        data => {
          this.excelDataSet = data;
        },
        err => {
          this.$message.error(err.msg);
        }
      );
  }
  dialogOpen(d, i, v) {
    this.relateNameData = d; // excel映射字段
    this.rowName = i; // 行数据
    this.dialog.relateNameOpen = true;
    this.disableName = v;
    this.$nextTick(() => {
      let relateName: any = this.$refs["relateName"];
      relateName.refreshData();
    });
  }
  updateTemplateData() {
    this.$nextTick(() => {
      let change: any = this.$refs["change"];
      change.refreshData(this.modifyData, this.listData);
    });
  }
  /**
   * 删除模板
   */
  deleteClick(scope) {
    this.$confirm("您确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      // 发送删除数据请求
      this.accImportExcelDataService.deleteExcelData(scope.row.id).subscribe(
        data => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          // 更新数据信息
          this.refreshData();
        },
        ({ reason }) => {
          this.$message({
            type: "info",
            message: reason
          });
        }
      );
    });
  }
  /**
   * 修改模版
   */
  updateClick(scope) {
    this.dialog.updateExcel = true;
    this.modifyData = clone(scope.row);
  }
  /**
   * 错误信息弹出
   */
  errMsgShow(data) {
    this.dialog.errMsgOpen = true;
    this.errMsgData = data;
  }
}
</script>
