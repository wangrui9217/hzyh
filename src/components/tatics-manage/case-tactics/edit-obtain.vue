<!--案件获取的添加与编辑页面-->
<template>
  <section class="component edit-tatics">
    <el-form :model="editModel" ref="edit-form" label-width="140px" :rules="editRules">
      <el-row class="flex_content">
          <el-form-item label="策略名称:" prop="name">
            <el-input v-model="editModel.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="案件类型:" prop="caseType">
            <el-select v-model="editModel.caseType" placeholder="请选择" clearable @change="caseTypeChange">
              <el-option v-for="{ value, label } in $dict.getDictData('0103')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model="editModel.status" placeholder="请选择">
              <el-option v-for="{value, label} in $dict.getDictData('0101')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="案件获取模式:" prop="allocationPattern">
            <el-select v-model="editModel.allocationPattern" placeholder="请选择" clearable>
              <el-option v-for="{ value, label } in $dict.getDictData('0102')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="催收组织:" prop="deptCodes" v-if="disableType">
            <el-cascader v-model="editModel.deptCodes" :options="departmentData" :show-all-levels="false" :props="{value:'code',label:'name'}" change-on-select clearable style="line-height:1" @change="getcupoId();refreshData()"></el-cascader>
          </el-form-item>
          <el-form-item label="执行频率:" style="margin-bottom:15px" class="text-left">
            <el-radio-group v-model="editModel.divisionFrequency">
              <el-radio v-for="{ value, label } in $dict.getDictData('0106')" :key="value" :label="value">{{label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="催收员案件分配模式:" prop="userPattern" v-if="allotType==620">
            <el-select v-model="editModel.userPattern" placeholder="请选择" clearable>
              <el-option v-for="{ value, label } in $dict.getDictData('0105')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否分配到催员:" style="margin-bottom:15px" class="text-left" v-if="disableType">
            <el-radio-group v-model="allotType" @change="collectionChange">
              <el-radio :label="620">是</el-radio>
              <el-radio :label="621">否</el-radio>
            </el-radio-group>
          </el-form-item>
      </el-row>
    </el-form>
    <!-- 选择催收员 -->
      <data-box :max-height="400" :selectionList.sync="selectionList" :data="userDataSet" ref="data-box" v-if="tableModel" v-loading="refreshDataLoading">
        <template slot="columns">
          <el-table-column prop="name" label="用户名" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="department" label="所属机构" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              {{scope.row.deptName?scope.row.deptName:""}}
            </template>
          </el-table-column>
        </template>
      </data-box>
    <div style="min-height:150px;border:1px solid #ddd;padding:15px " class="text-left add-tactics ">
      <tactics-item :data="tacticsData" @getJsonData="JsonData" @productTypeItem="productTypeItem" ref="tatics-item"></tactics-item>
    </div>
    <el-col class="dialog-footer" align="center">
      <el-button @click="close">取消</el-button>
      <el-button @click="finish" :loading="submitLoading">保存</el-button>
    </el-col>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { ObtainTaticsService } from "~/services/dataimp-service/obtain-tatics.service";
import { queryUserService } from "~/services/report-service/query-user.service";
import { UserService } from "~/services/business-service/user.service";
import { Emit, Prop } from "vue-property-decorator";
import { State, Mutation, Getter, namespace } from "vuex-class";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import TacticsItem from "~/components/tatics-manage/case-tactics/edit-tatics/tatics-item.vue";

import clone from "clone";
const taticManageModule = namespace("tatic-manage");

@Component({
  components: {
    TacticsItem,
    DataBox
  }
})
export default class EditTatics extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(queryUserService) private queryUserService: queryUserService;
  @Dependencies(ObtainTaticsService)
  private obtainTaticsService: ObtainTaticsService;
  @Dependencies(UserService) private userService: UserService;
  @taticManageModule.State("tacticsFlag") tacticsFlag;
  @taticManageModule.Mutation("updateTacticsFlag") updateTacticsFlag;
  @Emit("close")
  close() {
    this.allotType = 621
    this.selectionList= []
    this.userDataSet = []
    this.tableModel = false
    this.allotObj = {}
    this.addOrModify = {}
    this.productSeries = []
    this.tacticsData = []
    this.editProductId = ''
    this.disableType = true; //默认可用
    this.submitLoading = false;
    this.refreshDataLoading = false;
    this.editModel = {
      strategyText: "",
      name: "", //策略名称
      caseType: "", //案件类型
      status: "", //状态
      allocationPattern: "", //案件获取模式
      deptCodes: [], //催收组织
      deptCode:'',
      departId: "", //过滤之后的部门ID
      departCode: [],
      userPattern: "", //催收员案件分配模式
      strategyJson: [], // 策略JSON对象
      divisionFrequency: "" //分案频率
    };
    this.reset()
  }
  @State storeList: any;
  @State departmentList;
  //获取策略名称
  @Prop() allName: any;
  @Prop() addOrModifyFlag: any;
  // @Prop() companyCode: any;
  @State companyCode: any;
  @Getter departmentData; //获取组织部门
  private allotType: any = 621; //是否分配到催员
  private selectionList: any = []; //选择的催收员
  private userDataSet: Array<any> = []; //催收员列表数据
  private tableModel: Boolean = false;
  private allotObj: any = {}; // 从上级返回 不知干啥的
  private addOrModify: any = {};
  private productSeries: any = []; //产品类型列表
  private editModel: any = {
    strategyText: "",
    name: "", //策略名称
    caseType: "", //案件类型
    status: "", //状态
    allocationPattern: "", //案件获取模式
    deptCodes: [], //催收组织
    deptCode:'',
    departId: "", //过滤之后的部门ID
    departCode: [],
    userPattern: "", //催收员案件分配模式
    strategyJson: [], // 策略JSON对象
    divisionFrequency: "" //分案频率
  };
  private tacticsData: any = [];
  private editProductId: any = "";
  private refreshDataLoading: Boolean = false;
  private editRules: any = {
    name: [
      { required: true, message: "请输入策略名称", trigger: "blur" },
      { validator: this.validatorName, trigger: "blur" }
    ],
    caseType: [
      {
        required: true,
        message: "请选择案件类型",
        trigger: "change"
      }
    ],
    status: [
      {
        required: true,
        type: "number",
        message: "请选择案件状态",
        trigger: "change"
      }
    ],
    userPattern: [
      {
        required: true,
        type: "number",
        message: "请选择催收员案件分配模式",
        trigger: "change"
      }
    ],
    divisionFrequency: [
      {
        required: true,
        type: "number",
        message: "请选择执行频率",
        trigger: "change"
      }
    ],
    allocationPattern: [
      {
        required: true,
        type: "number",
        message: "请选案件获取模式",
        trigger: "change"
      }
    ]
  };
  private disableType = true; //默认可用
  private submitLoading: Boolean = false;
  validatorName(rule, value, callback) {
    if (this.addOrModifyFlag) {
      if (this.allName.includes(value)) {
        callback(new Error("策略名称已存在"));
      }
    }
    callback();
  }
  mounted() {
  }
  /**
   * 案件类型选择
   * @ disableType(催收员展示列表)
   */
  caseTypeChange() {
    if (this.editModel.caseType === 541) {
      //（选择委外时，隐藏催收组织和是否分配到催收员）
      this.disableType = false;
      this.tableModel = false;
      this.allotType = 621
    } else if (this.editModel.caseType === 540) {
      //选择电催案件只能分配到人
      this.allotType = 620;
      this.disableType = true;
      this.tableModel = true;
    } else if (this.editModel.caseType === 546) {
      //选择外访案件只能分配到组
      this.allotType = 621;
      this.disableType = true;
      this.tableModel = false;
    } else {
      this.disableType = true;
      this.tableModel = false;
      this.allotType = 621;
    }
  }
  finish() {
    let tatics: any = this.$refs["tatics-item"];
    let editForm: any = this.$refs["edit-form"];
    editForm.validate(valid => {
      if (!valid) return false;
      if (this.allotType == 620 && this.selectionList.length < 1) {
        this.$alert("请选择催收员", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      tatics.getJsonData();
      let pType: any = this.tacticsData.find(v => v.variable == "productType");
      let obj: any = {
        companyCode: this.companyCode?this.companyCode:"0001",
        name: this.editModel.name, //策略名称
        caseType: this.editModel.caseType, //案件类型
        status: this.editModel.status, //状态
        allocationPattern: this.editModel.allocationPattern, //案件获取模式
        strategyJson: JSON.stringify(this.editModel.strategyJson),
        departId: this.editModel.departId, //催收组织 全部数组
        departCode: this.editModel.deptCodes,
        productType:
          this.addOrModifyFlag == true
            ? this.editProductId
            : pType ? pType.value : "", //产品类型
        divisionFrequency: this.editModel.divisionFrequency, //分案频率
        userPattern: this.editModel.userPattern, //催收员案件分配模式
        id: "",
        users:
          this.selectionList.length > 0
            ? this.selectionList.map(v => v.id)
            : [],
        allotType: this.allotType //是否分配给催收员
      };
      if(!obj.productType) {
        this.$alert("请添加产品类型", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }

      if (!this.addOrModify.flag) {
        obj.id = this.addOrModify.id;
      }
      this.submitLoading = true;
      this.obtainTaticsService.addObtainTaticsStrategy(obj).subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("操作成功");
          this.close();
        },
        err => {
          this.submitLoading = false;
          this.$message.error(err.msg);
        }
      );
    });
  }
  JsonData(data) {
    this.editModel.strategyJson = data;
  }
  productTypeItem(id) {
    //获取编辑状态下的产品类型
    if (id) {
      this.editProductId = id;
    } else {
      this.editProductId = "";
    }
  }
  /**
   * 打开编辑窗口传值到页面
   */
  refresh(tactics, allotObj, addOrModify) {
    if(addOrModify.flag) {
      this.allotType = 621
      this.selectionList= []
      this.userDataSet = []
      this.tableModel = false
      this.productSeries = []
      this.tacticsData = tactics.strategyJson;
      this.editProductId = ''
      this.disableType = true; //默认可用
      this.submitLoading = false;
      this.refreshDataLoading = false;
      this.editModel = {
        strategyText: "",
        name: "", //策略名称
        caseType: "", //案件类型
        status: 504, //状态
        allocationPattern: 530, //案件获取模式
        deptCodes: [], //催收组织
        deptCode:'',
        departId: "", //过滤之后的部门ID
        departCode: [],
        userPattern: "", //催收员案件分配模式
        strategyJson: [], // 策略JSON对象
        divisionFrequency: 610 //分案频率
      };
      this.caseTypeChange()
      return
    }
    this.editModel.productType = tactics.productType;
    this.allotObj = allotObj;
    this.addOrModify = addOrModify;
    this.updateTacticsFlag(false);
    this.editModel.name = tactics.name;
    this.editModel.departId = tactics.departId
    this.editModel.departCode = tactics.departCode
    this.editModel.deptCodes = tactics.departCode
    this.editModel.caseType = tactics.caseType;
    this.editModel.status = tactics.status;
    this.editModel.allocationPattern = tactics.allocationPattern;
    this.editModel.divisionFrequency = tactics.divisionFrequency
      ? tactics.divisionFrequency
      : 610; //分案频率
    this.allotType = tactics.allotType ? tactics.allotType : 621; //是否分配到催员
    this.editModel.userPattern = tactics.userPattern; //分配模式
    this.editModel.assignType = tactics.assignType;
    this.tacticsData = tactics.strategyJson; //规则数据
    if (this.allotType == 620) {
      //根据返回数据判断催收员列表是否显示
      this.tableModel = true;
      this.getcupoId();
      this.refreshData();
    } else {
      this.tableModel = false;
    }
    this.getcupoId()
    this.caseTypeChange()
    let self = this;
    setTimeout(() => {
      self.updateTacticsFlag(true);
    }, 100);
  }
  /**
   * 显示所选的催收员
   */
  showSelectList() {
    this.selectionList = this.allotObj.users.map(d => {
      return this.userDataSet.find(v => v.id == d);
    });
  }
  /**
   * 机构改变
   */
  getcupoId() {
    if (this.editModel.deptCodes.length > 0) {
      let deptCode:any = this.editModel.deptCodes[this.editModel.deptCodes.length - 1];
      let deptId:any = this.departmentList.find(v =>v.code === deptCode ).id;
      this.editModel.departId = deptId;
      this.editModel.deptCode = deptCode;
    } else {
      this.editModel.deptCode = "";
      this.editModel.departId = "";
    }
  }
  /**
   * 分配到催收员
   */
  collectionChange(value) {
    if (value === 620) {
      if (this.editModel.departId === "") {
        this.allotType = 621;
        this.$message.info("请先选择催收组织!");
      } else if (this.editModel.caseType === 546) {
        this.allotType = 621;
        this.$message.info("选择外访案件，只能分配到机构!");
      } else {
        this.tableModel = true;
      }
    } else {
      if (this.editModel.caseType === 540) {
        this.allotType = 620;
        this.$message.info("选择电催案件，只能分配到催收员!");
        this.tableModel = true;
        return
      }
      this.tableModel = false
      this.selectionList= []

    }
  }
  /**
   * 刷新催收员列表
   */
  refreshData() {
    this.refreshDataLoading = true
    this.userDataSet = []
    this.pageService.pageSize = 9999
    this.queryUserService
      .queryUsers(
        {
          deptCode: this.editModel.deptCode,
        },
        this.pageService
      )
      .subscribe(
        data => {
          this.userDataSet = data;
          this.refreshDataLoading = false
          if (!this.addOrModifyFlag && this.allotType == 620) {
            this.showSelectList();
          }
        },
        ({ msg }) => {
          this.$message.error(msg);
          this.refreshDataLoading = false
        }
      );
  }

  /**
   * 重置
   */
  reset() {
    this.$nextTick(() => {
      let editForm: any = this.$refs["edit-form"];
      editForm.resetFields();
    }) 
  }
}
</script>

<style lang="less" scoped>
.dialog-footer {
  padding: 20px;
}
</style>
<style lang="less">
.edit-tatics {
  .more .el-input__inner,
  .more .el-input {
    min-width: 250px;
  }
  .more .el-select__tags {
    max-width: auto !important;
  }
  .flex_content {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

