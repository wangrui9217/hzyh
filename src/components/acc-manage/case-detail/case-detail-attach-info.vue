<template>
  <section class="component case-detail-attach-info">
    <el-col class="frame">
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="jinjiancailiao"></svg-icon>
        <span>进件材料</span>
      </div>
      <data-box :data="attachDataSet.inputDataList">
        <template slot="columns">
          <el-table-column prop="fileType" label="证件材料类型" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileCode" label="证件材料代码" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operatorTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{scope.row.operatorTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="上传操作员" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileName" label="存储文件名" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row.fileUrl)">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="jinjiancailiao"></svg-icon>
        <span>补充材料</span>
      </div>
      <data-box :data="attachDataSet.supplementaryList">
        <template slot="columns">
          <el-table-column prop="fileType" label="证件材料类型" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileCode" label="证件材料代码" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operatorTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{scope.row.operatorTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="上传操作员" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileName" label="存储文件名" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row.fileUrl)">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="jinjiancailiao"></svg-icon>
        <span>线上合同</span>
      </div>
      <data-box :data="attachDataSet.onlineContracts">
        <template slot="columns">
          <el-table-column prop="fileType" label="证件材料类型" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileCode" label="证件材料代码" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operatorTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{scope.row.operatorTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="上传操作员" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileName" label="存储文件名" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row.fileUrl)">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="jinjiancailiao"></svg-icon>
        <span>线下合同</span>
      </div>
      <data-box :data="attachDataSet.underContracts">
        <template slot="columns">
          <el-table-column prop="fileType" label="证件材料类型" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileCode" label="证件材料代码" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operatorTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{scope.row.operatorTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="上传操作员" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileName" label="存储文件名" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row.fileUrl)">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="jinjiancailiao"></svg-icon>
        <span>其他材料</span>
      </div>
      <data-box :data="attachDataSet.otherFileList">
        <template slot="columns">
          <el-table-column prop="fileType" label="证件材料类型" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileCode" label="证件材料代码" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operatorTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{scope.row.operatorTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="上传操作员" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileName" label="存储文件名" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row.fileUrl)">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
    </el-col>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue"
import SvgIcon from "~/components/common/svg-icon.vue";
import { Watch, Prop } from "vue-property-decorator";
import { Base64 } from "js-base64";
import { CommonService } from "~/utils/common.service";

@Component({
  components: {
    DataBox,
    SvgIcon
  }
})
export default class CaseDetailAttachInfo extends Vue {

  private attachDataSet = {
    inputDataList: [], // 进件材料
    supplementaryList: [], // 材料补充
    onlineContracts: [], // 线上合同
    underContracts: [], // 线下合同
    otherFileList: [] // 其他材料
  }
  private type: any = ''

  get checkImgDialog() {
    return this.$store.state.app.checkImgDialog
  }
  set checkImgDialog(val) {
    this.$store.commit('updateCheckImgDialog', val)
  }
  get checkImgUrl() {
    return this.$store.state.app.checkImgUrl
  }
  set checkImgUrl(val) {
    this.$store.commit('updateCheckImgUrl', val)
  }

  downloadFile(url) {
    CommonService.downloadFile(url)
  }
  /**
   * 文件类型检测，是否可以直接展示
   */
  fileTypeCheck(name) {
    if (name) {
      let arr = name.split('.')
      let type = arr[arr.length - 1]
      if (type === 'jpg' || type === 'png') {
        return true
      }
    }
    return false
  }
  orgPreStep(scope, i) {
    this.checkImgDialog = true
    this.checkImgUrl = [scope.row.customerPapers[i].uploadUrl]
  }
  checkFile(row) {
    if(this.fileTypeCheck(row.fileName)){
      this.checkImgDialog = true
      this.checkImgUrl = row.fileUrl
    }
  }
  refresh(data) {
    this.attachDataSet = data
  }
}
</script>

<style lang="less" scoped>
.frame {
  padding: 10px;
}
.data-grid-title {
  line-height: 39px;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  color: #00bbca;
}
</style>
