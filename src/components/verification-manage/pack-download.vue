<template>
  <section class="component pack-download" v-loading.fullscreen="fullscreenLoading.state">
      <div style="font-size:16px;margin-bottom:20px;text-align: center">已选择案件数量：<span>{{caseNum}}</span>件 已选案件总金额：￥<span>{{caseMoney}}</span></div>
      <el-form ref="form" :model="params">
        <el-form-item label="备注：" label-width="100px" prop="state" style="position: relative;right: 31px;">
          <el-input type="textarea" resize="none" v-model="params.state"></el-input>
        </el-form-item>
      </el-form>
    <div style="text-align: center;margin-top:50px">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="download">立刻打包下载</el-button>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Layout,Dependencies } from "~/core/decorator";
  import { CaseInfoVerificationService} from "~/services/business-service/case-info-verification.service";
  import { Prop } from "vue-property-decorator";
  // import { Action } from "vuex-class";
  @Component({
    components: {}
  })
  export default class PackDownload extends Vue {
    @Dependencies(CaseInfoVerificationService) private caseInfoVerificationService: CaseInfoVerificationService;
    @Prop() caseMoney :any;
    @Prop() caseNum: any;
    @Prop() ids: any;
    @Prop() companyCode: any;
    // @Action select;
    private params: any = {
      state: '' // 打包说明
    }
    private fullscreenLoading: any = {
      state: false
    }

    cancel(){
      this.$emit('close')
      this.params.state = ''
    }
    download() {
      this.caseInfoVerificationService
        .exportVerification({
          companyCode: this.companyCode,
          ids: this.ids,
          state: this.params.state,
          // loading: this.fullscreenLoading
        })
        .subscribe( data => {
          this.$message.success('操作成功，请关注任务中心！')
          this.$emit('close')
        },({ msg }) => {
          this.$message.error(msg);
        })
    }
  }
</script>

<style scoped>

</style>

