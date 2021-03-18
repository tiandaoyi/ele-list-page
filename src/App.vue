<template>
  <div id="app" style="display: flex;flex-direction: column;">
    <div style="height: 300px">
      ssasdasdsadaa
    </div> -->
      <!-- <button @click="changeWidth">手动改变列宽</button> -->
      <div @click="toggleSelection([tableList[0]])">测试</div>
      <div @click="getAllSelection">获取所有勾选的数据</div>
    <!-- <el-form :model="{tableList}" > -->

      <EleListPage
        :tableCommonOptions="tableCommonOptions"
        :listLoading="listLoading"
        :loadTableData="loadTableData"

        :tableList="tableList"
        :onSaveCustom="onSaveCustom"

        :searchForm="searchForm"
        ref="table"
        :headerDragend="headerDragend"
        :selectionChange="selectionChange"
        style="flex: 1"
      >
        <!-- <template #table-empty>
          父组件的内1容
        </template> -->
        <!-- <template #table-empty>
          <div>
          <img src="@/assets/empty.png" alt="暂无数据" />
          </div>
        </template> -->

      </EleListPage>
  <!-- </el-form> -->

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
    var checkAge = (rule, value, callback) => {
      console.log(value, rule)
      callback()
      return
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    const tableCommonOptions = {
      searchOptions: {
        isAllHidden: false,
        searchData: [
          {
            name: '设备编号11',
            searchField: 'equNo',
            searchType: 'time',
            timeType: 'datetimerange',
            timeValueFormat: 'yyyy-MM-dd HH:mm:ss',
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
          },
          {
            name: '设备编号2',
            searchField: 'equNo2',
            searchType: 'time',
          },
          {
            name: '测试文本域',
            searchField: 'xx',
            searchType: 'textarea',
            width: '100%'
          },
          {
            name: '测试下拉框',
            searchField: 'xx',
            searchType: 'select',
            selectList: [{
              value: '1',
              text: 'a1'
            },{
              value: '2',
              text: 'a2'
            }],
            width: '100%',
            focus: (...arg) => {
              console.log('focus', arg)
            },
            change: (...arg) => {
              console.log('change', arg)
            }

          }
        ],
      },
      filterOptions: {
        isAllHidden: false,
        left: [],
        right: [
          {
            filterType: "search",
            type: '',
            fn: () => {
              this.loadTableData(true);
            },
          },
          {
            filterType: "clear",
            fn: () => {
              this.searchForm = {};
            },
          },
          {
            name:  '添加行',
            fn: () => {
              this.tableList.push({x:1})
            }
          },
          {
            name:  '测试功能',
            fn: () => {
              // this.tableList.push({x:1})
              // console.log(this.$refs.table.doLayout())
              // this.$refs.table.table.doLayout()
            }
          }
        ]
      },
      tableOptions: {
        // switchCols: {
        //   name: '设备交接',
        //   prop: 'disabled',
        //   activeText: '开启',
        //   change(...arg) {
        //     console.log(arg)
        //     arg[1].disabled = !arg[0]
        //     setTimeout(() => {
        //       arg[1].disabled = arg[0]
        //     }, 2000)
        //   }
        // },
        isHiddenBorder: true,
        // isHiddenMaxHeight: true,
        isHiddenCheckBox: false,
        isHiddenOrder: false,
        isHiddenTooltip: true,
        defaultImage: true,
        isUpdateTable: true,

        // selectable: (row, index) => {
        //   console.log(row)
        //   console.log(index)
        //   return index % 2 === 0
        // },
        // summaryMethod(param) {
        //   const { columns, data } = param;
        //   const sums = [];
        //   columns.forEach((column, index) => {
        //     if (index === 0) {
        //       sums[index] = "合计";
        //       return;
        //     }
        //     const countColumnArr = [4];
        //     if (countColumnArr.includes(index)) {
        //       // const values = data.map((item) =>
        //         // Number(delcommafy(item[column.property]))
        //       // );
        //       // if (!values.every((value) => isNaN(value))) {
        //       //   sums[index] = values.reduce((prev, curr) => {
        //       //     const value = Number(curr);
        //       //     if (!isNaN(value)) {
        //       //       return prev + curr;
        //       //     } else {
        //       //       return prev;
        //       //     }
        //       //   }, 0);
        //       //   // let newSum = comdify(sums[index])
        //       //   sums[index] = newSum += "";
        //       // } else {
        //       //   sums[index] = "N/A";
        //       // }
        //       sums[index] = 'N/A'
        //     } else {
        //       return;
        //     }
        //   });
        //   return sums;
        // },
        columnsData: {
          showColumns: [
            // {
            //   label: '编号',
            //   prop: 'number',
            //   editPlaceholder: '...',
            //   editHover: (...arg) => {
            //     this.editHover(...arg)
            //   },
            //   width: 170,
            // },
            {
              label: '哈哈名称',
              prop: 'name',
              // editLimit: true,
              // width: 170,
              // asyncHtml: (value) => {
              //   console.log(58, value)
              //   return value + '阿哈哈哈'
              // }
              rules: [{ validator: checkAge, trigger: ['change', 'blur'] }],
              required: true
              // rules: [{ required: true, trigger: 'change', message: '请选择人员角色'}],
            },
            {
              label: '名称2',
              prop: 'categoryName',
              // editLimit: true,
              width: 500,
              textAlign: 'right', 
              asyncHtml: (value) => {
                return `<span style="color:red">${value}</span>`
              },
              rules: [{ required: true, trigger: 'change' }]

              // rulesFunc: (row) => {
              //   console.log(row)
                // return [{ required: true, trigger: 'blur', message: '请选择证件类型！'}]
              // },
            },
            // {
            //   label: '时间',
            //   prop: 'time',
            //   editType: 'time',
            //   timeType: 'date',
            //   width: 220,
            //   pickerOptions: {}
            // }
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
            disabled: false,
            class: 'p0',
            asyncHtml: ({$index}) => {
              return $index === 1 ? '1' : ''
            }
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
        // isHidden: true
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
      checkAge,
      form: {
        tableList: []
      }
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.$refs['list-table'].$refs['el-table'].toggleRowSelection(row)
          // this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    getAllSelection() {
      console.log(this.$refs.table.multipleSelection)
    },
    selectionChange(list) {
      if (list.length > 1) {
        this.$nextTick(() => {
          this.$refs.table.table.toggleRowSelection(list[0])
        })
      }
    },
    changeWidth() {
      const curr = this.tableCommonOptions.tableOptions.canEdit
      // this.tableCommonOptions.tableOptions.canEdit = !curr
      this.$set(this.tableCommonOptions.tableOptions, 'canEdit', !curr)
    },
    headerDragend(...arg) {
      console.log(arg)
    },
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
        this.tableList = (tableList || []).map(item => {
          return {
            ...item,
            disabled: Math.random() > 0.5
          }
        })
        // this.tableList = []
        this.tableCommonOptions.pagination = {
          ...this.tableCommonOptions.pagination,
          total
        }
      });
      // this.tableList = [{name: ''}]

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

  /* .p0 {
    padding: 0!important;
  } */
  .ele-list-wrapper {
    height: initial;
  }
</style>