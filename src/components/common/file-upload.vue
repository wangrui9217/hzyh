<template>
  <section class="component file-upload" :class="{'disable':disableUpload}">
    <el-upload :headers="headers" ref="upload" class="upload" multiple :before-upload="onBeforeUpload" :before-remove="onBeforeRemove" :file-list="fileList" :action="uploadUrl" :limit="fileNumberLimit?fileNumberLimit:null" :show-file-list="true" :on-success="onSucess" :on-progress="onProgress" :on-error="onError" :on-change="onChange" :on-remove="onRemove">
      <el-button  @click="clickHandle" :disabled="disabled">上传文件</el-button>
    </el-upload>
  </section>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch, Prop, Emit } from "vue-property-decorator";
import { State } from "vuex-class";
import { Dependencies } from "~/core/decorator";
import { NetService } from "~/utils/net.service";
import { fileService } from "~/config/server";
import app from "~/config/app.config";
import { Upload } from "element-ui";

@Component({
  components: {}
})
export default class FileUpload extends Vue {
  @State userToken;

  // 上传成功回调事件
  @Emit("onUploadSuccess")
  onUploadSucess(id, data) {}

  // 上传进度回调事件
  @Emit("onUploadProgress")
  onUploadProgress(id, percent) {}

  // 上传异常回调事件
  @Emit("onUploadError")
  onUploadError(id, error) {}

  // 更新文件列表
  @Emit("update:fileList")
  updateFileList(fileList) {}

  // 是否显示文件列表
  @Prop({ default: true })
  showFileList;

  //按钮禁用
  @Prop() disabled;
  // 允许的文件后缀类型
  @Prop({
    type: Array
  })
  AllowExtension;

  // 文件数量限制
  @Prop({
    default: false,
    type: [Boolean, Number]
  })
  fileNumberLimit;

  // 文件带下限制
  @Prop({
    default: 100,
    type: Number
  })
  fileSizeLimit;

  // 文件列表
  @Prop({
    default: () => [],
    type: Array
  })
  fileList;

  // 获取上传文件头部信息
  get headers() {
    return {
      "X-UserToken": this.userToken
    };
  }

  /**
   * 是否禁止上传
   */
  get disableUpload() {
    return this.fileNumberLimit
      ? this.fileList.length >= this.fileNumberLimit
      : false;
  }

  /**
   * 上传路径
   */
  get uploadUrl() {
    return [
      app.url.server,
      NetService.generateRequestUrl(
        fileService.fileUploadController.uploadFileGrid
      )
    ].join("/");
  }

  clickHandle(event) {
    if (this.disableUpload) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  /**
   * 上传成功回调
   */
  onSucess(data, { uid }) {
    this.onUploadSucess(uid, data);
  }

  /**
   * 上传进度回调
   */
  onProgress({ percent }, { uid }) {
  }

  /**
   * 错误信息回调
   */
  onError(err, file) {
    this.onUploadError(err, file);
  }

  /**
   * 文件上传状态改变回调
   */
  onChange(file, uploadFileList) {
    switch (file.status) {
      case "ready": {
        this.fileList.push({
          uid: file.uid,
          name: file.name,
          percentage: file.percentage,
          status: file.status
        });
        break;
      }
    }

    this.updateFileList(this.fileList);
  }

  /**
   * 删除处理
   */
  onRemove(file, fileList) {
    this.updateFileList(fileList);
  }

  /**
   * 删除预处理
   */
  onBeforeRemove(file, fileList) {
    if (file.percentage === 0) {
      let list = fileList.filter(x => x.uid !== file.uid);
      this.updateFileList(list);
      return false;
    }
    return this.$confirm("是否确定删除该文件?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
  }

  /**
   * 上传文件预处理
   * 上传文件大小限制
   */
  onBeforeUpload({ name, size, uid }) {
    if (this.AllowExtension && this.AllowExtension.length) {
      // 文件名异常
      if (name.toString().split(".") < 2) {
        this.$message(`文件格式错误`);
        return false;
      }

      let [extension] = name.split(".").slice(-1);
      if (!this.AllowExtension.includes(extension)) {
        this.$message(`文件格式不符合要求`);
        return false;
      }
    }
    // 限制上传文件大小
    if (this.fileSizeLimit * 1024 * 1024 < size) {
      this.$message(`文件${name}超过上传文件大小限制${this.fileSizeLimit}MB`);
      return false;
    }
  }

  reset() {
    let upload = <any>this.$refs["upload"];
    upload.clearFiles();
    this.updateFileList([]);
  }
}
</script>

<style lang="less">
.component.file-upload{
  .el-upload.el-upload--text{
    height:25px!important
  }
}

</style>
