<template>
  <section class="page template-config">
    <data-form :model="templateModel" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="code" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode" clearable>
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName" v-auth="5495">
          <el-input v-model="templateModel.templateName"></el-input>
        </el-form-item>
        <el-form-item label="模板类别" prop="templateType" v-auth="5496">
          <el-select v-model="templateModel.templateType" placeholder="请选择" clearable>
            <el-option v-for="{label,value} in $dict.getDictData('0023')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="模板形式" prop="templateStyle">
          <el-select v-model="templateModel.templateStyle" placeholder="请选择" clearable>
            <el-option v-for="{label,value} in $dict.getDictData('0022')" :key="label" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="templateStatus">
          <el-select v-model="templateModel.templateStatus" clearable>
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="createTemplateClick" v-auth="5497">新增模板</el-button>
      </template>
    </data-form>
    <data-box @onPageChange="refreshData" :data="templateDataSet" :page="pageService">
      <!--数据列区域-->
      <template slot="columns">
        <el-table-column prop="templateStyle" label="模板形式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.templateStyle == 101">短信</span>
            <span v-if="scope.row.templateStyle == 103">电子邮件</span>
            <span v-if="scope.row.templateStyle == 105">电催话术</span>
            <span v-if="scope.row.templateStyle == 104">信函模板</span>
          </template>
        </el-table-column>
        <el-table-column prop="templateType" label="模板类别" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.templateType| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="templateName" label="模板名称" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="templateCode" label="模板编号" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="isDefault" label="是否为默认模板" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.isDefault">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="templateStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.templateStatus == 0">启用</span>
            <span v-if="scope.row.templateStatus == 1">停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="操作人" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="cupoName" label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="updateClick(scope)" type="text" size="small" v-auth="5498">修改</el-button>
            <el-button @click="deleteClick(scope)" type="text" size="small" v-auth="5499">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--新增模板-->
    <el-dialog title="新增模板" :center="true" :visible.sync="dialog.createTemplate" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <span>请选择需要配置的模板形式：</span>
        <el-radio-group v-model="radio">
          <el-radio label="MessageTemplate">短信</el-radio>
          <el-radio label="EmailTemplate">电子邮件</el-radio>
          <el-radio label="CallAccTemplate">电催话术</el-radio>
          <el-radio label="LetterTemplate">信函模板</el-radio>
        </el-radio-group>
      </div>
      <component :is="radio" @success="refreshData" @close="dialog.createTemplate=false;radio='MessageTemplate'">
      </component>
    </el-dialog>
    <!--修改模板区域-->
    <el-dialog @open="updateTemplateData" title="修改模板" :center="true" :visible.sync="dialog.updateTemplate" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <component ref="update-template" :is="modifyTemp" @success="refreshData" @close="dialog.updateTemplate=false">
      </component>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { templateType } from "~/config/enum.config";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { TemplateService } from "~/services/business-service/template.service";
import MessageTemplate from "~/components/templete-manage/templete-config/message-template.vue";
import EmailTemplate from "~/components/templete-manage/templete-config/email-template.vue";
import CallAccTemplate from "~/components/templete-manage/templete-config/call-acc-template.vue";
import LetterTemplate from "~/components/templete-manage/templete-config/letter-template.vue";

@Auth(812)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    MessageTemplate,
    EmailTemplate,
    CallAccTemplate,
    LetterTemplate
  }
})
export default class TemplateConfig extends Vue {
  @Dependencies(TemplateService) private templateService: TemplateService;
  @Dependencies(PageService) private pageService: PageService;
  @State userData: any;
  @State companyList;
  @Getter isSupperAdmin: boolean;

  private selectionList: any = [];
  private templateModel: any = {};
  private templateDataSet: Array<any> = [];
  private dialog: any = {
    createTemplate: false,
    updateTemplate: false
  };
  private radio: any = "MessageTemplate"; // 默认新建模版
  private modifyTemp: any = ""; // 默认新建模版
  private selectData: any = {};
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.templateModel.companyCode = this.userData.companyCode;
    }
    return this.templateModel.companyCode;
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }

  set companyCode(value) {
    this.templateModel.companyCode = value;
  }
  created() {
    this.templateModel = {
      templateStyle: "", // 模版形式
      templateType: "", // 模版类型
      templateName: "", // 模版名称
      templateStatus: "", //  模版状态
      companyName: "",
      companyCode: ""
    };
  }
  refreshData() {
    this.templateService
      .getTemplatesByCondition(this.templateModel, this.pageService)
      .subscribe(
        data => {
          this.templateDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 打开新增模板弹框
   */
  createTemplateClick() {
    this.dialog.createTemplate = true;
  }
  /**
   * 修改模板弹框打开事件
   */
  updateTemplateData() {}
  /**
   * 修改模板
   */
  updateClick(scope) {
    let style = scope.row.templateStyle;
    this.modifyTemp = templateType[style].code;
    this.dialog.updateTemplate = true;
    this.$nextTick(() => {
      let updateTemplate: any = this.$refs["update-template"];
      updateTemplate.updateData(scope.row);
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
      this.templateService.deleteTemplateById(scope.row.id).subscribe(
        data => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          // 更新数据信息
          this.refreshData();
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
    });
  }
}
</script>

<style lang="less">
</style>
