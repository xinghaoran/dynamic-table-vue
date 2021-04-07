<template>
  <a-config-provider :locale="locale">
    <div>
      <a-row style="margin-bottom: 15px" v-if="dynamicCol">
        <a-col :span="24">
          <span style="width: 30px">显示列：</span>
          <a-select
            mode="multiple"
            style="width: calc(100% - 90px)"
            :maxTagCount="11"
            v-model="selectColumnsCode"
            @change="SelectColChange"
          >
            <a-select-option v-for="i in columns" :key="i.dataIndex">{{
              i.title
            }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <slot
        v-if="haveHeader"
        name="header"
        :selectedRowKeys="selectedRowKeys"
        :onClearFilter="onClearFilter"
        :onClear="onClear"
        :onSelectTotal="onSelectTotal"
        :ExportExcel="ExportExcel"
        :ExportAllExcel="ExportAllExcel"
      >
        <a-alert style="margin-bottom: 5px" type="info" show-icon>
          <template slot="message">
            <span v-if="canCheck" style="margin-right: 12px">{{
              "当前已选择：" + selectedRowKeys.length + " 条"
            }}</span>
            <a style="margin-left: 24px; color: red" @click="onClearFilter"
              >清空筛选</a
            >
            <a
              v-if="canCheck && !singleCheck"
              style="margin-left: 24px"
              @click="onSelectTotal"
              >全选</a
            >
            <slot name="exportExcelSlot">
              <a-popconfirm
                @confirm="
                  () => {
                    ExportAllExcel(excelName);
                  }
                "
              >
                <a-icon
                  slot="icon"
                  type="question-circle-o"
                  style="color: green"
                />
                <template slot="title">
                  文件名：
                  <a-input
                    style="width: 70%"
                    v-model="excelName"
                    placeholder="默认'table'"
                  ></a-input>
                </template>
                <a style="float: right">全部导出Excel</a>
              </a-popconfirm>
              <a-popconfirm
                @confirm="
                  () => {
                    ExportExcel(excelName);
                  }
                "
              >
                <a-icon
                  slot="icon"
                  type="question-circle-o"
                  style="color: green"
                />
                <template slot="title">
                  文件名：
                  <a-input
                    style="width: 70%"
                    v-model="excelName"
                    placeholder="默认'table'"
                  ></a-input>
                </template>
                <a style="float: right; margin: 0px 20px"
                  >导出筛选数据到Excel</a
                >
              </a-popconfirm>
            </slot>
            <a
              v-if="selectedRowKeys.length > 0"
              style="margin-left: 24px; color: red"
              @click="onClear"
              >清空选择</a
            >
          </template>
        </a-alert>
      </slot>
      <a-spin :spinning="spinning">
        <a-table
          :id="id"
          :size="'small'"
          :columns="selectColumns"
          :data-source="tableData"
          :scroll="scroll"
          :rowKey="rowKey"
          :bordered="bordered"
          :row-selection="
            canCheck
              ? {
                  selectedRowKeys: selectedRowKeys,
                  onChange: onSelectChange,
                  onSelectAll: onSelectAll,
                }
              : null
          "
          :pagination="havePageInation ? pagination : false"
          @change="handleChange"
        >
          <span slot="number" slot-scope="text">{{ text | NumberFilter }}</span>
          <span slot="percentage" slot-scope="text">{{
            text | PercentageFilter
          }}</span>
          <span slot="boolvalue" slot-scope="text">{{
            text | BoolFilter
          }}</span>
          <template slot="action" slot-scope="record">
            <slot name="operating" :record="record">
              <a-button
                type="primary"
                @click="
                  () => {
                    $emit('edit-row', record);
                  }
                "
                >编辑</a-button
              >
              <a-popconfirm
                title="确认删除?"
                @confirm="
                  () => {
                    $emit('del-row', record);
                  }
                "
              >
                <a-button type="danger" style="margin-left: 5px">删除</a-button>
              </a-popconfirm>
            </slot>
          </template>
          <template slot="footer" v-if="showFooter">
            <a-table
              :showHeader="false"
              :size="'small'"
              :columns="totalSelectColumns"
              :data-source="totalCol"
              :rowKey="rowKey"
              :pagination="false"
            >
              <span slot="number" slot-scope="text">{{
                text | NumberFilter
              }}</span>
              <span slot="percentage" slot-scope="text">{{
                text | PercentageFilter
              }}</span>
              <span slot="boolvalue" slot-scope="text">{{
                text | BoolFilter
              }}</span>
            </a-table>
          </template>
        </a-table>
      </a-spin>
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import {
  ConfigProvider,
  Button,
  Alert,
  Popconfirm,
  Icon,
  Input,
  Spin,
  Table,
} from "ant-design-vue";
import Vue from "vue";
import "ant-design-vue/dist/antd.css";
Vue.use(ConfigProvider);
Vue.use(Button);
Vue.use(Alert);
Vue.use(Popconfirm);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Spin);
Vue.use(Table);
export default {
  name: "VueAntdDynamicTable",
  data() {
    return {
      locale: zhCN,
      selectedRowKeys: [],
      allRwoKeys: [],
      selectColumnsCode: this.defaultSelectCol
        ? [...this.defaultSelectCol]
        : this.columns && this.columns.length > 0
        ? this.columns.map((a) => {
            return a.dataIndex;
          })
        : [],
      pagination: {
        defaultPageSize: 20,
        showTotal: (total) => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      filteredInfo: {},
      sortedInfo: {},
      excelName: "",
    };
  },
  filters: {
    NumberFilter(value) {
      if (isNaN(parseFloat(value))) return 0.0;
      return parseFloat(value).toFixed(2);
    },
    PercentageFilter(value) {
      if (isNaN(parseFloat(value))) return 0.0;
      return (parseFloat(value) * 100).toFixed(2) + "%";
    },
    BoolFilter(value) {
      if (value) return "是";
      return "否";
    },
  },
  props: {
    id: {
      type: String,
      default: "dynamictable",
    },
    columns: {
      type: Array,
      default: null,
    },
    dbData: {
      type: Array,
      default: null,
    },
    tableHeight: {
      type: Object,
      default: () => {
        return { y: 500 };
      },
    },
    rowKey: {
      type: String,
      default: "key",
    },
    singleCheck: {
      type: Boolean,
      default: false,
    },
    defaultSelectCol: {
      type: Array,
      default: null,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    dynamicCol: {
      type: Boolean,
      default: false,
    },
    spinning: {
      type: Boolean,
      default: false,
    },
    canCheck: {
      type: Boolean,
      default: true,
    },
    haveHeader: {
      type: Boolean,
      default: true,
    },
    showSum: {
      type: Boolean,
      default: false,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    havePageInation: {
      type: Boolean,
      default: true,
    },
    defaultSelectAll: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectColumns() {
      if (!this.columns || this.columns.length === 0) return [];
      const arr = [];
      const tempColumns = [];
      this.columns.forEach((v) => {
        tempColumns.push(Object.assign({}, v));
      });
      for (let i = 0; i < tempColumns.length; i++) {
        const v = tempColumns[i];
        if (v.filter) {
          v["filters"] = [
            ...new Set(
              this.tableData
                .filter((a) => {
                  if (a[v.dataIndex]) return a;
                })
                .map((a) => a[v.dataIndex])
            ),
          ].map((x) => {
            if (x) return { text: x, value: x };
          });
          v["filteredValue"] = this.filteredInfo[v.dataIndex] || [];
        }
        if (v.sort) {
          if (!v.sorter) {
            v["sorter"] = (a, b) => {
              return typeof (a[v.dataIndex] + b[v.dataIndex]) === "string"
                ? a[v.dataIndex].localeCompare(b[v.dataIndex])
                : a[v.dataIndex] - b[v.dataIndex];
            };
          }
          v["sortOrder"] =
            this.sortedInfo.columnKey === v.dataIndex && this.sortedInfo.order;
        }
        if (this.selectColumnsCode.indexOf(v.dataIndex) !== -1) arr.push(v);
        if (v.unit) {
          v.title = this.columns[i].title + v.unit;
        }
      }

      // if (this.showSum) {
      //   arr.splice(1, 0, {
      //     title: '合计',
      //     dataIndex: 'totalRow',
      //     width: 180,
      //     align: 'center',
      //     sorter: (a, b) => a.totalRow - b.totalRow,
      //     sortOrder: this.sortedInfo.columnKey === 'totalRow' && this.sortedInfo.order,
      //     scopedSlots: { customRender: 'number' }
      //   })
      // }
      if (this.canEdit) {
        arr.push({
          title: "操作",
          key: "operation",
          fixed: "right",
          width: 200,
          align: "center",
          scopedSlots: { customRender: "action" },
        });
      }
      return arr;
    },
    totalSelectColumns() {
      let newColumns = [];
      if (this.selectColumns.length > 0) {
        newColumns = JSON.parse(JSON.stringify(this.selectColumns));
        newColumns.forEach((n) => {
          n.width += 50;
        });
        newColumns.splice(0, 0, {
          title: "",
          width: 70,
        });
        // newColumns[0].width += 70
      }
      return newColumns;
    },
    tableData() {
      if (!this.dbData || this.dbData.length === 0) return [];
      // let filterData = [...this.dbData]
      let filterData = JSON.parse(JSON.stringify(this.dbData));
      if (this.filteredInfo) {
        Object.keys(this.filteredInfo).forEach((key) => {
          if (this.filteredInfo[key] && this.filteredInfo[key].length > 0) {
            filterData = filterData.filter(
              (a) => this.filteredInfo[key].indexOf(a[key]) !== -1
            );
          }
        });
      }
      // if (this.showSum) {
      //   const this_ = this
      //   filterData.forEach(d => {
      //     let totalRow = 0
      //     for (let i = 1; i < this_.columns.length; i++) {
      //       totalRow += d[this_.columns[i].dataIndex]
      //     }
      //     d.totalRow = totalRow
      //   })
      // }
      filterData.forEach((element, index) => {
        element["key"] = index;
      });
      return filterData;
    },
    tableWidth() {
      if (!this.selectColumns || this.selectColumns.length === 0)
        return { x: "1000px" };
      const width = this.selectColumns
        .map((a) => a.width)
        .reduce((prev, next) => prev + next);
      return { x: width + "px" };
    },
    scroll() {
      const obj = Object.assign(this.tableHeight, this.tableWidth);
      return obj;
    },
    totalCol() {
      const totalData = {};
      if (this.tableData.length > 0 && this.selectColumns.length > 0) {
        let minus = 0;
        if (this.canEdit) {
          minus = 1;
        }
        const computeData = JSON.parse(JSON.stringify(this.tableData));
        totalData[this.selectColumns[0].dataIndex] = "合计";
        for (let i = 1; i < this.selectColumns.length - minus; i++) {
          let totalNum = 0;
          const filed = this.selectColumns[i].dataIndex;
          for (let j = 0; j < computeData.length; j++) {
            totalNum += computeData[j][filed];
          }
          totalData[filed] = totalNum;
          totalData.key1 = totalNum;
        }
      }
      return [totalData];
    },
    selectedRows() {
      return this.dbData.filter((a) => {
        if (this.selectedRowKeys.indexOf(a.key) > -1) return a;
      });
    },
  },
  watch: {
    dbData: {
      deep: false,
      handler() {
        this.selectedRowKeys = this.defaultSelectAll
          ? this.dbData.map((a) => a.key)
          : [];
        // this.selectedRows = this.defaultSelectAll ? this.dbData : []
      },
    },
    columns: {
      deep: true,
      handler() {
        if (!this.columns || this.columns.length === 0) return;
        this.selectColumnsCode = this.defaultSelectCol
          ? [...this.defaultSelectCol]
          : this.columns.map((a) => {
              return a.dataIndex;
            });
      },
    },
    defaultSelectCol: {
      deep: true,
      handler() {
        if (!this.columns || this.columns.length === 0) return;
        this.selectColumnsCode = this.defaultSelectCol
          ? [...this.defaultSelectCol]
          : this.columns.map((a) => {
              return a.dataIndex;
            });
      },
    },
    selectedRowKeys() {
      this.$emit(
        "checkChange",
        JSON.parse(JSON.stringify(this.selectedRowKeys)),
        JSON.parse(JSON.stringify(this.selectedRows))
      );
    },
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      if (this.singleCheck && selectedRowKeys.length > 0) {
        this.selectedRowKeys = [selectedRowKeys.pop()];
        // this.selectedRows = [selectedRows.pop()]
        return;
      }
      this.selectedRowKeys = selectedRowKeys;
      // this.selectedRows = selectedRows
    },
    onSelectAll(selected, selectedRows) {
      if (selected) {
        this.selectedRowKeys = selectedRows.map((a) => a.key);
        // this.selectedRows = selectedRows
        if (this.singleCheck && this.selectedRowKeys.length > 0) {
          this.selectedRowKeys = [this.selectedRowKeys[0]];
          // this.selectedRows = [this.selectedRows[0]]
        }
      } else {
        this.selectedRowKeys = [];
        // this.selectedRows = []
      }
    },
    onSelectTotal() {
      this.selectedRowKeys = this.tableData.map((a) => a.key);
      // this.selectedRows = this.tableData
    },
    onClear() {
      this.selectedRowKeys = [];
      // this.selectedRows = []
    },
    onClearFilter() {
      this.filteredInfo = {};
    },
    SelectColChange(value) {
      const arr = [];
      this.columns.forEach((v) => {
        if (value.indexOf(v.dataIndex) !== -1) arr.push(v.dataIndex);
      });
      this.selectColumnsCode = arr;
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    handleChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
    },
    ExportAllExcel(fileName) {
      import("@/utils/vendor/Export2Excel").then((excel) => {
        const tHeader = this.columns.map(
          (a) => a.title + (a.unit ? a.unit : "")
        );
        const filterVal = this.columns.map((a) => a.dataIndex);
        const list = this.dbData;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName || "table",
          autoWidth: true,
          bookType: "xlsx",
        });
      });
    },
    ExportExcel(fileName) {
      const this_ = this;
      import("@/utils/vendor/Export2Excel").then((excel) => {
        const tHeader = this_.columns.map(
          (a) => a.title + (a.unit ? a.unit : "")
        );
        const filterVal = this_.columns.map((a) => a.dataIndex);
        const list = this_.tableData;
        const data = this_.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName || "table",
          autoWidth: true,
          bookType: "xlsx",
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
  },
};
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
