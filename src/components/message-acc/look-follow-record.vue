<template>
  <section class="component look-follow-record">
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Dependencies } from "~/core/decorator";
  import DataForm from "~/components/common/data-form.vue";
  import DataBox from "~/components/common/data-box.vue";
  import { PageService } from "~/utils/page.service";

  @Component({
    components: {
      DataForm,
      DataBox,
    }
  })
  export default class LookFollowRecord extends Vue {
    @Dependencies(PageService) private pageService: PageService;

    private accFeedback:any = []
    private pickerOptions:any = {}
    // 案件流转记录
    private caseTransfer: any = {
      flag: false,
      data: []
    }

    private lookModel: any = {
      source: '', // 来源
      type: '',
      collectionFeedback: '',
      collectionFeedbacks: [],
      operatorTime: ['', ''] // 跟进日期
    }

    refreshData(){
      // this.accTelPoolService
      //   .getPhoneRecord(this.defaultParams.caseNumber,this.pageService)
      //   .subscribe( data =>{
      //     this.callRecordDataSet = data;
      //   },({ msg }) => {
      //     this.$message.error(msg);
      //   })
    }
  }
</script>

<style lang="less" scoped>

</style>
