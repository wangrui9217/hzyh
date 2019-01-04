<template>
  <section class="page outsource-acc">
    <data-form :model="outSourceAccModel" @onSearch="refreshData" :rules="outRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受托方编码" prop="outsCode" v-auth="5417">
          <el-input v-model="outSourceAccModel.outsCode"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="outsMobile" v-auth="5419">
          <el-input v-model="outSourceAccModel.outsMobile" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="机构类型" prop="outsOrgtype" v-auth="5420">
          <el-select v-model="outSourceAccModel.outsOrgtype" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0036')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受托方" prop="outsName" v-auth="5418">
          <el-select v-model="outSourceAccModel.outsName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,outsName} in outSourceList" :key="index" :label="outsName" :value="outsName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="flag">
              <el-select v-model="outSourceAccModel.flag" placeholder="请选择" clearable>
                <el-option label="启用" :value="0"></el-option>
                <el-option label="停用" :value="1"></el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="催收区域" prop="cityList">
          <el-cascader v-model="outSourceAccModel.cityList" :options="$city.getCityData({ level : 2 })" change-on-select clearable></el-cascader>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="addclientClick" v-auth="5421">新增受托方</el-button>
      </template>
    </data-form>
    <data-box :data="outSourceAccDataSet" :page="pageService" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="操作" width="110px">
          <template slot-scope="scope">
            <el-button @click="modifybuttonClick(scope.row)" type="text" size="small" v-auth="5422">修改</el-button>
            <!-- <el-button @click="deletebuttonClick(scope.row)" type="text" size="small" v-auth="5423">删除</el-button>  暂时不允许删除 -->
          </template>
        </el-table-column>
        <el-table-column prop="outsCode" label="受托方编码" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="outsName" label="受托方" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="flag" label="状态" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.flag==0">启用</span>
            <span v-if="scope.row.flag==1">停用</span>
            <span v-if="scope.row.flag==2">暂停</span>
          </template>
        </el-table-column>
        <el-table-column prop="outsOrgtype" label="机构类型" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.outsOrgtype | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="省份" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{$city.getCityName($city.getCityParent(scope.row.areaId)[0])}}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{$city.getCityName(scope.row.areaId)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outsContacts" label="联系人" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="outsPhone" label="电话" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.outsPhone| encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outsMobile" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.outsMobile| encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="催收区域" :min-width="$helper.getColumnWidth(10)" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="openAreas(scope.row.areaCodes)">{{ areaText(scope.row.areaCodes)}}</el-button>
          </template>
        </el-table-column>
        
      </template>
    </data-box>
    <!--新增受托方-->
    <el-dialog title="新增受托方" :center="true" :visible.sync="dialog.addClient" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" @close="addForeignClose()">
      <add-foreign-client @close="dialog.addClient=false" @refreshList="refreshData(),getAllOutsource()" ref="add-foreign-client"></add-foreign-client>
    </el-dialog>
    <!--修改受托方-->
    <el-dialog title="修改受托方" :center="true" :visible.sync="dialog.modifyClient" width="700px" :close-on-click-modal="false" :close-on-press-escape="false">
      <modify-foreign-client @close="dialog.modifyClient=false" @refreshList="refreshData(),getAllOutsource()" ref="modify-foreign-client"></modify-foreign-client>
    </el-dialog>
    <!-- 查看区域 -->
    <el-dialog title="查看区域" :center="true" :visible.sync="dialog.area" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
      <area-selection :selectedCitys="rowSelectedCitys" ref="area-selection" :disabled="true"></area-selection>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialog.area = false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { State, Getter, Action } from "vuex-class";
import { OutsourceService } from "~/services/business-service/outsource.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import AddForeignClient from "~/components/outsource-manage/outsource-acc/add-foreign-client.vue";
import ModifyForeignClient from "~/components/outsource-manage/outsource-acc/modify-foreign-client.vue";
import AreaSelection from "~/components/common/area-selection.vue";

@Auth(522)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    AddForeignClient,
    ModifyForeignClient,
    AreaSelection
  }
})
export default class OutsourceAcc extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourceService) private outsourceService: OutsourceService;

  @State outSourceList: any;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Action getAllOutsource;
  private outSourceAccDataSet = [];
  private rowSelectedCitys:Array<any> = [];
  private outSourceAccModel: any = {};
  private dialog: any = {};
  // 表单验证规则
  private outRule = {
    outsMobile: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.outSourceAccModel.companyCode = this.userData.companyCode;
    }
    return this.outSourceAccModel.companyCode;
  }

  set companyCode(value) {
    this.outSourceAccModel.companyCode = value;
  }

  private areaText(areaCodes:Array<any>) {
    if(!areaCodes) return ''
    let textArray:Array<string> = []
    for( let i=0 ; i<areaCodes.length ; i++ ){
      if( i < 3 ) {
        textArray.push(areaCodes[i].areaName)
      }
    }
    return textArray.join(' ')
  }

  private areaCodes(areaCodes:Array<any>){
    if(!areaCodes) return []
    return areaCodes.map(v => v.id)
  }
  private openAreas(areaCodes:Array<any>) {
    this.rowSelectedCitys = this.areaCodes(areaCodes)
    this.dialog.area = true
  }

  created() {
    this.dialog = {
      addClient: false,
      modifyClient: false,
      area:false
    };
    this.outSourceAccModel = {
      outsCode: "",
      outsName: "",
      outsOrgtype: "",
      outsMobile: "",
      outRegion: "",
      companyCode: "",
      cityList: [],
      flag: ""
    };
  }
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  /**
   * 新增受托方窗口关闭
   */
  addForeignClose() {
    let addForeign: any = this.$refs["add-foreign-client"];
    addForeign.resetFields();
  }
  refreshData() {
    this.outsourceService
      .query(this.outSourceAccModel, this.pageService)
      .subscribe(
        data => {
          this.outSourceAccDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  deletebuttonClick(row) {
    this.$confirm("您确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.outsourceService.deleteOutsource(row.id).subscribe(
          data => {
            this.$message.success("操作成功");
            this.pageService.reset();
            this.refreshData();
            this.getAllOutsource();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  addclientClick() {
    this.dialog.addClient = true;
  }
  modifybuttonClick(row) {
    this.dialog.modifyClient = true;
    this.$nextTick(() => {
      let ModifyForeignClient: any = this.$refs["modify-foreign-client"];
      ModifyForeignClient.refreshData(row);
    });
  }
}
</script>

<style lang="less">
</style>
