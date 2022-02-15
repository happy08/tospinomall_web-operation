import Print from './printarea.js';
function func(el, binding) {
  let obj = {};
  let localPrint = funcPrint();
  el.addEventListener('click', () => {
    if (typeof binding.value === 'string') {
      obj = { id: binding.value };
    } else if (typeof binding.value === 'object' && !!binding.value.id) {
      if (typeof binding.value.id === 'string') {
        obj = binding.value;
        // let ids = id.id.replace(new RegExp("#", "g"), '');
        let elsdom = document.querySelector(obj.id);
        if (!elsdom) console.log("id in Error"), obj = {};
      } else if (typeof binding.value.id === 'object') {
        obj = binding.value
      }
    }
    if (obj.id) localPrint(obj);// 局部打印
    else window.print(); // 直接全局打印

  });
}

export const funcPrint = () => {
  let close = true;
  return function (obj) {
    if (typeof obj === 'object') {
      var { id, standard, extraHead, extraCss, popTitle, endCallback } = obj;
    }
    if (close) {
      close = false
      new Print({
        ids: id || obj, // * 局部打印必传入id
        standard: standard || '', // 文档类型，默认是html5，可选 html5，loose，strict
        extraHead: extraHead || '', // 附加在head标签上的额外标签,使用逗号分隔
        extraCss: extraCss || '', // 额外的css连接，多个逗号分开
        popTitle: popTitle || '', // title的标题
        endCallback() { // 调用打印之后的回调事件
          if (typeof endCallback === 'function') endCallback()
          close = true;
        }
      })
    }
  }
}
export const directivePrint = () => ({
  directiveName: 'print',
  mounted(el, binding) {
    func(el, binding)
  },
  inserted(el, binding) {
    func(el, binding)
  }
});
