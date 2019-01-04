<template>
  <section class="component attach-info">
    <el-col class="frame">
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="jinjiancailiao"></svg-icon>
        <span>进件材料</span>
      </div>
      <data-box :data="attachDataSet.inputFile">
        <template slot="columns">
          <el-table-column prop="name" label="材料名称" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileName" label="文件名称" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-col class="item" v-for="(v,i) in scope.row.customerPapers" :key="i">
                <el-button v-if="fileTypeCheck(v.pictureName)" @click="orgPreStep(scope,i)" type="text" size="small">{{v.pictureName}}</el-button>
                <span v-else>{{v.pictureName}}</span>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column prop="uploadDate" label="上传时间" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operatorName" label="操作人" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="下载" label="操作" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <el-col class="item" v-for="(v,i) in scope.row.customerPapers" :key="i">
                <el-button v-show="scope.row.filePath" @click="downloadFile(scope.row.filePath,scope.row.fileName)" type="text" size="small">下载</el-button>
              </el-col>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="xianshanghetongxiazai"></svg-icon>
        <span>线上合同下载</span>
      </div>
      <data-box :data="attachDataSet.olContract">
        <template slot="columns">
          <el-table-column prop="contractNum" label="合同编号" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="fileName" label="文件名称" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-col class="item" v-for="(v,i) in scope.row.customerPapers" :key="i">
                <el-button v-if="fileTypeCheck(scope.row.fileName)" @click="checkFile(scope.row.filePath)" type="text" size="small">{{scope.row.fileName}}</el-button>
                <span v-else>{{scope.row.fileName}}</span>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column prop="uploadTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="下载" label="操作" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <el-col class="item" v-for="(v,i) in scope.row.customerPapers" :key="i">
                <el-button v-show="scope.row.filePath" @click="downloadFile(scope.row.filePath,scope.row.fileName)" type="text" size="small">下载</el-button>
              </el-col>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="qianyuehetongxiazai"></svg-icon>
        <span>签约合同下载</span>
      </div>
      <data-box :data="attachDataSet.signContract">
        <template slot="columns">
          <el-table-column prop="fileName" label="文件名称" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button v-if="fileTypeCheck(scope.row.fileName)" @click="checkFile(scope.row.filePath)" type="text" size="small">{{scope.row.fileName}}</el-button>
              <span v-else>{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="uploadTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operator" label="操作人" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="下载" label="操作" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <el-button v-show="scope.row.filePath" @click="downloadFile(scope.row.filePath,scope.row.fileName)" type="text" size="small">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="buchongcailiao"></svg-icon>
        <span>补充材料</span>
      </div>
      <data-box :data="attachDataSet.supply">
        <template slot="columns">
          <el-table-column prop="fileName" label="文件名称" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button v-if="fileTypeCheck(scope.row.fileName)" @click="checkFile(scope.row.filePath)" type="text" size="small">{{scope.row.fileName}}</el-button>
              <span v-else>{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="uploadTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="operator" label="操作人" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="下载" label="操作" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <el-button v-show="scope.row.filePath" @click="downloadFile(scope.row.filePath,scope.row.fileName)" type="text" size="small">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="qitaxinxi"></svg-icon>
        <span>其他材料</span>
      </div>
      <data-box :data="attachDataSet.other">
        <template slot="columns">
          <el-table-column prop="fileName" label="文件名称" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-button v-if="fileTypeCheck(scope.row.fileName)" @click="checkFile(scope.row.fileUrl)" type="text" size="small">{{scope.row.fileName}}</el-button>
              <span v-else>{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operatorTime" label="上传时间" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{scope.row.operatorTime|dateTimeFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="操作人" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="下载" label="操作" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <el-button v-show="scope.row.fileUrl" @click="downloadFile(scope.row.fileUrl)" type="text" size="small">下载</el-button>
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
import app from "~/config/app.config";
@Component({
  components: {
    DataBox,
    SvgIcon
  }
})
export default class AttachInfo extends Vue {
  private attachDataSet = {
    olContract: [], // 线上合同
    inputFile: [], // 进件材料
    signContract: [], // 签约合同
    supply: [], // 材料补充
    other: [] // 其他材料
  }
  private type:any =  ''

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
  checkFile(url) {
    this.checkImgDialog = true
    this.checkImgUrl = [url]
  }
  refresh(data) {
    this.attachDataSet.other = data
    // this.type = attach.type
    // this.items = {
    //   olContract: [], // 线上合同
    //   inputFile: [], // 进件材料
    //   signContract: [], // 签约合同
    //   supply: [], // 材料补充
    //   other: [] // 其他材料
    // }
    // if (attach.type === 'IMPORT') {
    //   this.importSend(attach)
    // } else {
    //   this.ortherSend(attach)
    // }
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
