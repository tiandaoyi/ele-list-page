<template>
  <div
    class="ele-list-wrapper"
    ref="list-wrapper"
    :style="{paddingBottom: isLazyLoadStyle}"  
  >
    <!-- 搜索项 -->
    <ListTop 
      v-if="!tableCommonOptions.searchOptions.isAllHidden"
      ref="list-top"
      :searchForm.sync="searchForm"
      :searchOptions="tableCommonOptions.searchOptions"
      :onToggleSearchListClick="onToggleSearchListClick"
      :isShowAllSearch="isShowAllSearch"
    ></ListTop>

    <slot></slot>

    <!-- 快捷操作 -->
    <ListMiddle
      v-if="!tableCommonOptions.filterOptions.isAllHidden"
      ref="list-middle"
      :filterOptions="tableCommonOptions.filterOptions"
      :tableOptions="tableCommonOptions.tableOptions"
      :onSaveCustom="onSaveCustom"
      :isVisible="isVisible"
      :multipleSelection="multipleSelection"
      :isMoveTop="isMoveTop"
    />
    
    <!-- 表格 -->
    <ListTable 
      v-if="tableCommonOptions.tableOptions"
      ref="list-table"
      :tableList="tableList" 
      :tableOptions="tableCommonOptions.tableOptions"
      :headerDragend="headerDragend"
      :listLoading="listLoading"
      :height="height || pageHeight"
      :handleSelectionChange="handleSelectionChange"
      :isKeepSelect="isKeepSelect"
      :keepSelectKey="keepSelectKey"
      :isLazyLoad="isLazyLoad"
    >
      <slot name="table"></slot>
      <template #table-empty>
        <slot name="table-empty"></slot>
      </template>
    </ListTable>

    <!-- 分页 -->
    <Pagination
      v-if="tableCommonOptions.pagination && !tableCommonOptions.pagination.isAllHidden"
      ref="list-pagination"
      class="ele-list-pagination"
      :pagination.sync="tableCommonOptions.pagination"
      :loadTableData="loadTableData"
      :pageSizes="pageSizes"
    ></Pagination>
    
    <!--穿梭框自定义列-->
    <TransferDialog
      v-if="tableCommonOptions.tableOptions"
      ref="list-transferDialog"
      :onSaveCustom="onSaveCustom"
      :visible='visible'
      :isVisible='isVisible'
      :tableOptions.sync="tableCommonOptions.tableOptions"
    ></TransferDialog> 
  </div>
</template>
<script>
import ListTop from './ListTop';
import ListMiddle from './ListMiddle';
import ListTable from './ListTable';
import Pagination from './Pagination';
import TransferDialog from './TransferDialog'
export default {
name: 'EleListPage',
  props: {
    tableCommonOptions: {
      type: Object,
      required: true
    },
    listLoading: {
      type: Boolean,
      default: true,
    },
    loadTableData: {
      type: Function,
      default: function() {}
    },
    tableList: {
      type: Array,
      default: function () {
        return [];
      }
    },
    onSaveCustom: {
      type: Function
    },
    searchForm: {
      type: Object
    },
    height: {
      type: [Number,String],
      default: null
    },
    isSimpleCutHeight: {
      type: Boolean,
      default: false
    },
    isKeepSelect: {
      type: Boolean,
      default: false 
    },
    keepSelectKey: {
      type: String,
      default: null
    },
    defaultSelect: {
      type: [String, Array],
    },
    cutHeight: {
      type: Number,
      default: 180
    },
    isMoveTop: {
      type: Boolean,
      default: false
    },
    // 是否懒加载
    isLazyLoad: {
      type:  Boolean,
      default: false
    },
    // 列宽拖拽修改
    headerDragend: {
      type: Function,
      default: function () {}
    },
    pageSizes: {
      type: Array,
      default: function() {
        return [20, 50, 100]
      }
    }
  },
  components: {
    ListTop,
    ListMiddle,
    ListTable,
    Pagination,
    TransferDialog
  },
  data() {
    return {
      visible: false,
      pageHeight: null,
      isShowAllSearch: false,
      multipleSelection: []
    }
  },
  methods: {
    clearMultipleSelection() {
      this.multipleSelection = []
    },
    handleSelectionChange(val) {
      if (this.isKeepSelect) {
        // this.multipleSelection = val
        // this.multipleSelection = _.uniqWith(val, _.isEqual);
        this.multipleSelection = this.duplicate(val, this.keepSelectKey)
      } else {
        this.multipleSelection = val
      }
    },
    getHeight(id) {
      return this.$refs[id]?.offsetHeight || this.$refs[id]?.$el?.offsetHeight || 0
    },
    // 改变弹框状态
    isVisible(isShow) {
      this.visible = isShow;
    },
    setTableHeight() {
      const pageHeight = 
        this.isSimpleCutHeight ? (document.body.clientHeight - this.cutHeight) : 
        (this.getHeight('list-wrapper') - 
        this.getHeight('list-top') -
        this.getHeight('list-middle') -
        this.getHeight('list-pagination') - 36)
      this.pageHeight = pageHeight;
    },
    
    onToggleSearchListClick() {
      this.isShowAllSearch = !this.isShowAllSearch;
      // 如果没传height， 自适应
      if (!this.height) {
        this.$nextTick(() => {
          this.setTableHeight();
        });
      }
      
    },
    doLayout() {
      this.$refs['list-table']?.$refs['el-table']?.doLayout()
    },
    duplicate(arr, key) {
      let obj = {}
      return arr.reduce((cur,next) => {
        obj[next[key]] ? "" : obj[next[key]] = true && cur.push(next);
        return cur;
      },[])
    }
  },
  mounted() {
    // 如果没传height， 自适应
    if (!this.height) {
      this.$nextTick(() => {
        this.setTableHeight();
      });
    }
  },
  watch: {
    // tableList: {
    //   handler() {
    //     if (this.isKeepSelect) {
    //       const key = this.keepSelectKey || ''
    //       const simpleArray = []
    //       this.multipleSelection.forEach(item => {
    //         if (item[key]) {
    //           simpleArray.push(item[key])
    //         }
    //       })
    //       const tableRows = []
    //       this.tableList.forEach((item, index) => {
    //         if (simpleArray.includes(item[key])) {
    //           tableRows.push(index)
    //         }
    //       })
    //       this.multipleSelection.forEach((row, index) => {
    //         if (this.tableList[tableRows[index]]) {

    //           this.$refs['list-table']?.$refs['el-table']?.toggleRowSelection(this.tableList[tableRows[index]], true)
    //         }
    //       });


    //     }
    //   },
    //   immediate: true 
    // },

    tableList: {
      handler() {
        if (this.isKeepSelect) {
          // v3.0 废弃
          return
          const key = this.keepSelectKey
          // 遍历所有勾选的单字段数组 [1,2,3]
          const simpleArray = this.multipleSelection.map(item => item[key])
          // 匹配当前页勾选的数组 // [1,2,3]
          const tableRows = []
          // 遍历当前页的所有数据, 把勾选的单字段数组的值去匹配当前页的所有数据, 如果匹配到了, 自动勾选
          this.tableList.forEach((item, index) => {
            if (simpleArray.includes(item[key])) {
              tableRows.push(item[key])
            }
          })
          // 遍历已勾选的数组, 默认勾选上
          this.multipleSelection.forEach((row, index) => {
            // if (this.tableList[tableRows[index]]) {
            if (tableRows.includes(row[key]) ) {
              this.$refs['list-table']?.$refs['el-table']?.toggleRowSelection(this.tableList.find(tab => tab[key] === row[key]), true)
            }
          });


        }
      },
      immediate: true 
    },
    multipleSelection() {
      this.$emit('selectionChange', this.multipleSelection);
    },
    defaultSelect: {
      handler(val) {
        if (val) {
          const key = this.keepSelectKey
          setTimeout(() => {
            this.multipleSelection = val.split(',').map(item => {
              return {
                [key]: item
              }
            })
            const tableRows = []
            this.tableList.forEach((item, index) => {
              if (val.split(',').includes(item[key])) {
                tableRows.push(index)
              }
            })
            this.multipleSelection.forEach((row, index) => {
              if (this.tableList[tableRows[index]]) {

                this.$refs['list-table']?.$refs['el-table']?.toggleRowSelection(this.tableList[tableRows[index]], true)
              }
            });

          })
        } else if (val === '') {
          this.$refs['list-table']?.$refs['el-table']?.clearSelection()
        }
      },
      immediate: true
    },
    ['tableCommonOptions.tableOptions.canEdit']: {
      handler() {
        if (!this.height) {
          this.$nextTick().then(() => {
            this.setTableHeight();
          }).then(() => {
            this.$refs['list-table']?.$refs['el-table']?.doLayout()
          })
        }
      },
      immediate: true 
    }
  },
  computed: {
    isLazyLoadStyle() {
      return this.isLazyLoad ? '0': ''
    },
    table() {
      return this.$refs['list-table']?.$refs['el-table'] || {}
    }
  }

}

</script>
