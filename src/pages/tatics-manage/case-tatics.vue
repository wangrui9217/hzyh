<template>
  <section class="page case-tatics">
    <data-form :model="taticsModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="策略名称" prop="name" v-auth="5507">
          <el-input v-model="taticsModel.name"></el-input>
        </el-form-item>
        <el-form-item label="案件分配类型" prop="allocationType" v-auth="5508">
          <el-select v-model="taticsModel.allocationType" placeholder="请选择" clearable>
            <el-option v-for="{ value, label } in $dict.getDictData('0102')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="案件类型" prop="caseType" v-auth="5508">
          <el-select v-model="taticsModel.caseType" placeholder="请选择" clearable>
            <el-option v-for="{ value, label } in $dict.getDictData('0105')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="状态" prop="status" v-auth="5508">
          <el-select v-model="taticsModel.status" placeholder="请选择" clearable>
            <el-option v-for="{ value, label } in $dict.getDictData('0101')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="addNewTactics" v-auth="5509">新增策略</el-button>
      </template>
    </data-form>
    <data-box :data="taticsDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="策略名称" prop="name" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column label="案件分配类型" prop="allocationType" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.allocationType|dictConvert}}
          </template>
        </el-table-column>
        <el-table-column label="案件类型" prop="caseType" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.caseType|dictConvert}}
          </template>
        </el-table-column>
        <el-table-column label="优先级" prop="priority" :min-width="$helper.getColumnWidth(4)"></el-table-column>

        <el-table-column label="状态" prop="status" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.status|dictConvert}}
          </template>
        </el-table-column>


        <el-table-column label="创建时间" prop="createTime" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.createTime| dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="creator" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="modifyClick(scope)" v-auth="5510">修改</el-button>
            <el-button type="text" size="small" @click="deleteClick(scope)" >删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--编辑策略弹框-->
    <el-dialog :title="addOrModify.flag?'新增策略':'修改策略'" :center="true" :visible.sync="dialog.edit" width="60%" @open="$nextTick(()=>$refs['edit-tatics'].refresh(taticsObj, allotObj, addOrModify))">
      <edit-tatics :allName="allName" ref="edit-tatics" @close="dialog.edit = false" @refreshList="refreshData" :addOrModifyFlag="addOrModify.flag" ></edit-tatics>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { CaseStrategyService } from "~/services/dataimp-service/case-strategy.service";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import EditTatics from "~/components/tatics-manage/case-tactics/edit-tatics.vue";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";

@Auth(832)
@Layout("workspace")
@Component({
  components: {
    EditTatics,
    DataForm,
    DataBox
  }
})
export default class CaseTactics extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseStrategyService)
  private caseStrategyService: CaseStrategyService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;

  private taticsModel: any = {
    companyCode: "",
    name: "",
    allocationType: "",
    caseType: "",
    status: ""
  };
  private taticsDataSet = null;
  private taticsObj: any = {};
  private allotObj: any = {};
  private addOrModify: any = {};
  private dialog: any = {
    edit: false,
    module: false,
    list: false
  };
  private seriesList: any = [];
  private productList: any = [];
  private allName: any = [];
  /**
  * 考虑到非管理员不显示公司选择控件
  * get 操作的时候强制设置非管理员所在公司码
 */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.taticsModel.companyCode = this.userData.companyCode
    }
    return this.taticsModel.companyCode
  }

  set companyCode(value) {
    this.taticsModel.companyCode = value
  }
  created(){
    this.refreshData()
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
   * 修改按钮
   */
  modifyClick(scope) {
    this.taticsObj.name = scope.row.name;
    this.taticsObj.allocationType = scope.row.allocationType;
    this.taticsObj.caseType = scope.row.caseType;
    this.taticsObj.status = scope.row.status;
    this.taticsObj.priority = scope.row.priority;
    this.taticsObj.tacticsType = scope.row.strategyType;


    this.taticsObj.stripMark = scope.row.stripMark;
    this.taticsObj.assignType = scope.row.assignType;
    this.taticsObj.outsource = scope.row.outsource; // 指定的委外方
    this.taticsObj.seriesIds = scope.row.seriesIds || [];
    this.taticsObj.productIds = scope.row.productIds || [];
    this.taticsObj.shops = scope.row.shops || [];
    let strategyJson: any = [];
    let fun = obj => {
      if (obj.leaf) {
        strategyJson.push(obj);
      } else {
        obj.children.forEach(val => {
          fun(val);
        });
      }
    };
    JSON.parse(scope.row.strategyJson).forEach(v => {
      fun(v);
    });
    this.taticsObj.strategyJson = strategyJson;
    if (scope.row.departId) {
      this.allotObj.departId = scope.row.departId;
    }
    this.allotObj.users = scope.row.users;
    this.allotObj.assignType = scope.row.assignType;
    this.addOrModify.flag = false;
    this.addOrModify.id = scope.row.id;
    this.dialog.edit = true;
  }
  /**
   * 删除按钮
   */
  deleteClick(scope) {
    this.$confirm("您确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.caseStrategyService.deleteCaseStrategy(scope.row.id).subscribe(
          data => {
            this.$message.info("删除成功！");
            this.pageService.reset();
            this.refreshData();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      })
      .catch(() => {
        this.$message("已取消删除");
      });
  }
  /**
   * 新增策略
   */
  addNewTactics() {
    this.taticsObj = {
      allocationType: "",
      name: "",
      priority: "",
      caseType: "",
      status: "",
      stripMark: 0,
      tacticsType: "",
      seriesIds: [],
      productIds: [],
      shops: [],
      strategyJson: [
        {
          leaf: true,
          variable: "",
          symbol: "",
          value: "",
          cityArr: [],
          relation: "",
          bracket: ""
        }
      ]
    };
    this.allotObj = {
      departId: "",
      users: [],
      assignType: 1
    };
    this.addOrModify = {
      flag: true,
      id: ""
    };
    this.dialog.edit = true;
  }
  refreshData() {
    this.caseStrategyService
      .getCaseStrategy(this.taticsModel, this.pageService)
      .subscribe(
      data => {
        this.taticsDataSet = data;
        let array:any = [];
        this.allName = data.map(v=>v.name);
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
      );
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
}
</script>

<style lang="less">

</style>
