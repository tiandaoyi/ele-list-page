<template>
  <div id="app">
    <div>
      asas
      <br/>
      asda
      asdasd
    </div>
    <button @click="a = !a">{{a}}</button>
    <EleListPage
      :tableCommonOptions="tableCommonOptions"
      :listLoading="listLoading"
      :loadTableData="loadTableData"

      :tableList="tableList"
      :onSaveCustom="onSaveCustom"

      :searchForm="searchForm"
      style="height: calc(100vh - 70px);"
      v-show="a"
    ></EleListPage>
    <EleListPage
      :tableCommonOptions="tableCommonOptions1"
      :listLoading="listLoading"
      :loadTableData="loadTableData"

      :tableList="tableList"
      :onSaveCustom="onSaveCustom"

      :searchForm="searchForm"
      style="height: calc(100vh - 70px);"
      v-show="!a"
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
            name: '编号1',
            searchField: 'code1',
            searchType: 'cascader',
            // props: { checkStrictly: true },
            // changeFunction: () => {
            //   console.log(...arguments)
            // },
            selectList: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]
          }]
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
    const tableCommonOptions1 = {
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
      a: true,
      tableCommonOptions,
      tableCommonOptions1,
      listLoading: false,
      searchForm: {
        // code1: []
      },
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
      console.log(searchForm)
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