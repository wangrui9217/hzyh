<template>
  <section class="component outsource-area-report">
     <data-box :data="dataSet" style="max-height:400px;max-width:250px">
        <template slot="columns">
          <el-table-column prop="areaName" label="地区" align="center"></el-table-column>
          <el-table-column prop="number" label="案件数量" align="center"></el-table-column>
        </template>
    </data-box>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { Dependencies } from "~/core/decorator";
import { Prop, Watch } from "vue-property-decorator";
import { DistributionService } from "~/services/report-service/distribution.service";
@Component({
  components: {
    DataBox
  }
})
export default class OutsourceAreaReport extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(DistributionService) private distributionService: DistributionService;

  @Prop({
    type:String
  }) outId:String;

  @Watch('outId',{immediate:true})
  onOutSourceIdChange(val){
    if(val) this.freshData()
  }


  private dataSet: Array<any> = [];

  private freshData(){
    console.log(this.outId,'outId')
    this.distributionService.getOutSourceCaseInfoDetail(this.outId).subscribe(
      data => this.dataSet = data,
      err => this.$message.error(err.msg)
    )
  }

 
}
</script>
<style>
</style>
