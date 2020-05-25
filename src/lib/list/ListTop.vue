<template>
  <el-form :inline="true" :model="searchForm" ref="searchForm" class="top-form">
    <div class="top-form-left" v-if="searchList && searchList.length" :class="{'show-all-search': isShowAllSearch}">
      <div class="top-form-left__item" v-for="(parentItem, index) in searchList" :key="index">
        <template v-for="item in parentItem">
          <!--input输入框-->
          <el-form-item v-if="item.searchType === 'input'" :label="item.name" :prop="item.searchField" :key="item.index">
            <el-input
              v-model.trim="searchForm[item.searchField]"
              :type="item.searchType"
              :placeholder="item.placeholder"
              size="small"
              @focus="item.callFunction && item.callFunction()"
            >
            </el-input>
          </el-form-item>

          <!--select下拉框-->
          <el-form-item v-if="item.searchType === 'select'" :label="item.name" :key="item.index">
            <el-select v-model="searchForm[item.searchField]" :placeholder="item.placeholder" clearable size="small" :filterable="item.isFilterable">
              <el-option v-for="(selectOption,index) of item.selectList" :key="index" :label="selectOption.text" :value="selectOption.value"></el-option>
            </el-select>
          </el-form-item>

          <!--time时间选择器 @TODO-->
          <el-form-item v-if="item.searchType === 'time'" :label="item.name" :key="item.index">
            <div class="block">
              <el-date-picker
                v-model="searchForm[item.searchField]"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00']">
              </el-date-picker>
            </div>
          </el-form-item>
        </template>
      </div>
    </div>
    <div class="top-form-right" @click="onToggleSearchListClick()" v-if="searchList && searchList.length > 2">
      {{ !isShowAllSearch ? '查看全部' : '收起' }}
    </div>
  </el-form>
</template>

<script>
  export default {
    props: {
      searchOptions: {
        type: Object
      },
      searchForm: {
        type: Object
      },
      onToggleSearchListClick: {
        type: Function
      },
      isShowAllSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: {
        },
        searchList: null,
      }
    },
    watch: {
      searchOptions: {
        handler() {
          const searchList = [];
          let searchWrapperIndex = 0;
          const searchOptions = this.searchOptions;
          if (searchOptions && searchOptions.searchData && searchOptions.searchData.length) {
            searchOptions.searchData.forEach((item, index) => {
              if (item.name) {
                searchList[searchWrapperIndex] = searchList[searchWrapperIndex] || [];
                searchList[searchWrapperIndex].push({
                  name: item.name || '',
                  searchField: item.searchField || '',
                  selectList: item.selectList || [], // selectList格式 [{text: '11',value: 11 } ]
                  searchType: item.searchType || 'input', // input select time 输入框 选择框 时间
                  valueType: item.valueType || 'string', // number boolean string
                  value: item.value || item.value === 0 ? item.value : null,
                  isFilterable: item.isFilterable || false, // 是否可搜索
                  callFunction: item.callFunction,
                  placeholder: item.placeholder || item.name
                })
                // 数组切成每四个分隔(提供给前端样式显示)
                if (index % 4 === 3) {
                  searchWrapperIndex++;
                }
              }
            });
          }

          this.searchList = searchList;
        },
        immediate: true,
        deep: true
      }
    }
  }

</script>

<style scoped>
  /**需要穿透的 */
  /**文字label */
  .el-form-item >>> .el-form-item__label {
    float: none;
    display: inline-block;
    width: 110px;
    text-align: right;
  }

  /**input包裹器 */
  .el-form-item >>> .el-form-item__content {
    width: calc(100% - 110px);
  }
</style>

<style lang="scss" scoped>
  @keyframes light{
    from{
      opacity: 0.1;
    }
    to{
      opacity: 1;
    }
  }
  .top-form {
    position: relative;

    /**隐藏与显示搜索框 */
    & .show-all-search > .top-form-left__item {
      display: flex;
      // animation-name: light;
      // animation-duration: 1s;
      // animation-timing-function: linear;
    }

    &-left {
      display: inline-block;

      width: calc(100% - 70px);

      &__item {
        display: flex;

        & > .el-form-item {
          flex: 1
          // width: 25%;
        }
      }

      &__item:nth-of-type(n+3) {
        display: none;
      }
    }

    &-right {
      display: inline-block;
      position: absolute;
      bottom: 14px;
      right: 0;
      width: 70px;

      text-align: center;
      cursor: pointer;
      color: #409eff;
      font-size: 14px;
    }
  }

  /**item */
  .el-form--inline .el-form-item {
    display: inline-block;
    vertical-align: top;
    margin-right: 0;
    margin-bottom: 6px;
  }

  /**select包裹器 */
  .el-select {
    width: 100%;
  }

  /**时间选择器的宽 */
  .el-range-editor.el-input__inner {
    width: 100%;
  }
</style>
