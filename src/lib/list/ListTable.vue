<template>
  <el-table
    v-loading="listLoading"
    :cell-style="{'text-align':'center','padding': '6px 0'}"
    :header-cell-style="{background:'#F5F7FA','text-align':'center','font-size':'12px'}"
    border
    :data="tableList"
    style="width: 100%"
    :empty-text="'暂无数据'"
    :max-height="height"
    @selection-change="handleSelectionChange"
  >
    <!-- 多选 -->
    <el-table-column
      type="selection"
      width="55"
      v-if="!tableOptions.isHiddenCheckBox"
      >
    </el-table-column>

    <!-- 序号 -->
    <el-table-column
      type="index"
      label="序号"
      :index="getIndex"
      >
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column
      v-if="headerHandleOperation"
      :prop="headerHandleOperation.prop"
      :label="headerHandleOperation.label"
      :width="headerHandleOperation.width"
    > 
      <template slot-scope="scope">
        <span
          v-for="operation in headerHandleOperation.operationOptions"
          :key="operation.index"
          size="mini"
          :type="operation.type"
          @click="!operation.disabled && operation.fn(scope)"
          :class="operation.disabled ? 'underline span-disabled-color' : 'underline'"
        >
        {{operation.name}}
        </span>
      </template>
    </el-table-column>

    <!-- 常规列 -->
    <template v-for="(item, index) of tableOptions.columnsData.showColumns">
      <el-table-column
        :key="index"
        v-if="item.prop !== 'operation'"
        :prop="item[prop]"
        :label="item[label]"
        :width="item.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <!-- <span :class="item[prop] === 'itemCode' ? 'underline' : ''" >{{scope.row[item[prop]]}}</span> -->
          <span 
            :class="tableOptions.underlineHandles && tableOptions.underlineHandles[item[prop]] ? 'underline' : ''"
            @click="tableOptions.underlineHandles && tableOptions.underlineHandles[item[prop]] && tableOptions.underlineHandles[item[prop]](scope)"
          >
            {{scope.row[item[prop]]}}
          </span>
        </template>
      </el-table-column>
    </template>

    <!-- 扩展列 -->
    <!-- <template v-for="item of extendColumns">
      <el-table-column
        :key="item.index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <span :class="item.prop === 'itemCode' ? 'underline' : ''" >{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </template> -->

  </el-table>
</template>
<script>
  export default {
    name: 'ListTable',
    props: {
      //表格数据
      tableList: {
        type: Array,
      },
      //是否有多选框
      hasSelection: {
        type: Boolean,
        default: false
      },
      //表头宽度拖动
      headerDragend: {
        type: Function,
        default: function () {}
      },
      //操作列按钮尺寸 以及表格展示尺寸
      size: {
        type: String,
        default: 'small'
      },
      //表格固定高度
      height: {
        type: Number,
      },
      tableOptions: {
        type: Object,
        required: true
      },
      listLoading: {
        type: Boolean
      },
      handleSelectionChange: {
        type: Function
      }
    },
    data() {
      return {}
    },
    methods: {
      getIndex(val) {
        return val + 1;
      },
      con(a) {
        // test
        console.log(a);
      },
    },
    computed: {
      // 操作列
      headerHandleOperation() {
        return this.tableOptions.headerHandleOperation;
      },
      prop() {
        // 接口返回的列的数据结构转表格所需的数据结构
        const tableOptions = this.tableOptions;
        const prop = tableOptions && tableOptions.columnsMatchParams ? tableOptions.columnsMatchParams.prop : 'prop';
        return prop;
      },
      label() {
        // 接口返回的列的数据结构转表格所需的数据结构
        const tableOptions = this.tableOptions;
        const label = tableOptions && tableOptions.columnsMatchParams ? tableOptions.columnsMatchParams.label : 'label';
        return label;
      },
      // 扩展列（暂时用不到）
      // extendColumns() {
      //   return [...this.$store.state.table.tableOptions.extendColumns || []];
      // }
    }
  }

</script>
<style lang="scss" scoped>
  .underline {
    color: #409EFF;
    // text-decoration: underline;
    cursor: pointer;
  }
  .el-table .span-disabled-color {
    cursor: no-drop;
    color: #c8c9cc;
  }

</style>
