// 全局通信总线  任何组件直接的通信
import Vue from "vue"

export default new Vue()
 /**
  * 假设a组件要给b组件发送数据
  * 
  * b注册通信的事件
  * import globalBus from "@/utils/golbalBus"
  * globalBus.$emit('自定义事件名', data => {
  *    // 处理函数
  * })
  * 
  * a 发布通信事件
  * import globalBus from "@/utils/golbalBus"
  * globalBus.$on('自定义事件名', data)
  * 
  * 
  * 通讯的两端使用的事件名一样，否则无效
  */