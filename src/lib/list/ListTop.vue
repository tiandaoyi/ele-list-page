<template>
  <el-form
    :inline="true"
    :model="currentSearchForm"
    ref="searchForm"
    class="ele-list-top"
  >
    <div
      class="ele-list-top-left"
      v-if="searchList && searchList.length"
      :class="{ 'show-all-search': isShowAllSearch }"
    >
      <template v-for="(item, index) of searchList">
        <!--input输入框-->
        <el-form-item
          v-if="
            (index < showFieldCount ||
              (index > lessCount && isShowAllSearch)) &&
            (item.searchType === 'input' ||
              item.searchType === 'textarea' ||
              item.searchType === 'number')
          "
          :label="item.name"
          :prop="item.searchField"
          :key="index"
          :style="{ width: item.width }"
          :class="{ 'is-required': item.required }"
        >
          <template v-slot:label v-if="item.name">
            <slot name="label">
              <span v-tooltip="item.name"></span>
            </slot>
          </template>
          <el-input
            v-model="currentSearchForm[item.searchField]"
            :type="item.searchType"
            :placeholder="item.placeholder"
            size="small"
            :clearable="!item.callFunction"
            :readonly="!!item.callFunction"
            :disabled="item.disabled"
            @input="item.inputFunction && item.inputFunction($event)"
            @focus="
              ;(item.callFunction && item.callFunction()) ||
                (item.focusFunction && item.focusFunction())
            "
            @blur="item.blurFunction && item.blurFunction($event)"
            :autosize="item.autosize"
            :rows="item.rows"
            @keyup.enter.native="
              item.enterFunction && item.enterFunction($event)
            "
          >
          </el-input>
        </el-form-item>
        <!--input双输入框-->
        <template
          v-if="
            (index < showFieldCount ||
              (index > lessCount && isShowAllSearch)) &&
            item.searchType === 'doubleInput'
          "
        >
          <el-form-item
            :label="item.name"
            :prop="
              Array.isArray(item.searchField) && item.searchField.length
                ? item.searchField[0]
                : item.searchField
            "
            :key="index"
            :style="{ width: item.width }"
            :class="{ 'is-required': item.required }"
          >
            <template v-slot:label v-if="item.name">
              <slot name="label">
                <span v-tooltip="item.name"></span>
              </slot>
            </template>
            <div class="double-input-wrapper" style="display: flex">

              <el-input
                v-model="currentSearchForm[item.searchField[0]]"
                :type="item.searchType"
                :placeholder="item.placeholder"
                size="small"
                :clearable="!item.callFunction"
                :readonly="!!item.callFunction"
                @input="
                  item.startInputFunction && item.startInputFunction($event)
                "
              >
              </el-input>
              <el-input
                style="margin-left: 2px"
                v-model="currentSearchForm[item.searchField[1]]"
                :type="item.searchType"
                :placeholder="item.placeholder"
                size="small"
                :clearable="!item.callFunction"
                :readonly="!!item.callFunction"
                @input="item.endInputFunction && item.endInputFunction($event)"
              >
              </el-input>
            </div>
          </el-form-item>
        </template>
        <!--select下拉框-->
        <el-form-item
          :style="{ width: item.width }"
          v-if="
            (index < showFieldCount ||
              (index > lessCount && isShowAllSearch)) &&
            item.searchType === 'select'
          "
          :label="item.name"
          :key="index"
          :class="{ 'is-required': item.required }"
        >
          <template v-slot:label v-if="item.name">
            <slot name="label">
              <span v-tooltip="item.name"></span>
            </slot>
          </template>
          <el-select
            :collapse-tags="item.isMultiple"
            :multiple="item.isMultiple"
            v-model="currentSearchForm[item.searchField]"
            :placeholder="item.placeholder"
            :clearable="!item.isNoClearable"
            size="small"
            :filterable="item.isFilterable"
            :filter-method="item.filterMethod"
            :disabled="item.disabled"
            :remote="!!item.selectFetch"
            :remote-method="item.selectFetch"
            v-loadMore="item.loadMore"
            v-loadMoreInput="item.loadMoreInput"
            :popper-class="item.class"
            :popper-append-to-body="item.isCancelAppendBody"
            :reserve-keyword="item.reserveKeyword"
            @blur="item.clear && item.blur($event)"
            @clear="item.clear && item.clear()"
            @focus="item.focus && item.focus($event)"
            @change="item.change && item.change($event)"
            @visible-change="item.visibleChange && item.visibleChange($event)"
          >
            <el-option
              v-for="(selectOption, index) of item.selectList"
              :key="index"
              :label="selectOption.text"
              :value="selectOption.value"
              :disabled="selectOption.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--time时间选择器-->
        <el-form-item
          :style="{ width: item.width }"
          v-if="
            (index < showFieldCount ||
              (index > lessCount && isShowAllSearch)) &&
            item.searchType === 'time'
          "
          :label="item.name"
          :key="index"
          :class="{ 'is-required': item.required }"
        >
          <template v-slot:label v-if="item.name">
            <slot name="label">
              <span v-tooltip="item.name"></span>
            </slot>
          </template>
          <el-date-picker
            size="small"
            v-model="currentSearchForm[item.searchField]"
            :type="item.timeType"
            range-separator="~"
            :start-placeholder="
              $hxt_ele_list_page({ key: '3bd4ec-StartDate', desc: '开始日期' })
            "
            :end-placeholder="$hxt_ele_list_page({ key: '3bd4ec-EndDate', desc: '结束日期' })"
            :placeholder="item.placeholder"
            :value-format="item.timeValueFormat"
            :editable="false"
            prefix-icon="date"
            align="right"
            unlink-panels
            :picker-options="item.pickerOptions"
            @change="onChangeDate"
            :default-time="item.defaultTime"
            v-if="hackReset"
            :disabled="item.disabled"
            :clearable="!item.isNoClearable"
          >
          </el-date-picker>
        </el-form-item>
        <!--input复选框-->
        <el-form-item
          v-if="
            (index < showFieldCount ||
              (index > lessCount && isShowAllSearch)) &&
            item.searchType === 'switch'
          "
          :label="item.name"
          :prop="item.searchField"
          :key="index"
          :style="{ width: item.width }"
          :class="{ 'is-required': item.required }"
        >
          <template v-slot:label v-if="item.name">
            <slot name="label">
              <span v-tooltip="item.name"></span>
            </slot>
          </template>
          <el-switch v-model="currentSearchForm[item.searchField]"> </el-switch>
        </el-form-item>
        <!-- 级联选择 -->
        <el-form-item
          v-if="
            (index < showFieldCount ||
              (index > lessCount && isShowAllSearch)) &&
            item.searchType === 'cascader'
          "
          :label="item.name"
          :prop="item.searchField"
          :key="index"
          :style="{ width: item.width }"
          :class="{ 'is-required': item.required }"
        >
          <template v-slot:label v-if="item.name">
            <slot name="label">
              <span v-tooltip="item.name"></span>
            </slot>
          </template>
          <el-cascader
            v-model="currentSearchForm[item.searchField]"
            :options="item.selectList"
            :placeholder="item.placeholder"
            :size="item.size || 'small'"
            :props="item.props"
            :disabled="item.disabled"
            :clearable="item.clearable"
            @change="item.changeFunction && item.changeFunction()"
            :filterable="item.isFilterable"
            :collapse-tags="item.collapseTags"
          >
          </el-cascader>
        </el-form-item>
      </template>
    </div>
    <div
      class="ele-list-top-right"
      @click="onToggleSearchListClick()"
      v-if="searchList && searchList.length > showFieldCount"
    >
      {{
        !isShowAllSearch
          ? $hxt_ele_list_page({ key: '3bd4ec-More', desc: '更多' })
          : $hxt_ele_list_page({ key: '3bd4ec-Retract', desc: '收起' })
      }}
    </div>
  </el-form>
</template>
<script>
export default {
  props: {
    searchOptions: {
      type: Object,
    },
    searchForm: {
      type: Object,
    },
    onToggleSearchListClick: {
      type: Function,
    },
    isShowAllSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // currentSearchForm: this.searchForm,
      hackReset: true,
      rules: {},
      searchList: null,
      simplePickerOptions: {},
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
            text: $hxt_ele_list_page({ key: '3bd4ec-LastWeek', desc: '最近一周' }),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: $hxt_ele_list_page({ key: '3bd4ec-LastMonth', desc: '最近一个月' }),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: $hxt_ele_list_page({ key: '3bd4ec-LastThreeMonths', desc: '最近三个月' }),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      showFieldCount: 8,
    }
  },
  methods: {
    onChangeDate(e) {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
  },
  watch: {
    searchOptions: {
      handler(val) {
        const searchList = []
        let searchWrapperIndex = 0
        const SEARCH_TYPE_ENUM = {
          input: 'input',
          select: 'select',
          time: 'time',
          default: 'input',
          number: 'number',
          switch: 'switch',
          cascader: 'cascader',
          doubleInput: 'doubleInput',
          textarea: 'textarea',
        }
        const PLACEHOLDER_TYPE_ENUM = {
          input: $hxt_ele_list_page({ key: '3bd4ec-PleaseEnter', desc: '请输入' }),
          number: $hxt_ele_list_page({ key: '3bd4ec-PleaseEnter', desc: '请输入' }),
          select: $hxt_ele_list_page({ key: '3bd4ec-PleaseSelect', desc: '请选择' }),
          cascader: $hxt_ele_list_page({ key: '3bd4ec-PleaseSelect', desc: '请选择' }),
          undefined: $hxt_ele_list_page({ key: '3bd4ec-PleaseEnter', desc: '请输入' }),
        }
        const searchOptions = this.searchOptions
        if (
          searchOptions &&
          searchOptions.searchData &&
          searchOptions.searchData.length
        ) {
          searchOptions.searchData.forEach((item, index) => {
            if (item.name) {
              searchList.push({
                name: item.name || '',
                searchField: item.searchField || '',
                selectList: item.selectList || [], // selectList格式 [{text: '11',value: 11 } ]
                searchType:
                  SEARCH_TYPE_ENUM[item.searchType] ||
                  SEARCH_TYPE_ENUM['default'], // input select time 输入框 选择框 时间
                // valueType: item.valueType || 'string', // number boolean string
                value: item.value || item.value === 0 ? item.value : null,
                isFilterable: item.isFilterable || false, // 是否可搜索
                isNoClearable: item.isNoClearable || false,
                inputFunction: item.inputFunction,
                blurFunction: item.blurFunction,
                callFunction: item.callFunction,
                focusFunction: item.focusFunction,
                clearFunction: item.clearFunction,
                changeFunction: item.changeFunction,
                placeholder:
                  item.placeholder || PLACEHOLDER_TYPE_ENUM[item.searchType],
                width: item.width || '25%',
                isMultiple: item.isMultiple || false,
                disabled: item.disabled || false,
                timeType:
                  item.searchType === 'time'
                    ? item.timeType || 'daterange'
                    : null,
                // pickerOptions: item.searchType === 'time' ? item.timeType === 'datetime' ? this.simplePickerOptions : this.pickerOptions : null,
                pickerOptions:
                  item.searchType === 'time'
                    ? item.timeType === 'datetime'
                      ? this.simplePickerOptions
                      : item.pickerOptions || this.pickerOptions
                    : null,
                timeValueFormat:
                  item.searchType === 'time'
                    ? item.timeValueFormat || 'yyyy-MM-dd'
                    : null,
                defaultTime:
                  item.searchType === 'time' ? item.defaultTime : null,
                selectFetch: item.selectFetch || null,
                props: item.props || {},
                loadMore:
                  item.searchType === 'select' && item.loadMoreOptions?.loadMore
                    ? item.loadMoreOptions.loadMore
                    : null,
                loadMoreInput:
                  item.searchType === 'select' && item.loadMoreInput
                    ? item.loadMoreInput
                    : null,
                clearable: item.clearable,
                rows: item.rows,
                autosize: item.autosize,
                class: item.class,
                reserveKeyword: item.reserveKeyword,
                change: item.change,
                focus: item.focus,
                clear: item.clear,
                blur: item.blur,
                isCancelAppendBody: item.isCancelAppendBody || false,
                collapseTags: item.collapseTags || false,
                required: !!item.required,
                visibleChange: item.visibleChange,
                enterFunction: item.enterFunction,
                startInputFunction: item.startInputFunction,
                endInputFunction: item.endInputFunction,
                filterMethod: item.filterMethod,
              })
              // 数组切成每四个分隔(提供给前端样式显示)
              if (index % 4 === 3) {
                searchWrapperIndex++
              }
            }
          })
        }
        this.searchList = searchList
        this.showFieldCount = searchOptions.showFieldCount || 8
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    currentSearchForm: {
      get() {
        return this.searchForm
      },
      set(val) {
        this.$emit('update:searchForm', val)
      },
    },
    lessCount() {
      return this.showFieldCount - 1
    },
  },
}
</script>
