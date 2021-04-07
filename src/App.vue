<template>
  <div id="app">
    <helloWorld></helloWorld>
    <vueAntdDynamicTable
      :columns="columns"
      :dbData="data"
      :tableHeight="{ y: 'calc(100vh - 310px)' }"
      :canEdit="true"
      :canCheck="true"
    ></vueAntdDynamicTable>
  </div>
</template>

<script>
import helloWorld from "@/../packages/helloWorld/index.js";
import vueAntdDynamicTable from "@/../packages/vueAntdDynamicTable/index.js";
export default {
  name: "App",
  components: {
    vueAntdDynamicTable,
    helloWorld
  },
  data() {
    return {
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
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
