---
title: element-ui 日期范围组件，时间跨度不能超过一年
date: 2023-05-10 12:43:34
tags:
  - element-ui
categories:
  - 前端
description: 日期范围的筛选，开始日期和结束日期不能超过1年（1年固定按365天计算），并且在选定一个时间的时候计算可选的日期范围，不在范围内的日期要置灰不可选中
---

## 需求
日期范围的筛选，开始日期和结束日期不能超过1年（1年固定按365天计算），并且在选定一个时间的时候计算可选的日期范围，不在范围内的日期要置灰不可选中。如下图：
![](https://pic2.imgdb.cn/item/645b216a0d2dde57772df748.jpg)
查看`element-ui`中`DatePicker`组件的`属性、事件、方法`，发现组件提供了`Picker Options`属性配置项
![](https://pic2.imgdb.cn/item/645b218a0d2dde57772e14fd.jpg)
使用`disabledDate`和`onPick`配置项

## 实现代码
这里有一个需要注意的点，可选择的日期范围是根据用户选择的第一个日期动态计算出来的，所以，我们应该吧Picker Options放到计算属性`computed`中返回。

下面展示我的日期范围筛选的基础控件代码（该控件集成在业务架构中，无关代码可自行忽略，可直接定位到`pickerOptions`部分）
```javascript
<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="controlForm"
    :label-width="itemData.labelWidth"
    :label-position="itemData.labelPosition"
  >
    <el-form-item
      :label="itemData.showLabel ? itemData.fieldLabel : ''"
      :prop="propName"
    >
      <el-date-picker
        :style="{ width: itemData.rightWidth }"
        v-model="controlForm.value"
        :format="itemData.format || 'yyyy-MM-dd'"
        :value-format="itemData.format || 'yyyyMMdd'"
        align="right"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        :readonly="isDisable"
        :editable="itemData.editable"
        :clearable="!itemData.required"
        @change="handleChange"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
import moment from "moment";
import { isObject, getWeekStartDate, getWeekEndDate } from '@/libs/utils'

export default {
  name: 'Control-RangeDate',
  props: {
    itemData: {
      type: Object,
      default: () => { }
    }
  },
  components: {},
  data() {
    return {
      isDisable: false,
      controlForm: {
        value: ''
      },
      rules: {
        value: [
          {
            required: true,
            message: `请选择${this.itemData.placeholder || this.itemData.fieldLabel}`,
            trigger: 'blur'
          }
        ]
      },
      pickTime: null
    }
  },
  computed: {
    propName() {
      let name = '';
      if (this.itemData.isNotNull === 1) {
        name = 'value'
      }
      return name
    },
    // pick-option 采用计算属性的方式
    pickerOptions() {
      let _this = this
      return {
        disabledDate(time) {
          if (_this.pickTime) {
            const curTime = moment(moment(_this.pickTime).format('YYYY-MM-DD')).valueOf();
            // pickTime 前后 365 天 && 不大于今天
            const start = new Date(curTime - 3600 * 1000 * 24 * 365)
            const end = new Date(curTime + 3600 * 1000 * 24 * 365)
            return time.getTime() > Date.now() || time.getTime() < start || time.getTime() > end
          }
          return time.getTime() > Date.now()
        },
        onPick({ maxDate, minDate }) {
          if (!maxDate) {
            _this.pickTime = minDate
          }
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date(new Date().setHours(0, 0, 0, 0)))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date(new Date().setHours(0, 0, 0, 0)) - 3600 * 1000 * 24 * 1)
              end.setTime(start.getTime() + (3600 * 1000 * 24 * 1 - 1))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start = getWeekStartDate(new Date())
              end = getWeekEndDate(new Date())
              end.setTime(end.getTime() + (3600 * 1000 * 24 * 1 - 1))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() + (3600 * 1000 * 24 * 7))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() + (3600 * 1000 * 24 * 30))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() + (3600 * 1000 * 24 * 90))
              picker.$emit('pick', [start, end])
            }
          },
        ]
      }
    }
  },
  watch: {
    itemData: {
      handler(newV) {
        this.isDisable = newV.readonly
      },
      deep: true,
      immediate: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    // 移除校验
    clearVerify() {
      this.$refs.form.clearValidate()
    },

    // 初始化带入值
    initVal(obj = {}) {
      this.clearVerify();
      if (isObject(obj)) {
        this.controlForm.value = obj[this.itemData.fieldName]
        this.itemData.controlData = obj[this.itemData.fieldName]
        // this.$emit('update:controlData', obj[this.itemData.fieldName])
      }
    },

    // 初始化默认值
    updata() {
      this.clearVerify()
      this.controlForm.value = this.itemData.defaultValue
      this.itemData.controlData = this.itemData.defaultValue
    },

    // 重置 - 恢复成默认值
    reset() {
      this.controlForm.value = this.itemData.defaultValue
      this.itemData.controlData = this.itemData.defaultValue
    },

    handleChange(val) {
      this.itemData.controlData = val
      this.$emit('update:controlData', val || '')
    },

    verifyForm() {
      let isPass = true
      this.$refs.form.validate((valid) => {
        if (!valid) {
          isPass = false
        }
      })
      return isPass
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
</style>

```

### 主要代码解析
```javascript
{
  disabledDate(time) {
    if (_this.pickTime) {
      const curTime = moment(moment(_this.pickTime).format('YYYY-MM-DD')).valueOf();
      // pickTime 前后 365 天 && 不大于今天
      const start = new Date(curTime - 3600 * 1000 * 24 * 365)
      const end = new Date(curTime + 3600 * 1000 * 24 * 365)
      return time.getTime() > Date.now() || time.getTime() < start || time.getTime() > end
    }
    return time.getTime() > Date.now()
  },
  onPick({ maxDate, minDate }) {
    if (!maxDate) {
      _this.pickTime = minDate
    }
  },
}
```
通过`onPick`回调函数可以拿到选中的日期`pickTime`，然后在`disabledDate`属性中计算并返回可选的日期范围，主要还是依赖`computed`的计算属性，依赖的`data`属性发生变化后会重新计算。

