<template>
  <div id="app">
    <div id="printMe" style="background: #f60">
      <p>葫芦娃，葫芦娃</p>
      <p style="background: red">一根藤上七朵花</p>
      <p>小小树藤是我家 啦啦啦啦</p>
      <p>叮当当咚咚当当 浇不大</p>
      <p>叮当当咚咚当当 是我家</p>
      <p>啦啦啦啦</p>
      <p>...</p>
    </div>
    <p>这里没在范围内，不会打印</p>
    <p>指令方式：</p>
    <p>
      <button v-print="printObj">传入对象</button>
      <button v-print="'#printMe'">传入字符串</button>
    </p>
    <p>函数调用：</p>
    <p>
      <button @click="handlerObject">传入对象</button>
      <button @click="handlerString">传入字符串</button>
    </p>
  </div>
</template> 
<script>
import { DirPrint, Print } from "../print";
export default {
  name: "app",
  data() {
    return {
      printObj: {
        id: "#printMe", // 这里可以是dom对象
        popTitle: "good print",
        extraCss: "https://www.baidu.com/,https://www.baidu.com/",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
    };
  },
  directives: { DirPrint },
  methods: {
    handlerObject() {
      Print(this.printObj);
    },
    handlerString() {
      Print("#printMe");
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
