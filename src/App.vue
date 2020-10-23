<template>
  <div id="app">
    <EleListPage
      :tableCommonOptions="tableCommonOptions"
      :listLoading="listLoading"
      :loadTableData="loadTableData"

      :tableList="tableList"
      :onSaveCustom="onSaveCustom"

      :searchForm="searchForm"
    ></EleListPage>
  </div>
</template>
<script>
import {
  getCustomizedColumnsList,
  getTableList,
  getSelectList,
}
from './api/table.js';
export default {
  name: 'app',
  data() {
    const tableCommonOptions = {
      searchOptions: {
        isAllHidden: false,
        searchData: [
          {
            name: '编号',
            searchField: 'code',
          },
          {
            name: '名称',
            searchField: 'name',
          },
          {
            name: '输入框0',
            searchField: 'spec',
          },
          {
            name: '状态',
            searchField: 'status',
            searchType: 'select'
          },
          {
            name: '输入框-1',
            searchField: 'categoryCode',
          },
          {
            name: '输入框1',
            searchField: 'categoryName',
          },
          {
            name: '输入框2',
            searchField: 'brandCode',
          },
          {
            name: '输入框3',
            searchField: 'brandName',
          },
          {
            name: '输入框4',
            searchField: 'materials',
          },
        ],
      },
      filterOptions: {
        isAllHidden: false,
        left: [
          {
            filterType: 'add',
            disabled: false,
            type: 'info'
          },
          {
            filterType: 'invalid',
            disabled: false
          },
          {
            filterType: 'valid',
            disabled: false
          },
          {
            filterType: 'export',
            disabled: true
          },
          {
            filterType: 'customColumns'
          }
        ],
        right: [
          {
            filterType: 'search',
            fn: () => {
              this.loadTableData();
            }
          },
          {
            filterType: 'clear',
            fn: () => {
              this.searchForm = {};
              // 看是否需要调用搜索
              this.loadTableData();
            }
          },
        ]
      },
      tableOptions: {
        underlineHandles: {
          code: ({row}) => {
            const params = {
              code: row.code || null 
            }
            alert('gotoDetail');
          }
        },
        columnsData: {
          showColumns: [],
          hiddenColumns: []
        },
        headerHandleOperation: {
          prop: 'operation',
          label: '操作',
          operationOptions: [{
            name: '修改',
            fn: ({row: {code}}) => {
              const params = {
                code
              }
              alert('gotoDetail');
            },
            disabled: false
          }, {
            name: '删除',
            type: 'danger',
            fn() {
              console.log('删除')
            },
            disabled: true,
          }]
        }
      },
      pagination: {
        total: 0,
        pageNo: 1,
        pageSize: 20
      }
    };
    return {
      tableCommonOptions,
      listLoading: false,
      searchForm: {},
      tableList: [],
    }
  },
  methods: {
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
      getSelectList().then(({data: result}) => {
        if (result) {
          for (let key in result) {
            searchData.forEach((item, index) => {
              if (key === item.searchField) {
                const selectList = [];
                result[key].forEach(resultChild => {
                  selectList.push({
                    text: resultChild.description,
                    value: resultChild.code
                  });
                });
                newSearchData[index].selectList = selectList;
              }
            });
          }
          this.tableCommonOptions.searchOptions.searchData = newSearchData;
        }
      })
    },
    loadTableData() {
      const searchForm = this.searchForm;
      const searchObject = {}
      const oldSeachForm = {...searchForm};
      const request = {
        ...searchObject,
        startPage: this.tableCommonOptions.pagination.pageNo,
        pageSize: this.tableCommonOptions.pagination.pageSize
      }

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
    this.loadSearchList();
    // // 加载自定义列数据
    this.loadCustomColumnsList();
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