<template>
  <el-dialog :close-on-click-modal='false' title="自定义列设置" :visible.sync="visible" :width="width" :center="true"
    :show-close='true' class="dialog" :before-close="() => isVisible(false)">
    <el-transfer
      filterable
      filter-placeholder="字段筛选"
      v-model="tempSelectedNumber"
      :data="columnsData"
      :titles="['隐藏字段', '显示字段']"
      target-order="push"
      :props="transferProps"
      @right-check-change="onRightCheckedChange($event)"
      @change="onRightChange($event)"
      :button-texts="['左移', '右移']"
    >
    </el-transfer>

    <div class="move-index">
      <el-button size="mini" type="primary" icon="el-icon-arrow-up" :disabled="moveTopDisabled" @click="onMoveIndexClick('TOP')">上移</el-button>
      <el-button size="mini" type="primary"  :disabled="moveBottomDisabled" @click="onMoveIndexClick('BOTTOM')">下移<i class="el-icon-arrow-down"></i></el-button>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible(false)" size='mini'>取 消</el-button>
      <el-button type="primary" @click="onSaveCustom(tempSelectedNumber, isVisible);" size='mini'>保 存</el-button>
    </span>
  </el-dialog>

</template>

<script>
  export default {
    value: "TransferDialog",
    props: {
      width: {
        type: String,
        default: '650px'
      },
      //显示隐藏
      visible: {
        type: Boolean,
        default: false
      },
      //切换弹框状态
      isVisible: {
        type: Function,
        default: function () {}
      },
      //保存
      submitDefined: {
        type: Function,
        default: function () {}
      },
      tableOptions: {
        type: Object
      },
      onSaveCustom: {
        type: Function
      }
    },
    data() {
      return {
        // 上排序按钮是否禁用
        moveTopDisabled: true,
        // 下排序按钮是否禁用
        moveBottomDisabled: true,
        // 右侧选中数组（临时变量）
        rightCheckedArray: [],
        // 实际显示选中变量
        // selectedNumber: []
        tempSelectedNumber: []
      }
    },
    methods: {
      onRightChange(tempSelectedNumber) {
        this.updateSelectedNumber(tempSelectedNumber);
        
        if (tempSelectedNumber.indexOf(this.rightCheckedArray[0]) === -1) {
          this.rightCheckedArray = [];
        }
        this.updateOrderButtonStatus();
      },
      onRightCheckedChange(rightCheckedArray) {
        this.rightCheckedArray = rightCheckedArray;
        this.updateOrderButtonStatus();
      },
      updateOrderButtonStatus(rightCheckedArray = this.rightCheckedArray, tempSelectedNumber = this.tempSelectedNumber) {
        // 右侧必须是单选 且 右侧长度大于1 否则返回
        if (rightCheckedArray.length === 0 || rightCheckedArray.length > 1 || tempSelectedNumber.length < 2) {
          this.moveTopDisabled = true;
          this.moveBottomDisabled = true;
          return;
        }

        if (rightCheckedArray && rightCheckedArray.length === 1) {
          this.moveTopDisabled = false;
          this.moveBottomDisabled = false;
          if (rightCheckedArray[0] === tempSelectedNumber[0]) { // 如果是第一个不可向上
            this.moveTopDisabled = true;
          }
          if (rightCheckedArray[0] === this.tempSelectedNumber[tempSelectedNumber.length - 1]) { // 如果是最后一个不可向下
            this.moveBottomDisabled = true;
          }
        }
      },
      // 单击排序
      onMoveIndexClick(flag) {
        const tempSelectedNumber = [...this.tempSelectedNumber];
        const checkedNum = this.rightCheckedArray[0];
        const index = tempSelectedNumber.indexOf(checkedNum)
        if (flag === 'TOP') {
          tempSelectedNumber.splice(index - 1, 0, checkedNum);
          tempSelectedNumber.splice(index + 1, 1);
        } else {
          tempSelectedNumber.splice(index + 2, 0, tempSelectedNumber[index]);
          tempSelectedNumber.splice(index, 1);
        }
        // 更新选择的顺序
        this.updateSelectedNumber(tempSelectedNumber);
        // 更新按钮状态
        this.updateOrderButtonStatus();
      },
      updateSelectedNumber(tempSelectedNumber = this.tempSelectedNumber) {
        this.tempSelectedNumber = [...tempSelectedNumber];
      }
    },
    computed: {
      columnsData() {
        const allColumns = this.tableOptions.columnsData.showColumns.concat(this.tableOptions.columnsData.hiddenColumns);
        return allColumns;
      },
      transferProps() {
        const tableOptions = this.tableOptions;
        return {
          key: tableOptions && tableOptions.customColumnsMatchParams ? tableOptions.customColumnsMatchParams.key : 'key',
          label: tableOptions && tableOptions.customColumnsMatchParams ? tableOptions.customColumnsMatchParams.label : 'label',
          disabled: false
        }
      }
    },
    watch: {
      columnsData() {
        this.tempSelectedNumber = this.tableOptions.columnsData.showColumns.map((item) => item[this.tableOptions.customColumnsMatchParams.key]);
      }
    }
  }

</script>
<style lang="scss" scoped>

  .el-dialog__body {
    display: flex;
  }

  .el-transfer {
    margin: 0 auto;
  }

  .dragger>div {
    margin: 0 auto;
    width: 30%;

    display: flex;
    justify-content: center;
    align-items: center;

    .el-checkbox.is-bordered {
      margin-left: 10px;
      width: 200px;
      text-align: left;
      margin-bottom: 5px;
    }

    .index {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-right: 5px;
      background: #c0c4cc;
      border-radius: 50%;
      text-align: center;
    }
  }

</style>
<style scoped>
  .move-index {
    position: absolute;
    top: calc(50% + 40px);
    left: calc(50% - 12px);
    transform: translate(-50%, -50%);
  }

</style>
<style lang="scss">

  .dialog .el-transfer__button i, .el-transfer__button span {
    font-size: 12px;
  }

  .dialog .el-transfer__buttons {
    padding: 10px;
  }

  .dialog .el-transfer__buttons .el-transfer__button {
    width: 73px;
    height: 29px;
    padding: 0;
  }

</style>
