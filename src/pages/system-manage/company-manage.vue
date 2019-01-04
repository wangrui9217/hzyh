<template>
  <!--公司管理-->
  <section class="page company-manage">
    <data-form :rules="callRule" :model="queryModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="code" v-show="isSupperAdmin">
          <el-select size="small" v-model="queryModel.code">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone" v-auth="5520">
          <el-input v-model.number="queryModel.phone"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson" v-auth="5521">
          <el-input v-model="queryModel.contactPerson"></el-input>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="createCompanyClick" v-auth="5522">新增公司</el-button>
      </template>
    </data-form>
    <data-box @onPageChange="refreshData" :data="queryCompanyDataSet" :page="pageService">
      <template slot="columns">
        <el-table-column prop="chinaName" label="公司名称" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="engName" label="公司英文名" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="status" label="状态" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span v-if="Number(scope.row.status)">停用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="公司编码" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="legPerson" label="法人" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="地址" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="city" label="城市" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="phone" label="电话" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="fax" label="传真" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contactPerson" label="联系人" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="operateTime" label="操作时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.operateTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button @click="dialog.modifyCompany = true, companyObj = scope.row" type="text" v-auth="5523">修改</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-dialog title="新增公司" :center="true" :visible.sync="dialog.addCompany" @open="$nextTick(()=>$refs['add-company'].refresh())">
      <add-company ref="add-company" @close="dialog.addCompany = false" @refreshList="refreshData"></add-company>
    </el-dialog>
    <el-dialog title="修改公司" :center="true" :visible.sync="dialog.modifyCompany" @open="$nextTick(()=>$refs['modify-company'].refresh(companyObj))">
      <modify-company ref="modify-company" @close="dialog.modifyCompany = false" @refreshList="refreshData"></modify-company>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { CompanyService } from "~/services/business-service/company.service";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import AddCompany from "~/components/system-manage/company-manage/add-company.vue";
import ModifyCompany from "~/components/system-manage/company-manage/modify-company.vue";

@Auth(1112)
@Layout("workspace")
@Component({
  components: {
    ModifyCompany,
    DataForm,
    DataBox,
    AddCompany
  }
})
export default class CompanyManage extends Vue {
  @State companyList;
  @Getter isSupperAdmin: boolean;
  @Dependencies(CompanyService) private companyService: CompanyService;
  @Dependencies(PageService) private pageService: PageService;
  @State userData: any;

  private dialog: any = {
    addCompany: false,
    modifyCompany: false
  };
  // 电催表单验证规则
  private callRule = {
    phone: [{ validator: this.$validator.callNumber, trigger: "blur" }]
    
  };
  // form 查询表单参数
  private queryModel: any = {
    code: "",
    phone: "",
    contactPerson: ""
  };
  private companyObj: any = {}
  private queryCompanyDataSet = null;
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.queryModel.code = this.userData.companyCode
    }
    return this.queryModel.code
  }

  set companyCode(value) {
    this.queryModel.code = value
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }

  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false
    }
  }
  mounted() {
    this.refreshData();
  }
  /**
   * 查询公司
   */
  refreshData() {
    this.companyService
      .queryCompanyList(this.queryModel, this.pageService)
      .subscribe(data => {
        this.queryCompanyDataSet = data;
      });
  }

  /**
   * 修改公司信息
   */
  modifyCompany(scope) { }

  createCompanyClick() {
    this.dialog.addCompany = true;
  }
}
</script>

<style lang="less">

</style>
