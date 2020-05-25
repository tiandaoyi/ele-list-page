<template>
  <div v-show="!pagination.isHidden">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.pageNo"
      :page-sizes="pageSizes"
      v-bind:page-size.sync="pagination.size || 20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      >
    </el-pagination>
  </div>

</template>
<script>
  export default {
    props: {
      loadTableData: {
        type: Function,
        default: function() {}
      },
      pagination: {
        type: Object,
        default: function () {
          // 可以封装一下初始化的分页数据
          return {
            total: 0,
            pageNo: 1,
            pageSize: 20
          }
        }
      }
    },
    methods: {
      // 切换每页显示最大条数
      handleSizeChange(val) {
        // 每次切换时当前页变为第一页
        this.$emit('update:pagination', {
          ...this.pagination,
          pageSize: +val,
          pageNo: 1
        });
        this.loadTableData();
      },
      // 切换当前页
      handleCurrentChange(val) {
        this.$emit('update:pagination', {
          ...this.pagination,
          pageNo: +val
        });
        this.loadTableData();
      },
    },
    data() {
      return {
        // 可扩展
        pageSizes: [10, 15, 20, 50, 100]
      };
    },
  }

</script>
