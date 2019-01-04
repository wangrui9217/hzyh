<template>
  <section class="component import-record">
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
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import FileUpload from "~/components/common/file-upload.vue";
import { Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { Emit } from "vue-property-decorator";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
@Component({
  components: {
    FileUpload,
    DataForm,
    DataBox
  }
})
export default class ImportRecord extends Vue {
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  @Emit("refreshList")
  refreshList() {}
  @Emit("close")
  close() {}
  private model: any = {
    companyCode: "",
    fienRemark: "",
    type: 1,
    fileId: ""
  };
  private fileList: any = [];
  private submitLoading: Boolean = false;
  refresh() {
    let upload: any = this.$refs["file-upload"];
    upload.reset();
    this.model.fileId = "";
    this.model.fienRemark = "";
    this.model.companyCode = "";
  }
  commit() {
    if (!this.fileList.length) {
      this.$message.info("请上传文件");
      return false;
    }
    this.submitLoading = true;
    this.model.fileId = this.fileList[0].response.id;
    this.outsourcePoolService.importFinancData(this.model).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.info("跟进记录导入成功");
        this.refreshList();
        this.close();
      },
      ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      }
    );
  }
}
</script>

<style lang="less" scoped>
</style>
