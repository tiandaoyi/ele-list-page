<template>
  <div id="list-wrapper" class="list-wrapper">
    <!-- 搜索项 -->
    <ListTop 
      id="list-top" 
      :searchForm="searchForm"
      :searchOptions="tableCommonOptions.searchOptions"
      :onToggleSearchListClick="onToggleSearchListClick"
      :isShowAllSearch="isShowAllSearch"
    ></ListTop>

    <!-- 快捷操作 -->
    <ListMiddle 
      id="list-middle"
      :filterOptions="tableCommonOptions.filterOptions"
      :tableOptions="tableCommonOptions.tableOptions"
      :onSaveCustom="onSaveCustom"
      :isVisible="isVisible"
      :multipleSelection="multipleSelection"
    />
    
    <!-- 表格 -->
    <ListTable 
      id="list-table"
      :tableList="tableList" 
      :tableOptions="tableCommonOptions.tableOptions"
      :headerDragend="headerDragend"
      :listLoading="listLoading"
      :height="height || pageHeight"
      :handleSelectionChange="handleSelectionChange"
    ></ListTable>

    <!-- 分页 -->
    <Pagination 
      id="list-pagination"
      class="list-pagination"
      :pagination.sync="tableCommonOptions.pagination"
      :loadTableData="loadTableData"
    ></Pagination>
    
    <!--穿梭框自定义列-->
    <TransferDialog
      id="list-transferDialog"
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
      type: Number,
      default: null
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //表格列宽修改事件 
    headerDragend(newWidth, oldWidth, column) {
      if (column.label !== '序号') {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    getHeight(id) {
      return document.getElementById(id).offsetHeight;
    },
    // 改变弹框状态
    isVisible(isShow) {
      this.visible = isShow;
    },
    setTableHeight() {
      const pageHeight = 
        document.getElementById("app").clientHeight - 
        this.getHeight('list-top') -
        this.getHeight('list-middle') -
        this.getHeight('list-pagination') - 64;
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
    multipleSelection() {
      this.$emit('selectionChange', this.multipleSelection);
    }
  }

}

</script>
<style lang="scss" scoped>
  .list {
    &-wrapper {
      height: 100%;
      position: relative;
    }

    &-pagination {
      position: absolute;
      bottom: 0;
    }
  }

</style>