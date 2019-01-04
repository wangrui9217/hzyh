import Vue from 'vue'

export default {
  install() {
    Vue.prototype.$reset = function(){
      // console.log(this['$data'])
      // console.log(this.$options)
      // // this['$data'] =  this.$options.data()
      // console.log(this.$options.data())
    }
  }
}
