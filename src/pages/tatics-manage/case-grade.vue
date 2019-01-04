<!--案件评分-->
<template>
  <div class="page">
    <details-tab :tabsArr="tabsArr" ref="tab">
      <template slot="importTactics">
        <CaseTableContent ref="import">
        </CaseTableContent>
      </template>
      <template slot="innerTactics">
        <CaseTableContent ref="inner">
        </CaseTableContent>
      </template>
      <template slot="outterTactics">
        <CaseTableContent ref="outter">
        </CaseTableContent>
      </template>
    </details-tab>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Auth, Layout, Dependencies } from "~/core/decorator";
  import CaseTableContent from "~/components/tatics-manage/case-tactics/case-table-content.vue";
  import DetailsTab from "~/components/tatics-manage/case-tactics/details-tab.vue";

  @Auth(838)
  @Layout('workspace')
  @Component({
  components: {
    CaseTableContent,
    DetailsTab
    }
  })
  export default class CaseGrade extends Vue {
    private tabsArr: any = [{
      title: '导入案件评分策略',
      pane: 'importTactics'
    }, {
      title: '内催案件评分策略',
      pane: 'innerTactics'
    }, {
      title: '委外案件评分策略',
      pane: 'outterTactics'
    }]
    private strategyType: any = {
      import: 230,
      inner: 231,
      outter: 232
    }
    mounted() {
      this.$nextTick(() => {
      let imports:any = this.$refs['import']
      imports.refresh(this.strategyType.import)
      let inner: any = this.$refs['inner']
      inner.refresh(this.strategyType.inner)
      let outter:any = this.$refs['outter']
      outter.refresh(this.strategyType.outter)
      })
    }
  }
</script>
<style scoped>
  .condition-item {
    border-bottom: 1px solid rgb(223, 230, 236);
    line-height: 38px;
  }
  .condition-item:last-child {
    border-bottom: 0px;
    line-height: 38px;
  }
  .score-item {
    border-bottom: 1px solid rgb(223, 230, 236);
    padding: 1px;
    line-height: 38px;
    height: 40px;
  }
  .score-item:last-child {
    border-bottom: 0px;
    padding: 1px;
    line-height: 38px;
  }
  .details-tab {
    margin-top: -22px;
  }
</style>

