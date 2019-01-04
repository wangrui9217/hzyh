<template>
  <section class="component image-data">
    <data-box :data="imageData" @onPageChange="refreshData" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="relation" label="文件类型" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="repaymentTime" label="上传时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.repaymentTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="custName" label="操作人" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button type="text">预览</el-button>
            <el-button type="text">下载</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import {
  Layout,
  Dependencies
} from "~/core/decorator";

@Layout("workspace")
@Component({
  components: {
    DataBox
  }
})
export default class ImageData extends Vue {
  private imageData: any = null
  refreshData() { }
}

</script>

<style lang="less" scoped>

</style>
