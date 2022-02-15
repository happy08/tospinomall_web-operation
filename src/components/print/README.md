# @xingyuelongchen/vue3-print

支持 vue3 的打印插件

## 安装

```bash
npm i @xingyuelongchen/vue3-print --save
```

## 使用方式

#### 参数说明

```javascript
/* 参数：
 *      #id   Dom选择字符串
 *      或    参数对象
 *      { id:Dom对象，或者id字符串，不传参数打印整个窗口页面
 *       standard：文档类型,
 *       extraHead：head上的额外标签,
 *       extraCss：额外的css连接,
 *       popTitle：标题 }
 */
```

#### Global instruction 全局注册

```javascript
import Print from "@xingyuelongchen/vue3-print";
App.use(Print); // Vue3 注册插件
// Vue.use(Print);  // Vue2.x 注册插件

// 可直接在Dom上使用指令
<button v-print></button>

// or 组件内调用全局方法
this.$print()
```

#### Local instruction 局部调用

```javascript
import { DirPrint, Print } from "@xingyuelongchen/vue3-print";

// 注册指令
directives: {
  DirPrint,
}

// Dom上使用指令
<button v-print></button>

// or 直接调用 Print 方法
Print()
```

## Run demo

```

npm install
npm run serve
-Local: http://localhost:8080/

```

You can also pass in an object type `Objcet`

### API

- `id`: \*requisite Partial printing of the incoming ID
- `standard`: Document type, default is html5, optional `html5`, `loose`, `strict`
- `extraHead`: Additional tags attached to the head tag, separated by commas
- `extraCss`: Additional link connections, separated by commas
- `popTitle`: Title shows the title
- `endCallback()`: Callback events after printing

```

```
