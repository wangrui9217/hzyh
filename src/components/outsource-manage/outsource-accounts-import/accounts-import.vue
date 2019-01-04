<template>
  <section class="component accounts-import">
    <el-form ref="data-form" :model="model" label-width="100px" class="text-left">
      <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
        <el-select size="small" v-model="model.companyCode">
          <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件">
        <file-upload :fileNumberLimit="1" :fileList.sync="fileList" ref="file-upload"></file-upload>
      </el-form-item>
      <el-form-item label="备注" prop="fienRemark">
        <el-input type="textarea" v-model="model.fienRemark" :maxlength="500" resize="none"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:50px">
      <el-button @click="close">取消</el-button>
      <el-button @click="commit" :loading="submitLoading">确定</el-button>
    </div>
    <!--EXCEL错误弹出框-->
    <el-dialog title="Excel数据错误" :center="true" :visible.sync="dialog.errMsg" width="50%">
      <section class="component accounts-import-error-msg">
        <data-box :data="errMsgData">
          <template slot="column">
            <el-table-column prop="errorMsg" label="错误提示" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
          </template>
        </data-box>
      </section>
    </el-dialog>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Prop, Emit } from "vue-property-decorator";
import { State, Getter } from "vuex-class";
import FileUpload from "~/components/common/file-upload.vue";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
@Component({
  components: {
    FileUpload
  }
})
export default class AccountsImport extends Vue {
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;

  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;

  @Emit("close")
  close() {}
  @Emit("refreshList")
  refreshList() {}

  private fileList: any = [];
  private errMsgData: any = [];
  private model: any = {
    companyCode: "",
    fienRemark: "",
    type: 0,
    fileId: ""
  };
  private dialog: any = {
    errMsg: false
  };
  private submitLoading: Boolean = false;
  commit() {
    if (!this.fileList.length) {
      this.$message.info("请上传文件");
      return false;
    }
    this.model = {
      companyCode: "",
      fienRemark: "",
      type: 0, //账目导入为0，跟进记录导入为1
      fileId: this.fileList[0].response.id
     };
     this.submitLoading = true;
    this.outsourcePoolService.importFinancData(this.model).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.info("导入成功");
        this.refreshList();
        this.close();
      },
      err => {
        this.submitLoading = false;
        if (!err.data) {
          this.$message.info(err.msg);
        } else {
          
          this.errMsgData = err.data;
          this.dialog.errMsg = true;
        }
      }
    );
  }
  refresh() {
    let upload: any = this.$refs["file-upload"];
    upload.reset();
    this.model = {};
  }
  mounted() {
    this.model.companyCode = this.userData.companyCode;
  }
}
</script>
<style>

</style>
