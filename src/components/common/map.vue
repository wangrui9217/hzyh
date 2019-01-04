<template>
  <section class="map component">
    <el-amap vid="amap" :zoom="zoom" :center="center" class="amap">
      <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :events="marker.events"></el-amap-marker>
    </el-amap>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {
    Prop
  } from "vue-property-decorator";

  @Component({
    components: {}
  })
  export default class Map extends Vue {
    @Prop({
      default: 4
    }) zoom: number;
    @Prop() center: any;
    @Prop({
      default: () => []
    }) markers
  }

</script>

<style lang="less" scoped>
  .map.component {
    height: 600px;
  }

</style>
