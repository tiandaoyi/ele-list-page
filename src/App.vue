<template>
  <div id="app" style="display: flex;flex-direction: column;">
    <div style="height: 300px">
      ssasdasdsad

      <div @click="toggleSelection([tableList[0]])">测试</div>
      <div @click="getAllSelection">获取所有勾选的数据</div>
      <div @click="clearSelected">clearSelected</div>
    </div>
    <!-- <button @click="changeWidth">手动改变列宽</button> -->

    <!-- <el-form :model="{tableList}" > -->

      <EleListPage
        :thousand="['erpName']"

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
        :keepSelectKey="'id'"
        :isKeepSelect="true"
        :pageSizes="[15, 30, 99]"
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
            required: true,
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
            required: true
          },
          {
            name: '测试visible-change',
            searchField: 'visibleChange',
            searchType: 'select',
            selectList: [{text: 'a', value: 'valuea'}, {text: 'b', value: 'valueb'}],
            visibleChange: (val) => {
              console.log(val)
            },
          },
          {
            name: '测试文本域',
            searchField: 'xx',
            searchType: 'textarea',
            width: '100%'
          },
          {
            name: '测试label 测试label 测试label',
            searchField: 'xxx',
            searchType: 'doubleInput',
            required: true,
          },
          {
            name: '测试下拉框',
            searchField: 'xx',
            searchType: 'select',
            required: true,
            selectList: [{
              value: '1',
              text: 'a1'
            },{
              value: '2',
              text: 'a2'
            }],
            width: '100%',
            // focus: (...arg) => {
            //   console.log('focus', arg)
            // },
            // change: (...arg) => {
            //   console.log('change', arg)
            // },
            isFilterable: true,
            loadMoreInput: (...arg) => {
              console.log('loadMoreInput', arg)
            },

          },
          {
            name: "测试",
            searchField: "deptCode",
            searchType: "cascader",
            clearable: true,
            placeholder: 'aaaa',
            isFilterable: true,
            required: true,
            props: {
              multiple: true,
              // label: "name",
              // value: "id",
            },
            selectList: [
              {
                id: 1,
                label: "上海"
              },
              {
                id: 1,
                label: "2222"
              },
              {
                id: 1,
                label: "33333"
              },
              {
                id: 1,
                label: "44444"
              }
            ]
          },
        ],
        showFieldCount: 10
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
        sortChange: (e) => {
          console.log(e)
        },
        // canEdit: true,
        switchCols: {
          title: '设备交接',// 标题
          key: 'equipmentReceipt',// 后端字段
          prop: 'equipmentReceipt',// 对应列的字段名
          activeTextKey: '_equipmentReceipt', // 接口返回的数据要自己转的字段
          disabledKey: '_disabled',// 禁用的字段, 需要自己处理
          activeValue: 1,// 生效的值
          inactiveValue: 0,// 失效的值
          change: (value, rows) => {
            // const {uuid, equipmentReceipt, name, state} = rows
            // rows.equipmentReceipt = equipmentReceipt === 1 ? 0 : 1
            // const params = {
            //   equipmentReceipt,
            //   uuid,
            // }
            // if (state === 0) { // 正常情况下不会出现这个
            //   this.$message.warning('司机被禁用,不可操作')
            //   return
            // }
            // this.$confirm(`确认为司机${name}${equipmentReceipt !== 1 ? '关闭' : '开启'}设备交接？`, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
            //   this.$http.post(this.$CONFIG.car.changeEquipmentReceipt, params).then(({data, msg}) => {
            //   this.$message.success('操作成功')
            //   this.loadTableData()
            // })
            // }).catch(() => {})
          },
          disabled: false,
          width: 120
        },
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
        // isHiddenTooltip: true,
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
							label: '支持场景分',
							prop: 'ss',
							width: 200,
							editType: 'select',
							multiple: true,
              editOptions: [], // [3]
              sortable: true
            },
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
              required: true,
              editChange: (value, {$index, row}) => {
                console.log(value)
              },
              fixed: true
            },
            {
              label: '自定义render列',
              prop: 'render',
              render: (h, { value }) => {
                return h('span', [
                  h('el-rate', {
                    attrs: {
                      value,
                      disabled: true
                    }
                  }),
                  h('span', `${value}分`)
                ])
              },
            },
            {
              label: '单重',
              prop: 'name',
              width: 170,
              appendKey: 'categoryName',
              isFilter: true,
              // filterPlacement: 'top-end' // 可选，默认"bottom-end"
            },
              // rules: [{ required: true, trigger: 'change', message: '请选择人员角色'}],
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
            {
              label: 'enn',
              prop: 'erpName',
              tooltip: '点击查看xx',
              click(e) {
                // 判断下是不是符合规则
                console.log('320', e)
              },
              class: 'underline',
              tooltipKey: '_tooltip',
              underlineKey: '_underline'
            }
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
            getIsShow: ({$index}) => {
              return $index % 3 === 0
            }
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
        pageSize: 15,
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
    clearSelected() {
      this.$refs.table.doLayout()
    },
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
      // if (list.length > 1) {
      //   this.$nextTick(() => {
      //     this.$refs.table.table.toggleRowSelection(list[0])
      //   })
      // }
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

      getTableList(request).then(({data: {data: tableList, total}}) => {
        // 表格数据更新
        this.tableList = (tableList || []).map((item, index) => {
          return {
            ...item,
            disabled: Math.random() > 0.5,
            ss: ['1'],
            id: this.tableCommonOptions.pagination.pageNo + '-' + index,
            render: +(Math.random() * 5).toFixed(2)
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

  .p0 {
    padding: 0!important;
  }
  .ele-list-wrapper {
    height: initial;
  }

  .test-class {
    color: blue;
  }

</style>
