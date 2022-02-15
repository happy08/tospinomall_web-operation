import { directivePrint, funcPrint } from './packages/print.js';
/**
 * 函数调用打印
 * 
 * @param {Object} obj {id:dom对象或id, standard：文档类型,extraHead：head上的额外标签,extraCss：额外的css连接,popTitle：标题}
 * 
 */
export const Print = funcPrint();
export const DirPrint = directivePrint();
export default {
  install(App) {
    App.directive('print', DirPrint);
    if (/^3/.test(App.version)) App.config.globalProperties.$print = funcPrint();
    if (/^2/.test(App.version)) App.prototype.$print = Print
  }
};