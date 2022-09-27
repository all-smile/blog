---
title: 通过vNode实现给列表字段打标签
tags:
  - vNode
  - JSX
categories:
  - Vue
description: 怎么实现给列表数据的特定字段打不同类型的标签？看我是怎么使用JSX做到的(￣▽￣)"
abbrlink: 1525901815
date: 2022-09-23 10:14:48
---
## 问题

如何给列表数据打标签？类似下面这种样子👇

![](https://pic.imgdb.cn/item/632d17c616f2c2beb116edbb.jpg)

## 思路

1. 数模转化（对接口请求回来的数据进行过滤标记，返回新的数据）
2. 渲染新的数据模型

## 实现

### 1、过滤数据，需要打标签的采用`jsx`写法

业务数据的处理我封装在 `mixins` 里面

```javascript
// 存放全局的mixin， 可拆分到模块独享

import { mapGetters } from 'vuex'
import { fetchListData } from '@/api/global/api.js'
export default {
  data() {
    return {
      p_category: [],
      listdata: [],
      p_total: 0,
      p_loading: false,
    }
  },
  computed: {
    // ...mapGetters(['productLevel', 'productLevelInfo']),
    p_listdata() {
      const data = this.listdata;
      data.forEach((item) => {
        // ...
        // jsx 方式，打标签
        if (item.status === 2 || item.status === 3) {
          item.status = <span style={{color: '#999'}}>停售</span>
        } else {
          item.status = item.status
        }
        if (item.age <= 25) {
          item.age = <span class="badge_info">{item.age}</span>
        }
        if (item.sex === 'Man') {
          item.sex = <span class="badge_default">{item.sex}</span>
        }
      })
      return data;
    }
  },
  methods: {
    async getProductList(params = {}) {
      try {
        this.p_loading = true
        this.listdata = []
        const res = await fetchListData(params)
        if (res.code === 0) {
          const { data = [], total = 0 } = res || {}
          if (Array.isArray(data)) {
            this.listdata = [...data]
            this.p_total = total
          } else {
            this.listdata = []
            this.p_total = 0
          }
        } else {
          this.listdata = []
          this.p_total = 0
          this.$message.error(res.message || '出错了')
        }
        this.p_loading = false;
      } catch (err) {
        this.p_loading = false
        this.listdata = []
        this.p_total = 0
        console.log(err);
      }
    }
  }
}

```

#### `base.less` 定义标签样式

```less
.badge_info {
  color: #4760f0;
  background: #1C84C6;
  padding: 5px 8px;
  color: #fff;
  border-radius: 5px;
}

.badge_default {
  color: #4760f0;
  background: #4760f0;
  padding: 5px 8px;
  color: #fff;
  border-radius: 5px;
}
```

### 2、封装列表渲染组件

```js
<template>
  <ul class="listV2">
    <li class="listV2_row-title">
      <span v-for="(col, index) in fieldList" :key="index" class="listV2_cell ellipsis" :name="col.fieldName">
        {{col.fieldLabel}}
      </span>
    </li>
    <!-- 行 -->
    <div v-if="tableData.length === 0" class="nodata">暂无数据</div>
    <li v-for="(row, index) in tableData" :key="index" class="listV2_row pointer" @click="rowClickToDetail(row)">
      <!-- 单元格-列 -->
      <span v-for="(col, index) in fieldList" :key="index" class="listV2_cell ellipsis" :name="col.fieldName">
        <RenderDom :vNode="row[col.fieldName] || '-'"></RenderDom>
      </span>
    </li>
  </ul>
</template>

<script>
  import RenderDom from "./renderDom";
  export default {
    name: 'TableList',
    props: {
      tableData: {
        type: Array,
        required: true,
      },
      fieldList: {
        type: Array,
        required: true,
      },
      align: {
        type: String,
        default: 'left',
      },
    },
    components: {
      RenderDom,
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {},
    updated() { },
    beforeDestroy() { },
  }
</script>

<style lang='less' rel='stylesheet/less' scoped>
  @import "./index.less";
</style>

```

### 3、封装渲染vNode的方法

```javascript
const renderDom = {
  props: {
    vNode: {
      type: [Array, String, Object,Number],
    },
  },
  render(h) {
    // jsx - vNode 直接返回，交给框架处理（js语法带来很多可能，列表打标签功能）
    if (typeof this.vNode === 'object') {
      return this.vNode;
    }
    // 普通数据，直接包一层div，然后返回给页面
    return h(
      'div',
      {
        class: 'ellipsis',
      },
      this.vNode
    )
  }
}
```

### 4、页面组件调用

```js
<template>
  <div class="customer">
    <table-list v-loading="p_loading" :tableData="p_listdata" :fieldList="fieldList"></table-list>
  </div>
</template>

<script>
  import TableList from '@/basecomponents/TableList/index'
  import $_pMixins from "@/mixins/product.js";
  import enums from './enum.js'
  export default {
    name: 'Customer',
    props: {},
    components: {
      'table-list': TableList,
    },
    mixins: [$_pMixins],
    data() {
      return {
        tableData: [],
        fieldList: Object.freeze(enums.Enum_customerFieldList),
      }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.getProductList()
      }
    },
    updated() { },
    beforeDestroy() { },
  }
</script>

<style lang='less' rel='stylesheet/less' scoped>
  @import "./index.less";
</style>
```

## 效果展示

![](https://pic.imgdb.cn/item/632d182616f2c2beb11753e7.jpg)

---

![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。主要致力于分享实用技术干货，希望可以给一小部分人一些微小帮助。

我排斥“新人迷茫，老人看戏”的现象，希望能和大家一起努力破局。营造一个良好的技术氛围，为了个人、为了我国的数字化转型、互联网物联网技术、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**