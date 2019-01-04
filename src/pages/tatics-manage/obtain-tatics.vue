<template>
  <section class="page obtain-tatics">
    <data-form :model="obtainModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="策略名称" prop="name" v-auth="8000">
          <el-input v-model="obtainModel.name"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productType">
          <el-select v-model="obtainModel.productType" placeholder="请选择" clearable>
            <el-option v-for="{ id, seriesName } in seriesNameList" :key="id" :label="seriesName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件类型" prop="caseType" v-auth="8001">
          <el-select v-model="obtainModel.caseType" placeholder="请选择" clearable>
            <el-option v-for="{ value, label } in $dict.getDictData('0103')" :key="value" :label="label" :value="value">

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行频率" prop="divisionFrequency">
          <el-select v-model="obtainModel.divisionFrequency" placeholder="请选择" clearable>
            <el-option v-for="{ value, label } in $dict.getDictData('0106')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否分配到催员" prop="allotType" >
          <el-select v-model="obtainModel.allotType" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in [{value:'620',label:'是'},{value:'621',label:'否'}]" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>

      </template>
      <template slot="default-button">
        <el-button @click="addNewTactics" v-auth="8002">新增策略</el-button>
      </template>
    </data-form>
    <data-box :data="taticsDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="策略名称" prop="name" :min-width="$helper.getColumnWidth(6)" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品类型" prop="productType" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{getProductName(scope.row.productType)}}
          </template>
        </el-table-column>
        <el-table-column label="案件类型" prop="caseType" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.caseType|dictConvert}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.status|dictConvert}}
          </template>
        </el-table-column>
        <el-table-column label="执行频率" prop="divisionFrequency" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.divisionFrequency|dictConvert}}
          </template>
        </el-table-column>
        <el-table-column label="分配到催收员" prop="allotType" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.allotType == 620 ? "是":"否"}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.createTime| dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="creator" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="modifyClick(scope)" v-auth="8003">修改</el-button>
            <el-button type="text" size="small" @click="deleteClick(scope)" >删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--编辑策略弹框-->
    <el-dialog :title="addOrModify.flag?'新增策略':'修改策略'" :center="true" :visible.sync="dialog.edit" width="60%" @open="editTaticsOpen()">
      <edit-tatics :allName="allName" ref="edit-tatics" @close="dialog.edit = false;refreshData();" :addOrModifyFlag="addOrModify.flag" :companyCode="obtainModel.companyCode"></edit-tatics>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { ObtainTaticsService } from "~/services/dataimp-service/obtain-tatics.service";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import EditTatics from "~/components/tatics-manage/case-tactics/edit-obtain.vue";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";

@Auth(846)
@Layout("workspace")
@Component({
  components: {
    EditTatics,
    DataForm,
    DataBox
  }
})
export default class ObtainTatics extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(ObtainTaticsService)
  private obtainTaticsService: ObtainTaticsService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @State seriesNameList;
  @Getter isSupperAdmin: boolean;
  @Getter departmentData; //获取组织部门
  @State departmentList;

  private obtainModel: any = {
    companyCode: "",
    name: "",
    caseType: "",
    divisionFrequency: "",
    allotType: ""
  };
  private taticsDataSet: Array<any> = [];
  private taticsObj: any = {}; //策略对象
  private allotObj: any = {}; //策略编辑配置
  private addOrModify: any = {};
  private dialog: any = {
    edit: false,
    module: false,
    list: false
  };
  private seriesList: any = [];
  private productList: any = [];
  private allName: any = [];
  private productSeries: any = []; //产品类型列表

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.obtainModel.companyCode = this.userData.companyCode;
    }
    return this.obtainModel.companyCode;
  }

  set companyCode(value) {
    this.obtainModel.companyCode = value;
  }
  created() {
    this.getSelectProductSeries();
    this.refreshData();
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  editTaticsOpen() {
    this.$nextTick(() => {
      let editTatics: any = this.$refs["edit-tatics"];
      editTatics.refresh(this.taticsObj, this.allotObj, this.addOrModify);
    });
  }
  /**
   * 修改按钮
   */
  modifyClick(scope) {
    this.taticsObj.name = scope.row.name;
    this.taticsObj.priority = scope.row.priority;
    this.taticsObj.status = scope.row.status;
    this.taticsObj.departCode = scope.row.departCode;
    this.taticsObj.allocationPattern = scope.row.allocationPattern;
    this.taticsObj.productType = scope.row.productType;
    this.taticsObj.departId = [scope.row.departId];
    this.taticsObj.divisionFrequency = scope.row.divisionFrequency; //分案频率
    this.taticsObj.userPattern = scope.row.userPattern; //分配模式
    this.taticsObj.allotType = scope.row.allotType; //是否分配到催员
    this.taticsObj.caseType = scope.row.caseType; //案件类型
    this.taticsObj.assignType = scope.row.assignType;

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
        this.obtainTaticsService
          .deleteObtainTaticsStrategy(scope.row.id)
          .subscribe(
            data => {
              this.$message.success("删除成功！");
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
      stripMark: 0,
      tacticsType: "",
      seriesIds: [],
      productIds: [],
      name: "", //策略名称
      priority: "", //优先级
      status: "", //状态
      allocationPattern: "", //案件获取模式
      departId: [], //催收组织
      productType: "", //产品类型
      divisionFrequency: "", //分案频率
      userPattern: "", //催收员案件分配模式
      caseType: "", //案件类型
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
      departId: "", //返回部门ID
      users: [], //所选催收员列表ID
      assignType: 1
    };
    this.addOrModify = {
      flag: true, //flag 为true说明为新增策略 否则为修改
      id: "" //案件ID
    };
    this.dialog.edit = true;
  }
  refreshData() {
    this.obtainTaticsService
      .getObtainTaticsStrategy(this.obtainModel, this.pageService)
      .subscribe(
        data => {
          this.taticsDataSet = data;
          let array: any = [];
          this.allName = data.map(v => v.name);
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
  /**
   * 获取产品名称
   */
  getProductName(productType) {
    let productId: any = productType
      ? this.productSeries.find(v => v.id == productType)
      : "";
    return productId ? productId.typeName : "";
  }
  // getDept(scope) {
  //   let id: any = scope.row.departId?scope.row.departId[scope.row.departId.length - 1]:'';
  //   let department: any = this.departmentData.filter(v => (v.id = id))[0];
  //   return department ? department.name : "";
  // }
  /**
   * 获取产品系列
   */
  getSelectProductSeries() {
    this.obtainTaticsService.selectProductSeries().subscribe(
      d => {
        this.productSeries = d;
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
