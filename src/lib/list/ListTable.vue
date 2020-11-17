<template>
  <el-table
    v-loading="listLoading"
    :cell-style="{'text-align':'center','padding': '6px 0'}"
    :header-cell-style="tableOptions.headerStyle || headerStyle"
    border
    :data="tableList"
    style="width: 100%"
    :empty-text="'暂无数据'"
    :max-height="tableOptions.isHiddenMaxHeight ? null : height"
    :height="tableOptions.isHiddenMaxHeight ? null : height"
    @selection-change="handleSelectionChange"
    :row-key="keepSelectKey || null"
    ref="el-table"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    class="ele-list-table"
  >
    <!-- <el-table-column
      prop="date"
      label="日期"
      sortable
      width="180">
    </el-table-column> -->
    <!-- 多选 -->
    <el-table-column
      type="selection"
      width="55"
      v-if="reflashCol && !tableOptions.isHiddenCheckBox"
      :fixed="tableOptions.isHiddenFixed ? null : 'left'"
      :reserve-selection="isKeepSelect"
      >
    </el-table-column>

    <!-- 序号 -->
    <el-table-column
      type="index"
      label="序号"
      width="70"
      :index="getIndex"
      :fixed="tableOptions.isHiddenFixed ? null : 'left'"
      v-if="reflashCol && !tableOptions.isHiddenOrder"
      >
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column
      v-if="reflashCol && headerHandleOperation && !tableOptions.isHiddenOperation "
      :prop="headerHandleOperation.prop"
      :label="headerHandleOperation.label"
      :width="headerHandleOperation.width || 120"
      :fixed="tableOptions.isHiddenFixed ? null : 'left'"
    > 
      <template slot-scope="scope">
        <span
          :style="{padding: !operation.isHidden ? '0 5px' : 'initial'}"
          v-for="operation in headerHandleOperation.operationOptions"
          :key="operation.index"
          size="mini"
          :type="operation.type"
          @click="!operation.disabled && (tableOptions.canEdit !== false || operation.cancelStopEdit) && operation.fn(scope)"
          :class="(operation.disabled || tableOptions.canEdit === false) && (!operation.cancelStopEdit) ? 'underline span-disabled-color' : 'underline'"
          v-html="operation.asyncHtml && !operation.isHidden ? operation.asyncHtml(scope) : (!operation.isHidden ? operation.name : '')"
        >
          {{operation.name}}
        </span>
      </template>
    </el-table-column>

    <template v-if="tableOptions.canEdit">
      <!-- 可修改常规列 -->
      <template v-for="(item, index) of tableOptions.columnsData.showColumns">
        <el-table-column
          :key="index"
          v-if="item.prop !== 'operation'"
          :prop="item[prop]"
          :label="item[label]"
          :width="item.width  ? item.width : (item[label].length >= 5) ? item[label].length * 20 : null"
        >
          <template slot-scope="scope">
            <template v-if="item.editType === 'select'">
              <span class="required-icon" v-if="item.required">*</span>
              <el-select
                v-model="scope.row[item[prop]]"
                :multiple="item.multiple"
                :clearable="false"
                collapse-tags
                :placeholder="''"
                :disabled="scope.row.$disabledField === item[prop] || item.editLimit"
                @change="($event) => item.editChange && item.editChange($event, scope)"
                size="small"
                @focus="() => item.editFocus && item.editFocus(scope.row[item[prop]], scope)"
                :filterable="item.editFilterable"
                >
                <el-option
                  v-for="(editItem, index) of item.editOptions"
                  :key="index"
                  :label="editItem.text"
                  :value="editItem.value">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <span class="required-icon" v-if="item.required">*</span>
              <el-input
                v-model="scope.row[item[prop]]"
                :disabled="scope.row.$disabledField === item[prop] || item.editLimit"
                :placeholder="item.editPlaceholder"
                :step="item.editStep"
                :type="item.editType || 'text'"
                clearable
                :readonly="!!item.editHover"
                @focus="($event) => item.editHover && item.editHover(scope.row[item[prop]], scope.$index, item.prop)"
                :min="item.editMin"
                size="small"
              ></el-input>
            </template>
            
          </template>
        </el-table-column>
      </template>
    </template>

    <template v-else>
      <!-- 常规列 -->
      <template v-for="(item, index) of tableOptions.columnsData.showColumns">
        <el-table-column
          :key="index"
          v-if="item.prop !== 'operation'"
          :prop="item[prop]"
          :label="item[label]"
          :width="item.width  ? item.width : (item[label].length >= 5) && !tableOptions.maxWidth? item[label].length * 20 : null"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <!-- <span :class="item[prop] === 'itemCode' ? 'underline' : ''" >{{scope.row[item[prop]]}}</span> -->
            <span 
              :class="tableOptions.underlineHandles && tableOptions.underlineHandles[item[prop]] ? 'underline' : ''"
              @click="tableOptions.underlineHandles && tableOptions.underlineHandles[item[prop]] && tableOptions.underlineHandles[item[prop]](scope)"
            >
              {{item.editType === 'select' ? find(item.editOptions, scope.row[item[prop]]) : scope.row[item[prop]]}}
            </span>
          </template>
        </el-table-column>
      </template>
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
    },
    isKeepSelect: {
      type: Boolean
    },
    keepSelectKey: {
      type: String
    },
    // 是否懒加载
    isLazyLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reflashCol: true,
      screenHeight: 0,
      screenWidth: 0
    }
  },
  methods: {
    headerStyle({rowIndex,columnIndex,row,column}) {
      return {
        background:'#EEEFF3',
        'text-align':'center',
        'font-size':'12px',
        color: '#505050',
        'font-size': '14px',       
      }
    },
    getIndex(val) {
      return val + 1;
    },
    find(options, value) {
      if (!options || options.length === 0) {
        return value
      } else {
        return (options || []).find(item => item.value === value)?.text ||value
      }
    }
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
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight || 0;

        window.screenWidth = window.innerWidth
        this.screenWidth = window.screenWidth || 0;
      })()
    }
  },
  destroyed() {
    window.onresize = null
  },
  watch: {
    tableOptions: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs['el-table']?.doLayout()
        })
      },
      immediate: true
    },
    screenHeight: {
      handler(val) {
        if (this.$parent && !this.$parent.height) {
          this.$parent?.setTableHeight()
        }
      },
      immediate: true
    },
    screenWidth: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs['el-table']?.doLayout()
        })
      },
      immediate: true
    }
  }
}    

</script>
