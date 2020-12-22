<template>
  <div id="app">
    <EleListPage
      :tableCommonOptions="tableCommonOptions"
      :listLoading="listLoading"
      :loadTableData="loadTableData"

      :tableList="tableList"
      :onSaveCustom="onSaveCustom"

      :searchForm="searchForm"
      ref="table"
    ></EleListPage>
  </div>
</template>
<script>
import {
  getCustomizedColumnsList,
  getTableList,
  getSelectList,
} from './api/table.js';
export default {
  name: 'app',
  data() {
    const tableCommonOptions = {
      searchOptions: {
        isAllHidden: false,
        searchData: [],
      },
      filterOptions: {
        isAllHidden: false,
        left: [],
        right: []
      },
      tableOptions: {
        isHiddenMaxHeight: true,
        // 可否编辑取决于此字段
        canEdit: true,
        // maxWidth: true,
        isHiddenCheckBox: true,
        columnsData: {
          showColumns: [
            {
              label: '设备编号',
              prop: 'equNumber',
              editPlaceholder: '...',
              editHover: (...arg) => {
                this.editHover(...arg)
              },
              width: 170
            },
            {
              label: '商品名称',
              prop: 'itemName',
              // editLimit: true,
              width: 170
            },
            {
              label: '时间',
              prop: 'time',
              editType: 'time',
              timeType: 'date',
              width: 220,
              pickerOptions: {}
            },
            {
              label: '商品编号',
              prop: 'itemCode',
              editLimit: true,
              width: 170
            },
            {
              label: '归属营业店',
              prop: 'storeName',
              editLimit: true,
              width: 170
            },
            {
              label: '归属事业部',
              prop: 'deptName',
              editLimit: true,
              width: 170
            },
            {
              label: '租赁订单编号',
              prop: 'leaseOrderNumber',
              editLimit: true,
              width: 170
            },
            {
              label: '所在地址',
              prop: 'address',
              editLimit: true,
              width: 170
            },
            {
              label: '客户名称',
              prop: 'clientName',
              editLimit: true,
              width: 170
            },
            {
              label: '租赁状态',
              prop: 'leaseStateName',
              editLimit: true,
              width: 170
            },
            {
              label: '锁机状态',
              prop: 'lockStateName',
              editLimit: true,
              width: 170
            },
            {
              label: '执行状态描述',
              prop: 'resultDesc',
              editLimit: true,
              width: 170
            },
          ],
          hiddenColumns: []
        },
        headerHandleOperation: {
          prop: 'operation',
          label: '操作',
          width: 250,
          operationOptions: [{
            name: '行上移',
            fn: ({$index}) => {
              const tableList = this.tableList;
              if ($index !== 0) {
                tableList.splice($index - 1, 0, tableList[$index])
                tableList.splice($index + 1, 1)
              }
            },
            disabled: false
          }, {
            name: '行下移',
            fn: ({$index}) => {
              const tableList = this.tableList;
              if ($index !== tableList.length - 1) {
                tableList.splice($index + 2, 0, tableList[$index])
                tableList.splice($index, 1)
              }
            },
            disabled: false
          }, {
            name: '行删除',
            fn: (data) => {
              const tableList = this.tableList;
              tableList.splice(data.$index, 1)
              // this.deleteIds.push(data.row.id);
            },
            disabled: false
          }]
        }
      },
      pagination: {
        total: 0,
        pageNo: 1,
        pageSize: 20,
        isHidden: true
      }
    };
    return {
      a: true,
      tableCommonOptions,
      listLoading: false,
      searchForm: {
        // code1: []
      },
      tableList: [],
    }
  },
  methods: {
    requestSelectMethods({startPage, pageSize, total, queryValue}, selectList, obj, isClear = false) {
      // 核心 只要input为空或者输入 就清空且初始化
      if (isClear || queryValue === '' || queryValue === null) {
        obj.loadMoreOptions = {
          ...obj.loadMoreOptions,
          startPage: 1,
          total: 0,
        }
        obj.selectList = []
      }
      if (queryValue !== '' && queryValue !== null) {
        // 模拟真实请求：
        if (startPage === 1 || selectList.length < total) {
          // 示例
          // this.requestList({startPage, queryValue, pageSize}).then(({data, resTotal}) => {
          //   // data = [{value: 1, text: 1}]
          //   // 如果pageSize * startPage 最多能显示多少条 小于total 则可以继续加载， 否则不加载
          //   if (data?.length) {
          //     obj.selectList = obj.selectList.push(...(data || []))
          //     obj.loadMoreOptions = {
          //       ...obj.loadMoreOptions,
          //       startPage: startPage + 1,
          //       total: resTotal,
          //     }
          //   }
          // })
        }
      }
    },
    onSaveCustom(selectedNumber, closeDialog) {
      // 保存自定义列
      const request = {
        userModuleColumnsReqs: (selectedNumber || []).map((item, index) => {
          return {
            columnId: item,
            seq: index + 1
          }
        })
      };
      // 此处需要自己处理@TODO
      this.$store.dispatch('commodityInfoList/saveCustomColumns', request).then(() => {
        this.loadCustomColumnsList();
        // 更新列表数据
        this.loadTableData();
        closeDialog && closeDialog();
      })
      // 保存自定义列
    },
    loadSearchList() {
      // 初始化搜索项
      const searchData = this.tableCommonOptions.searchOptions.searchData;
      const newSearchData = [...searchData];
      // 搜索项下拉框列表填充
      // getSelectList().then(({data: result}) => {
      //   if (result) {
      //     for (let key in result) {
      //       searchData.forEach((item, index) => {
      //         if (key === item.searchField) {
      //           const selectList = [];
      //           result[key].forEach(resultChild => {
      //             selectList.push({
      //               text: resultChild.description,
      //               value: resultChild.code
      //             });
      //           });
      //           newSearchData[index].selectList = selectList;
      //         }
      //       });
      //     }
      //     this.tableCommonOptions.searchOptions.searchData = newSearchData;
      //   }
      // })
    },
    loadTableData() {
      const searchForm = this.searchForm;
      const request = {
        ...searchForm,
        startPage: this.tableCommonOptions.pagination.pageNo,
        pageSize: this.tableCommonOptions.pagination.pageSize
      }
      console.log(searchForm)

      getTableList(request).then(({data: {data: tableList, total}}) => {

        // 表格数据更新
        this.tableList = tableList || [],
        this.tableCommonOptions.pagination = {
          ...this.tableCommonOptions.pagination,
          total
        }
      });

    },
    loadCustomColumnsList() {
      // 获取自定义列列表
      getCustomizedColumnsList().then(({data}) => {
        // 接口的数据结构showColumns = [{showName, showField, id, refField}]
        // table表头所需
        const columnsMatchParams = {
          prop: 'showField',
          label: 'showName'
        };
        // 自定义列所需
        const customColumnsMatchParams = {
          key: 'id',
          label: 'showName'
        }
        const tableCommonOptions = this.tableCommonOptions;

        tableCommonOptions.tableOptions = {
          ...tableCommonOptions.tableOptions,
            columnsData: data,
            columnsMatchParams,
            customColumnsMatchParams
        }
      })
    },
  },
  mounted() {
    // // 初始化搜索项
    // this.loadSearchList();
    // // 加载自定义列数据
    // this.loadCustomColumnsList();
    // 加载表格数据
    this.loadTableData();
  },
  activated() {
    // 如果页面使用keep-alive，可以在此处调用加载表格数据接口
  }

}

</script>
<style>
  html, body, #app {
    height: 100%;
    margin: 0;
  }

</style>