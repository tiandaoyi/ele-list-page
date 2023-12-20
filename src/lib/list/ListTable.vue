<template>
  <el-table
    v-loading="listLoading"
    :cell-style="
      tableOptions.cellStyle || { 'text-align': 'center', padding: '6px 0' }
    "
    :header-cell-style="tableOptions.headerStyle || headerStyle"
    :border="!tableOptions.isHiddenBorder"
    :data="tableList"
    :show-header="
      typeof tableOptions.showHeader === 'boolean'
        ? tableOptions.showHeader
        : true
    "
    style="width: 100%"
    :empty-text="
      $hxt_ele_list_page({ key: 'b0072e-ThereIsCurrentlyNoDataAvailable', desc: '暂无数据' })
    "
    :max-height="
      tableOptions.maxHeight
        ? tableOptions.maxHeight
        : tableOptions.isHiddenMaxHeight
        ? null
        : height
    "
    :height="tableOptions.isHiddenMaxHeight ? null : height"
    @selection-change="handleSelectionChange"
    :row-key="keepSelectKey || null"
    ref="el-table"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    class="ele-list-table"
    :show-summary="!!tableOptions.summaryMethod"
    :summary-method="
      typeof tableOptions.summaryMethod === 'function'
        ? tableOptions.summaryMethod
        : null
    "
    @header-dragend="transferHeaderDragend"
    @sort-change="
      ($event) =>
        typeof tableOptions.sortChange === 'function'
          ? tableOptions.sortChange($event)
          : null
    "
    :span-method="
      typeof tableOptions.spanMethod === 'function'
        ? tableOptions.spanMethod
        : null
    "
    @row-click="rowClick"
    :fit="typeof tableOptions.fit === 'boolean' ? tableOptions.fit : true"
    :row-class-name="
      typeof tableOptions.rowClassName === 'function'
        ? tableOptions.rowClassName
        : null
    "
  >
    <template #empty>
      <div v-if="tableOptions.defaultImage" style="display: flex;flex-direction: column;align-items: center;">
        <img
          style="max-width: 200px;height: auto;"
          :src="require('@/assets/empty.png')"
          :alt="
            $hxt_ele_list_page({
              key: 'b0072e-ThereIsCurrentlyNoDataAvailable',
              desc: '暂无数据',
            })
          "
        />
        <span>
          {{
            $hxt_ele_list_page({
              key: 'b0072e-ThereIsCurrentlyNoDataAvailable',
              desc: '暂无数据',
            })
          }}
        </span>
      </div>

      <slot name="table-empty" v-else></slot>
    </template>
    <!-- 多选 -->
    <el-table-column
      type="selection"
      width="55"
      v-if="reflashCol && !tableOptions.isHiddenCheckBox"
      :fixed="tableOptions.isHiddenFixed ? null : 'left'"
      :reserve-selection="isKeepSelect"
      :selectable="tableOptions.selectable"
    >
    </el-table-column>

    <!-- 序号 -->
    <el-table-column
      type="index"
      :label="$hxt_ele_list_page({ key: 'b0072e-Number', desc: '序号' })"
      width="70"
      :index="getIndex"
      :fixed="tableOptions.isHiddenFixed ? null : 'left'"
      v-if="reflashCol && !tableOptions.isHiddenOrder"
    >
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column
      v-if="
        reflashCol && headerHandleOperation && !tableOptions.isHiddenOperation
      "
      :prop="headerHandleOperation.prop"
      :label="headerHandleOperation.label"
      :width="headerHandleOperation.width || 120"
      :fixed="tableOptions.isHiddenFixed ? null : 'left'"
    >
      <template slot-scope="scope">
        <span
          :style="{
            padding:
              !operation.isHidden &&
              (!operation.getIsShow || operation.getIsShow(scope))
                ? '0 5px'
                : 'initial',
          }"
          v-for="operation in headerHandleOperation.operationOptions"
          :key="operation.index"
          size="mini"
          :type="operation.type"
          @click="
            !operation.disabled &&
              (tableOptions.canEdit !== false || operation.cancelStopEdit) &&
              operation.fn(scope)
          "
          :class="[
            (operation.disabled || tableOptions.canEdit === false) &&
            !operation.cancelStopEdit
              ? 'underline span-disabled-color'
              : 'underline',
            operation.class,
          ]"
          v-html="
            operation.asyncHtml && !operation.isHidden
              ? operation.asyncHtml(scope)
              : !operation.isHidden &&
                (!operation.getIsShow || operation.getIsShow(scope))
              ? operation.name
              : ''
          "
        >
        </span>
      </template>
    </el-table-column>

    <!-- switch操作列 -->
    <el-table-column
      v-if="tableOptions.switchCols && !tableOptions.switchCols.isHidden"
      :prop="headerHandleOperation.prop"
      :label="tableOptions.switchCols.title"
      :width="tableOptions.switchCols.width || 120"
      :fixed="tableOptions.isHiddenFixed ? null : 'left'"
    >
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row[tableOptions.switchCols.key]"
          :width="tableOptions.switchCols.switchWidth"
          :active-value="tableOptions.switchCols.activeValue"
          :inactive-value="tableOptions.switchCols.inactiveValue"
          :active-text="
            scope.row[tableOptions.switchCols.activeTextKey] ||
            tableOptions.switchCols.activeText
          "
          :disabled="
            tableOptions.switchCols.disabled ||
            scope.row[tableOptions.switchCols.disabledKey]
          "
          @change="
            tableOptions.switchCols.change &&
              tableOptions.switchCols.change($event, scope.row)
          "
          :inactive-text="tableOptions.switchCols.inactiveText"
        >
        </el-switch>
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
          :render-header="customFieldColumn"
          :width="
            item.width
              ? item.width
              : +!!item.required + item[label].length >= 5 &&
                !tableOptions.maxWidth
              ? (item[label].length + !!item.required) * 20
              : null
          "
          :show-overflow-tooltip="
            tableOptions.isShowEditTooltip && item.isShowEditColumnToolTip
          "
        >
          <!-- 自定义表头 -->
          <!-- <template slot="header">
            <span><span class="required-icon" v-if="item.required">*</span>{{item[label]}}</span>
          </template> -->
          <template slot-scope="scope">
            <!-- 不含表单 -->
            <template v-if="!tableOptions.formItemName">
              <!-- 下拉 -->
              <template v-if="item.editType === 'time'">
                <!-- <span class="required-icon" v-if="item.required">*</span> -->
                <el-date-picker
                  size="small"
                  v-model="scope.row[item[prop]]"
                  :type="item.timeType || 'daterange'"
                  range-separator="~"
                  :start-placeholder="
                    $hxt_ele_list_page({ key: 'b0072e-StartDate', desc: '开始日期' })
                  "
                  :end-placeholder="
                    $hxt_ele_list_page({ key: 'b0072e-EndDate', desc: '结束日期' })
                  "
                  :value-format="item.timeValueFormat || 'yyyy-MM-dd'"
                  :editable="false"
                  prefix-icon="date"
                  align="right"
                  unlink-panels
                  :picker-options="item.pickerOptions || pickerOptions"
                  @change="onChangeDate"
                  :default-time="item.defaultTime"
                  v-if="hackReset"
                  :disabled="item.disabled"
                >
                </el-date-picker>
              </template>

              <!-- 时间 -->
              <template v-else-if="item.editType === 'select'">
                <!-- <span class="required-icon" v-if="item.required">*</span> -->
                <el-select
                  v-model="scope.row[item[prop]]"
                  :multiple="item.multiple"
                  :clearable="false"
                  collapse-tags
                  :placeholder="''"
                  :disabled="
                    scope.row.$disabledField === item[prop] || item.editLimit
                  "
                  @change="
                    ($event) =>
                      item.editChange && item.editChange($event, scope)
                  "
                  size="small"
                  @focus="
                    () =>
                      item.editFocus &&
                      item.editFocus(scope.row[item[prop]], scope)
                  "
                  :filterable="item.editFilterable"
                >
                  <el-option
                    v-for="(editItem, index) of item.editOptions"
                    :key="index"
                    :label="editItem.text"
                    :value="editItem.value"
                  >
                  </el-option>
                </el-select>
              </template>

              <!-- 展示 -->
              <template v-else-if="item.editType === 'content'">
                <el-tooltip
                  :disabled="
                    item.tooltipKey
                      ? !scope.row[item.tooltipKey]
                      : !item.tooltip
                  "
                  effect="dark"
                  :content="item.tooltip"
                  placement="top"
                >
                  <span
                    :class="[
                      tableOptions.underlineHandles &&
                      tableOptions.underlineHandles[item[prop]]
                        ? 'underline'
                        : '',
                      item.textAlign ? 'span-max-width' : '',
                      item.class !== 'underline' ||
                      (item.class === 'underline' &&
                        (scope.row[item.underlineKey] ||
                          scope.row[item.underlineKey] === void 0))
                        ? item.class
                        : '',
                    ]"
                    @click="
                      ;(tableOptions.underlineHandles &&
                        tableOptions.underlineHandles[item[prop]] &&
                        tableOptions.underlineHandles[item[prop]](scope)) ||
                        (item.click && item.click(scope, auxInfo))
                    "
                    v-html="
                      item.asyncHtml
                        ? item.asyncHtml(scope.row[item[prop]], scope)
                        : !item.appendKey
                        ? scope.row[item[prop]]
                        : scope.row[item[prop]] + scope.row[item.appendKey]
                    "
                  >
                  </span>
                </el-tooltip>
              </template>

              <!-- 输入框 -->
              <template v-else>
                <!-- <span class="required-icon" v-if="item.required">*</span> -->
                <el-input
                  v-model="scope.row[item[prop]]"
                  :disabled="
                    scope.row.$disabledField === item[prop] || item.editLimit
                  "
                  :placeholder="item.editPlaceholder"
                  :step="item.editStep"
                  :type="item.editType || 'text'"
                  clearable
                  :readonly="!!item.editHover"
                  @focus="
                    ($event) =>
                      item.editHover &&
                      item.editHover(
                        scope.row[item[prop]],
                        scope.$index,
                        item.prop
                      )
                  "
                  :min="item.editMin"
                  size="small"
                  @change="
                    ($event) =>
                      item.editChange && item.editChange($event, scope)
                  "
                  @input="
                    ($event) => item.editInput && item.editInput($event, scope)
                  "
                  @blur="
                    ($event) => item.editBlur && item.editBlur($event, scope)
                  "
                >
                  <template slot="append" v-if="item.appendKey">{{
                    scope.row[item.appendKey]
                  }}</template>
                  <template slot="prepend" v-if="item.prependKey">{{
                    scope.row[item.prependKey]
                  }}</template>
                </el-input>
              </template>
            </template>
            <!-- 包含表单 -->
            <template v-if="tableOptions.formItemName">
              <!-- 包含表单 -->
              <el-form-item
                :prop="
                  tableOptions.formItemName +
                  '.' +
                  scope.$index +
                  '.' +
                  item.prop
                "
                style="maxwidth: 100%; marginbottom: 0"
                :label-width="item.formItemLabelWidth || ''"
                :rules="item.rulesFunc ? item.rulesFunc(scope.row) : item.rules"
                :show-message="
                  item.showMessageFunc ? item.showMessageFunc(scope) : true
                "
                :inline-message="
                  item.inlineMessageFunc ? item.inlineMessageFunc(scope) : false
                "
              >
                <!-- 时间 -->
                <template v-if="item.editType === 'time'">
                  <el-date-picker
                    size="small"
                    v-model="scope.row[item[prop]]"
                    :type="item.timeType || 'daterange'"
                    range-separator="~"
                    :start-placeholder="
                      $hxt_ele_list_page({ key: 'b0072e-StartDate', desc: '开始日期' })
                    "
                    :end-placeholder="
                      $hxt_ele_list_page({ key: 'b0072e-EndDate', desc: '结束日期' })
                    "
                    :value-format="item.timeValueFormat || 'yyyy-MM-dd'"
                    :editable="false"
                    prefix-icon="date"
                    align="right"
                    unlink-panels
                    :picker-options="item.pickerOptions || pickerOptions"
                    @change="onChangeDate"
                    :default-time="item.defaultTime"
                    v-if="hackReset"
                    :disabled="item.disabled"
                  >
                  </el-date-picker>
                </template>

                <!-- 下拉 -->
                <template v-else-if="item.editType === 'select'">
                  <el-select
                    v-model="scope.row[item[prop]]"
                    :multiple="item.multiple"
                    :clearable="false"
                    collapse-tags
                    :placeholder="''"
                    :disabled="
                      scope.row.$disabledField === item[prop] || item.editLimit
                    "
                    @change="
                      ($event) =>
                        item.editChange && item.editChange($event, scope)
                    "
                    size="small"
                    @focus="
                      () =>
                        item.editFocus &&
                        item.editFocus(scope.row[item[prop]], scope)
                    "
                    :filterable="item.editFilterable"
                  >
                    <el-option
                      v-for="(editItem, index) of item.editOptions"
                      :key="index"
                      :label="editItem.text"
                      :value="editItem.value"
                    >
                    </el-option>
                  </el-select>
                </template>

                <!-- 展示 -->
                <template v-else-if="item.editType === 'content'">
                  <el-tooltip
                    :disabled="
                      item.tooltipKey
                        ? !scope.row[item.tooltipKey]
                        : !item.tooltip
                    "
                    effect="dark"
                    :content="item.tooltip"
                    placement="top"
                  >
                    <span
                      :class="[
                        tableOptions.underlineHandles &&
                        tableOptions.underlineHandles[item[prop]]
                          ? 'underline'
                          : '',
                        item.textAlign ? 'span-max-width' : '',
                        item.class !== 'underline' ||
                        (item.class === 'underline' &&
                          (scope.row[item.underlineKey] ||
                            scope.row[item.underlineKey] === void 0))
                          ? item.class
                          : '',
                      ]"
                      @click="
                        ;(tableOptions.underlineHandles &&
                          tableOptions.underlineHandles[item[prop]] &&
                          tableOptions.underlineHandles[item[prop]](scope)) ||
                          (item.click && item.click(scope, auxInfo))
                      "
                      v-html="
                        item.asyncHtml
                          ? item.asyncHtml(scope.row[item[prop]], scope)
                          : !item.appendKey
                          ? scope.row[item[prop]]
                          : scope.row[item[prop]] + scope.row[item.appendKey]
                      "
                    >
                    </span>
                  </el-tooltip>
                </template>

                <!-- 输入框 -->
                <template v-else>
                  <el-input
                    v-model="scope.row[item[prop]]"
                    :disabled="
                      scope.row.$disabledField === item[prop] || item.editLimit
                    "
                    :placeholder="item.editPlaceholder"
                    :step="item.editStep"
                    :type="item.editType || 'text'"
                    clearable
                    :readonly="!!item.editHover"
                    :validate-event="!item.validateEvent"
                    @focus="
                      ($event) =>
                        item.editHover &&
                        item.editHover(
                          scope.row[item[prop]],
                          scope.$index,
                          item.prop
                        )
                    "
                    :min="item.editMin"
                    size="small"
                    @change="
                      ($event) =>
                        item.editChange && item.editChange($event, scope)
                    "
                    @input="
                      ($event) =>
                        item.editInput && item.editInput($event, scope)
                    "
                    @blur="
                      ($event) => item.editBlur && item.editBlur($event, scope)
                    "
                  >
                    <template slot="append" v-if="item.appendKey">{{
                      scope.row[item.appendKey]
                    }}</template>
                    <template slot="prepend" v-if="item.prependKey">{{
                      scope.row[item.prependKey]
                    }}</template>
                  </el-input>
                </template>
              </el-form-item>
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
          v-if="
            item.prop !== 'operation' &&
            !(item.hidden && item.hidden(item, index, auxInfo))
          "
          :prop="item[prop]"
          :label="item[label]"
          :width="
            item.width
              ? item.width
              : item[label].length >= 5 && !tableOptions.maxWidth
              ? item[label].length * 20
              : null
          "
          :show-overflow-tooltip="!tableOptions.isHiddenTooltip && !item.render"
          :fixed="item.fixed ? 'left' : null"
          :sortable="item.sortable"
          :column-key="item[prop]"
          :filters="
            item.isFilter
              ? formatFilter(removeDuplicate(tableList, item[prop]), item[prop])
              : null
          "
          :filter-method="item.isFilter ? filterHandler : null"
          :filter-placement="
            item.isFilter && item.filterPlacement ? item.filterPlacement : null
          "
          :min-width="item.minWidth ? item.minWidth : null"
        >
          <template
            :slot="item.renderHead ? 'header' : ''"
            slot-scope="scope"
            v-if="item.renderHead"
          >
            <el-popover placement="top" width="200" trigger="click">
              <el-input
                :placeholder="
                  $hxt_ele_list_page({
                    key: 'b0072e-PleaseEnterTheContent',
                    desc: '请输入内容',
                  })
                "
                v-model="item.renderHeadValue"
              ></el-input>
              <p>
                <span
                  class="hover-style"
                  @click="
                    item.renderHeadFn(
                      'search',
                      item.renderHeadValue,
                      item,
                      scope
                    )
                  "
                  >{{ $hxt_ele_list_page({ key: 'b0072e-Screen', desc: '筛选' }) }}</span
                >
                <span
                  class="hover-style"
                  @click="
                    item.renderHeadFn(
                      'reset',
                      item.renderHeadValue,
                      item,
                      scope
                    )
                  "
                  >{{ $hxt_ele_list_page({ key: 'b0072e-Reset', desc: '重置' }) }}</span
                >
              </p>
              <span slot="reference" style="cursor: pointer">
                {{ item[label] }}
                <i class="el-icon-search"></i>
              </span>
            </el-popover>
          </template>

          <template slot-scope="scope">
            <render-dom
              v-if="item.render && typeof item.render === 'function'"
              :scopeRow="scope.row"
              :item="item"
              :index="index"
              :render="item.render"
              :value="scope.row[item[prop]]"
            />

            <el-tooltip
              v-else
              :disabled="
                item.tooltipKey ? !scope.row[item.tooltipKey] : !item.tooltip
              "
              effect="dark"
              :content="item.tooltip"
              placement="top"
            >
              <span
                :style="{
                  textAlign:
                    item.editType !== 'select' && item.textAlign
                      ? item.textAlign
                      : '',
                }"
                :class="[
                  tableOptions.underlineHandles &&
                  tableOptions.underlineHandles[item[prop]]
                    ? 'underline'
                    : '',
                  item.textAlign ? 'span-max-width' : '',
                  item.class !== 'underline' ||
                  (item.class === 'underline' &&
                    (scope.row[item.underlineKey] ||
                      scope.row[item.underlineKey] === void 0))
                    ? item.class
                    : '',
                ]"
                @click="
                  ;(tableOptions.underlineHandles &&
                    tableOptions.underlineHandles[item[prop]] &&
                    tableOptions.underlineHandles[item[prop]](scope)) ||
                    (item.click && item.click(scope, auxInfo))
                "
                v-html="
                  item.asyncHtml
                    ? item.asyncHtml(scope.row[item[prop]], scope)
                    : item.editType === 'select'
                    ? find(
                        item.editOptions,
                        scope.row[item[prop]],
                        item.multiple
                      )
                    : getNormalContent(scope, item)
                "
              >
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </template>

    <slot :tableOptions="tableOptions"></slot>

    <!-- <span :class="item[prop] === 'itemCode' ? 'underline' : ''" >{{scope.row[item[prop]]}}</span> -->
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
import RenderDom from './RenderDom'
export default {
  name: 'ListTable',
  components: {
    RenderDom,
  },
  props: {
    //表格数据
    tableList: {
      type: Array,
    },
    //是否有多选框
    hasSelection: {
      type: Boolean,
      default: false,
    },
    //表头宽度拖动
    headerDragend: {
      type: Function,
      default: function () {},
    },
    //操作列按钮尺寸 以及表格展示尺寸
    size: {
      type: String,
      default: 'small',
    },
    //表格固定高度
    height: {
      type: [Number, String],
    },
    tableOptions: {
      type: Object,
      required: true,
    },
    listLoading: {
      type: Boolean,
    },
    handleSelectionChange: {
      type: Function,
      default: () => {},
    },
    rowClick: {
      type: Function,
      default: () => {},
    },
    isKeepSelect: {
      type: Boolean,
    },
    keepSelectKey: {
      type: String,
    },
    // 是否懒加载
    isLazyLoad: {
      type: Boolean,
      default: false,
    },
    // 辅助存储器
    auxInfo: {
      type: Object,
    },
    thousand: {
      type: [Array, String],
      default: () => [],
    },
  },
  data() {
    return {
      hackReset: true,
      reflashCol: true,
      screenHeight: 0,
      screenWidth: 0,
      pickerOptions: {
        onPick: ({ minDate, maxDate }) => {
          if (minDate && maxDate) {
            this.hackReset = false
            this.$nextTick(() => {
              this.hackReset = true
            })
          }
        },
        shortcuts: [
          {
            text: $hxt_ele_list_page({ key: 'b0072e-LastWeek', desc: '最近一周' }),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: $hxt_ele_list_page({ key: 'b0072e-LastMonth', desc: '最近一个月' }),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: $hxt_ele_list_page({ key: 'b0072e-LastThreeMonths', desc: '最近三个月' }),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
    }
  },
  methods: {
    getNormalContent(scope, item) {
      const field = item[this.prop]
      if (!item.appendKey) {
        if (
          (Array.isArray(this.thousand) && this.thousand.includes(field)) ||
          this.thousand === field
        ) {
          return this.getThousand(scope.row[field])
        }
        return scope.row[field]
      }
      return scope.row[field] + scope.row[item.appendKey]
    },
    getThousand(val, ignoreRadixPoint = true) {
      if (val === null || val === void 0) return ''
      val = String(val).replace(',', '')
      const index = val.indexOf('.')
      if (ignoreRadixPoint && index !== -1) {
        return (
          val.slice(0, index).replace(/\d(?=(?:\d{3})+(?:\.\d+|$))/g, '$&,') +
          val.slice(index)
        )
      } else {
        return val.replace(/\d(?=(?:\d{3})+(?:\.\d+|$))/g, '$&,')
      }
    },
    removeDuplicate(arr = [], prop = '') {
      const map = new Map()
      const ans = []
      arr.forEach((item) => {
        if (!map.has(item[prop])) {
          map.set(item[prop], true)
          ans.push(item)
        }
      })
      return ans
    },
    formatFilter(arr = [], prop = '') {
      return arr.map((item) => {
        return {
          text: item[prop],
          value: item[prop],
        }
      })
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    transferHeaderDragend(...args) {
      this.headerDragend(...args)
      this.$nextTick(() => {
        this.$refs['el-table']?.doLayout()
      })
    },
    onChangeDate(e) {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    // 自定义表头
    customFieldColumn(h, { column, $index }) {
      const currentItem = this.tableOptions?.columnsData?.showColumns?.find(
        (item) => item.prop === column.property
      )
      // 修改且列为必填时 增加必填
      return this.tableOptions?.canEdit && currentItem?.required
        ? [
            h(
              'span',
              {
                class: 'required-icon',
              },
              '*'
            ),
            currentItem?.label || '',
          ]
        : currentItem?.label || ''
    },
    headerStyle({ rowIndex, columnIndex, row, column }) {
      return {
        background: '#EEEFF3',
        'text-align': 'center',
        color: '#505050',
        'font-size': '14px',
      }
    },
    getIndex(val) {
      return val + 1
    },
    find(options, value, multiple = false) {
      if (!options || options.length === 0) {
        return value
      } else {
        //  如果为多选且数组
        if (multiple && value && Array.isArray(value)) {
          const result = []
          value.forEach((item) => {
            if (
              options.find((childItem) => childItem.value === item) !== void 0
            ) {
              result.push(item)
            }
          })
          return result.join()
        } else {
          return options.find((item) => item.value === value)?.text || value
        }
      }
    },
    doLayout() {
      this.$refs['el-table']?.doLayout()
    },
  },
  computed: {
    // 操作列
    headerHandleOperation() {
      return this.tableOptions.headerHandleOperation
    },
    prop() {
      // 接口返回的列的数据结构转表格所需的数据结构
      const tableOptions = this.tableOptions
      const prop =
        tableOptions && tableOptions.columnsMatchParams
          ? tableOptions.columnsMatchParams.prop
          : 'prop'
      return prop
    },
    label() {
      // 接口返回的列的数据结构转表格所需的数据结构
      const tableOptions = this.tableOptions
      const label =
        tableOptions && tableOptions.columnsMatchParams
          ? tableOptions.columnsMatchParams.label
          : 'label'
      return label
    },
    // 扩展列（暂时用不到）
    // extendColumns() {
    //   return [...this.$store.state.table.tableOptions.extendColumns || []];
    // }
  },
  mounted() {
    window.addEventListener('resize', () => {
      window.screenHeight = window.innerHeight
      this.screenHeight = window.screenHeight || 0

      window.screenWidth = window.innerWidth
      this.screenWidth = window.screenWidth || 0
    })
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
      immediate: true,
    },
    screenHeight: {
      handler(val) {
        if (this.$parent && !this.$parent.height) {
          // 直接使用<ListTable> 需先判断外层是否有该方法
          this.$parent?.setTableHeight?.()
        }
      },
      immediate: true,
    },
    screenWidth: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs['el-table']?.doLayout()
        })
      },
      immediate: true,
    },
    tableList: {
      handler(val) {
        // 解决表格左下角问题
        if (this.tableOptions.isUpdateTable) {
          this.$nextTick(() => {
            this.$refs['el-table']?.doLayout()
          })
        }
      },
      immediate: true,
    },
  },
}
</script>
