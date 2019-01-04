<template>
  <section class="page client-manage">
    <data-form :model="clientModel" @onSearch="refreshData" :page="pageService" :rules="clientRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方编码" prop="code" v-auth="5372">
          <el-input v-model="clientModel.code"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="name" v-auth="5373">
          <el-select v-model="clientModel.name" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" v-auth="5374">
          <el-input v-model="clientModel.mobile" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="机构类型" prop="type" v-auth="5375">
          <el-select v-model="clientModel.type" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0036')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="collapse-input">
      </template>
      <template slot="default-button">
        <el-button @click="dialog.add = true" v-auth="5376">新增委托方</el-button>
      </template>
    </data-form>
    <data-box :data="clientDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="code" label="委托方编码" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="name" label="委托方" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="type" label="机构类型" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.type|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="省份" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{$city.getCityName($city.getCityParent(scope.row.areaId)[0])}}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{$city.getCityName($city.getCityParent(scope.row.areaId)[1])}}</span>
          </template>
        </el-table-column>
        <el-table-column label="区/县" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{$city.getCityName(scope.row.areaId)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contacts" label="联系人" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="phone" label="电话" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.phone| encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.mobile| encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="dialog.modify=true,clientObj=scope.row" type="text" size="small" v-auth="5377">修改</el-button>
            <el-button @click="deletebuttonClick(scope)" type="text" size="small"  v-auth="5378">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--新增委托方-->
    <el-dialog title="新增委托方" :center="true" :visible.sync="dialog.add" width="60%" @close="$refs['add-client'].reset()" @open="$nextTick(()=>$refs['add-client'].refresh(clientModel.companyCode))">
      <add-client @close="dialog.add = false" @refreshList="refreshData" ref="add-client"></add-client>
    </el-dialog>

    <!--修改委托方-->
    <el-dialog title="修改委托方" :center="true" :visible.sync="dialog.modify" width="60%" @close="$refs['modify-client'].reset()" @open="$nextTick(()=>$refs['modify-client'].refresh(clientObj))">
      <modify-client ref="modify-client" @close="dialog.modify = false" @refreshList="refreshData"></modify-client>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter, Action } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { PrincipalService } from "~/services/business-service/principal.service";
import AddClient from "~/components/case-import/client-manage/add-client.vue";
import ModifyClient from "~/components/case-import/client-manage/modify-client.vue";

@Auth(391)
@Layout('workspace')
@Component({
  components: {
    AddClient,
    ModifyClient,
    DataBox,
    DataForm
  }
})
export default class ClientManage extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  @Action getPrincipalList
  private clientModel: any = {
    code: '',
    name: '',
    type: '',
    mobile: '',
    companyCode: ''
  };
  // 表单验证规则
  private clientRule = {
    mobile: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private clientDataSet = null;
  private dialog: any = {
    add: false,
    modify: false
  };
  private clientObj: any = {};
  /**
 * 考虑到非管理员不显示公司选择控件
 * get 操作的时候强制设置非管理员所在公司码
*/
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.clientModel.companyCode = this.userData.companyCode
    }
    return this.clientModel.companyCode
  }

  set companyCode(value) {
    this.clientModel.companyCode = value
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
   * 删除委托方
   */
  deletebuttonClick(scope) {
    this.$confirm('您确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.principalService.deletePrincipal(scope.row.id).subscribe(data => {
        this.$message.success('删除委托方成功')
        this.pageService.reset()
        this.getPrincipalList()
        this.refreshData()
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    }).catch(() => {
      this.$message('已取消删除')
    })
  }
  refreshData() {
    this.principalService.getPrincipalPageList(this.clientModel, this.pageService).subscribe(data => {
      this.clientDataSet = data;
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false
    }
  }
}

</script>

<style lang="less">

</style>
