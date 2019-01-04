<template>
  <section class="component case-detail" v-loading.fullscreen="loaded" >
    <el-card>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="客户信息" name="cust-info">
          <case-detail-cust-info :caseDetail="caseDetail" ref="cust-info"></case-detail-cust-info>
        </el-tab-pane>
        <el-tab-pane label="还款信息" name="pay-info">
          <case-detail-pay-info ref="pay-info"></case-detail-pay-info>
        </el-tab-pane>
        <el-tab-pane label="附件信息" name="attach-info">
          <case-detail-attach-info ref="attach-info"></case-detail-attach-info>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Watch, Prop, Emit } from "vue-property-decorator"
  import { Dependencies } from "~/core/decorator"
  import { Action, namespace, State } from "vuex-class"
  import { AccTelPoolService } from '~/services/business-service/acc-tel-pool.service'
  // 引入案件详情子页面
  import CaseDetailCustInfo from '~/components/acc-manage/case-detail/case-detail-cust-info.vue'
  import CaseDetailPayInfo from '~/components/acc-manage/case-detail/case-detail-pay-info.vue'
  import CaseDetailAttachInfo from '~/components/acc-manage/case-detail/case-detail-attach-info.vue'
  import { CaseInfoService } from "~/services/business-service/case-info.service";
  import { PersonalInformationService } from "~/services/business-service/personal-Information.service";

  const accManageModule = namespace("acc-manage");


  @Component({
    components: {
      CaseDetailAttachInfo,
      CaseDetailCustInfo,
      CaseDetailPayInfo
    }
  })
  export default class CaseDetail extends Vue {
    @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
    @Dependencies(PersonalInformationService) private personalInformationService: PersonalInformationService;
    // action 根据CaseId 进行查询的方法
    @accManageModule.Action getCaseInfoByCaseId;
    @accManageModule.State caseDetail;
    // caseId, 案件ID 必传
    @Prop({
      required: true,
      type: String
    })
    caseId

    @Prop({
      required: true,
      type: String
    })
    caseNumber

    // 是否需要再次请求caseInfo 数据
    @Prop({
      type: Boolean,
      default: true
    })
    needRequest


    @Watch('caseId')
    async onCaseIdChaged() {
      await this.doRequest()
    }

    // 默认激活页面
    private activeName: String = "cust-info"
    // 等待加载进度条
    private loaded: Boolean = true

    async doRequest() {
      this.loaded = true
      if (this.needRequest) {
        await this.getCaseInfoByCaseId(this.caseId)
      }
      // 数据存储到state之后，再延迟500ms ，等待UI更新
      setTimeout(() => this.loaded = false, 1000)
    }

    mounted() {
      this.activeName = "cust-info"
      this.doRequest()
      this.personalInformationService
        .getCaseFIleModelByCaseId(this.caseId)
        .subscribe(
          data => {
            console.log(data,'data')
            if (data) {
              let att: any = this.$refs["attach-info"];
              att.refresh(data);
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    }
  }

</script>


<style lang="less" scoped>


</style>
