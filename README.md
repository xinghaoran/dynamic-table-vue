# dynamic-table-vue

## 一、安装及引入

### 安装包
```
yarn add vue-antd-dynamic-table -s
```

### 项目中引入包
```
import VueAntdDynamicTable from 'vue-antd-dynamic-table'
```

### 注入Vue
```
Vue.use(VueAntdDynamicTable)
```

### 需要使用页面引入包
```
import { VueAntdDynamicTable } from "vue-antd-dynamic-table"
```

### 组件注册
```
component: { VueAntdDynamicTable }
```

## 二、使用

### 例子
```
<VueAntdDynamicTable
    :id="mytable"
    :columns="columns"
    :dbData="data"
    :tableHeight="{ y: 'calc(100vh - 310px)' }"
    :canEdit="true"
    :canCheck="true"
    :singleCheck="true"
>
</VueAntdDynamicTable>

columns: [
    {
        title: "节日",
        dataIndex: "festival",
        width: 180,
        align: "center",
        sort: true,
        filter: true,
    },
    {
        title: "时间",
        dataIndex: "time",
        width: 180,
        align: "center",
        sort: true,
        filter: false,
    },
    {
        title: "假期长度",
        dataIndex: "holidayLength",
        width: 180,
        align: "center",
        sort: true,
        filter: true,
    }
],
data: [
    {
        festival: "元旦",
        time: '2021-01-01',
        holidayLength: 3,
    },
    {
        festival: "春节",
        time: '2021-02-11',
        holidayLength: 7,
    },
    {
        festival: "清明",
        time: '2021-04-03',
        holidayLength: 3,
    },
    {
        festival: "劳动节",
        time: '2021-05-01',
        holidayLength: 5,
    },
    {
        festival: "端午",
        time: '2021-06-12',
        holidayLength: 3,
    },
    {
        festival: "中秋",
        time: '2021-09-19',
        holidayLength: 3,
    },
    {
        festival: "国庆",
        time: '2021-10-01',
        holidayLength: 7,
    }
]
```

### 参数
| 参数名 | 类型 | 默认值 | 作用 |
| :---- | :------: | :------: | :------: |
| id | String | 'dynamictable' | id |
| columns | Array | null | 表格列 |
| dbData | Array | null | 表格数据 |
| tableHeight | Object | { y: 500 } | 表格高度 |
| rowKey | String | 'key' | 备注 |
| singleCheck | Boolean | false | 是否为单选行 |
| defaultSelectCol | Array | null | 默认显示列 |
| canEdit | Boolean | false | 是否可编辑 |
| dynamicCol | Boolean | false | 是否为动态控制列 |
| spinning | Boolean | false | 加载是否显示等待 |
| canCheck | Boolean | true | 是否可选中 |
| haveHeader | Boolean | true | 是否显示选择列下拉框 |
| showSum | Boolean | false | 是否自动合计 |
| showFooter | Boolean | false | 是否显示页脚 |
| bordered | Boolean | false | 是否显示边框 |
| havePageInation | Boolean | true | 是否显示分页 |
| defaultSelectAll | Boolean | false | 默认选中全部 |
